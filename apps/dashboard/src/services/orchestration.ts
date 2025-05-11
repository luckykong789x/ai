export interface AIAgent {
  id: string;
  name: string;
  model: string;
  temperature: number;
}

export interface Draft {
  id: string;
  content: string;
  agentId: string;
  timestamp: Date;
}

export interface Feedback {
  score: number;
  rationale: string;
  suggestions: string;
  blocking: boolean;
}

export interface RubricJSON {
  score: number; // 0-1 score
  rationale: string;
  suggestions?: string;
  blocking: boolean;
}

export interface OrchestrationConfig {
  maxRounds: number;
  minScore: number;
  agents: AIAgent[];
}

export interface OrchestrationState {
  goal: string;
  round: number;
  drafts: Draft[];
  feedback: Record<string, Feedback>;
  integratedDraft: string | null;
  status: 'idle' | 'collecting_drafts' | 'integrating' | 'collecting_feedback' | 'evaluating' | 'complete' | 'stopped';
  history: string[];
  finalOutput: string | null;
}

const DEFAULT_CONFIG: OrchestrationConfig = {
  maxRounds: 4,
  minScore: 0.85,
  agents: [
    { id: 'ai-1', name: 'AI-1', model: 'deepseek-chat', temperature: 0.7 },
    { id: 'ai-2', name: 'AI-2', model: 'deepseek-chat', temperature: 0.7 }
  ]
};

const mockAIResponse = (prompt: string, agent: AIAgent): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (prompt.includes('draft')) {
        if (agent.id === 'ai-1') {
          resolve(`${agent.name} の案: ${prompt.substring(0, 50)}... に関する詳細な分析結果です。`);
        } else {
          resolve(`${agent.name} の提案: ${prompt.substring(0, 50)}... についての代替アプローチです。`);
        }
      } else if (prompt.includes('critique') || prompt.includes('feedback')) {
        const score = Math.random() * 0.5 + 0.5; // Random score between 0.5 and 1.0
        const feedback = {
          score,
          rationale: `${score > 0.8 ? '良い点が多い' : '改善の余地あり'}。${agent.name}からのフィードバック。`,
          suggestions: score > 0.9 ? '' : '構成をより明確にし、具体例を追加することを推奨します。',
          blocking: score < 0.7
        };
        resolve(JSON.stringify(feedback, null, 2));
      }
    }, 1000);
  });
};

const integrateOutputs = (drafts: Draft[]): string => {
  let integrated = "# 統合された出力\n\n";
  
  integrated += "## 統合ポイント\n\n";
  
  drafts.forEach((draft, index) => {
    integrated += `### ${index + 1}. ${draft.agentId} からの貢献\n`;
    integrated += `${draft.content.substring(0, 100)}...\n\n`;
  });
  
  integrated += "## 矛盾の解決\n\n";
  integrated += "両方の視点を考慮し、最適な解決策を提示します。\n\n";
  
  integrated += "## 最終統合案\n\n";
  integrated += "上記の貢献を統合した最終案です。\n";
  
  return integrated;
};

const evaluateLoop = (feedback: Record<string, Feedback>, config: OrchestrationConfig): { continue: boolean; reason: string } => {
  const scores = Object.values(feedback).map(f => f.score);
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  const hasBlockingFeedback = Object.values(feedback).some(f => f.blocking);
  
  if (avgScore >= config.minScore) {
    return { continue: false, reason: `平均スコア ${avgScore.toFixed(2)} が閾値 ${config.minScore} を超えました` };
  }
  
  if (!hasBlockingFeedback && avgScore > 0.7) {
    return { continue: false, reason: 'ブロッキングフィードバックがなく、スコアが十分高いです' };
  }
  
  return { continue: true, reason: `平均スコア ${avgScore.toFixed(2)} が閾値に達していません` };
};

const compressHistory = (history: string[]): string => {
  if (history.length <= 3) return history.join('\n\n');
  
  return [
    '# 圧縮された履歴',
    '...(前回までの履歴は省略)...',
    ...history.slice(-3)
  ].join('\n\n');
};

export class OrchestrationService {
  private config: OrchestrationConfig;
  private state: OrchestrationState;
  private listeners: ((state: OrchestrationState) => void)[] = [];
  
  constructor(config?: Partial<OrchestrationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      goal: '',
      round: 0,
      drafts: [],
      feedback: {},
      integratedDraft: null,
      status: 'idle',
      history: [],
      finalOutput: null
    };
  }
  
  subscribe(listener: (state: OrchestrationState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private updateState(newState: Partial<OrchestrationState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
  
  async start(goal: string): Promise<void> {
    this.updateState({
      goal,
      round: 1,
      drafts: [],
      feedback: {},
      integratedDraft: null,
      status: 'collecting_drafts',
      history: [`ゴール: ${goal}`],
      finalOutput: null
    });
    
    await this.runLoop();
  }
  
  stop(): void {
    this.updateState({ status: 'stopped' });
  }
  
  private async runLoop(): Promise<void> {
    while (this.state.status !== 'stopped' && this.state.status !== 'complete') {
      if (this.state.round > this.config.maxRounds) {
        this.updateState({
          status: 'complete',
          finalOutput: this.state.integratedDraft || '最大ラウンド数に達しました',
          history: [...this.state.history, `最大ラウンド数 (${this.config.maxRounds}) に達したため終了`]
        });
        break;
      }
      
      switch (this.state.status) {
        case 'collecting_drafts':
          await this.collectDrafts();
          break;
        case 'integrating':
          await this.integrateOutputs();
          break;
        case 'collecting_feedback':
          await this.collectFeedback();
          break;
        case 'evaluating':
          await this.evaluateFeedback();
          break;
        default:
          break;
      }
    }
  }
  
  private async collectDrafts(): Promise<void> {
    const drafts: Draft[] = [];
    const compressedHistory = compressHistory(this.state.history);
    
    for (const agent of this.config.agents) {
      const prompt = `
        # タスク
        ${this.state.goal}
        
        # 履歴
        ${compressedHistory}
        
        # 指示
        上記のタスクに対する解決案を提案してください。
      `;
      
      try {
        const content = await mockAIResponse(prompt, agent);
        drafts.push({
          id: `draft-${this.state.round}-${agent.id}`,
          content,
          agentId: agent.id,
          timestamp: new Date()
        });
        
        this.updateState({
          drafts: [...this.state.drafts, ...drafts],
          history: [...this.state.history, `${agent.name} からのドラフト (ラウンド ${this.state.round}): ${content.substring(0, 50)}...`]
        });
      } catch (error) {
        console.error(`Error getting draft from ${agent.name}:`, error);
      }
    }
    
    this.updateState({ status: 'integrating' });
  }
  
  private async integrateOutputs(): Promise<void> {
    const currentDrafts = this.state.drafts.filter(
      draft => draft.id.startsWith(`draft-${this.state.round}`)
    );
    
    if (currentDrafts.length === 0) {
      this.updateState({
        status: 'complete',
        finalOutput: 'ドラフトの収集に失敗しました',
        history: [...this.state.history, 'ドラフトの収集に失敗したため終了']
      });
      return;
    }
    
    const integrated = integrateOutputs(currentDrafts);
    
    this.updateState({
      integratedDraft: integrated,
      status: 'collecting_feedback',
      history: [...this.state.history, `統合されたドラフト (ラウンド ${this.state.round}): ${integrated.substring(0, 50)}...`]
    });
  }
  
  private async collectFeedback(): Promise<void> {
    const feedback: Record<string, Feedback> = {};
    const integrated = this.state.integratedDraft;
    
    if (!integrated) {
      this.updateState({
        status: 'complete',
        finalOutput: '統合ドラフトの作成に失敗しました',
        history: [...this.state.history, '統合ドラフトの作成に失敗したため終了']
      });
      return;
    }
    
    for (const agent of this.config.agents) {
      const prompt = `
        # タスク
        ${this.state.goal}
        
        # 統合ドラフト
        ${integrated}
        
        # 指示
        上記の統合ドラフトを評価し、以下のJSON形式でフィードバックを提供してください:
        {
          "score": 0-1の数値 (品質スコア),
          "rationale": "評価理由の説明",
          "suggestions": "改善のための提案 (必要な場合)",
          "blocking": true/false (重大な問題があるか)
        }
      `;
      
      try {
        const response = await mockAIResponse(prompt, agent);
        const parsedFeedback = JSON.parse(response) as RubricJSON;
        
        feedback[agent.id] = {
          score: parsedFeedback.score,
          rationale: parsedFeedback.rationale,
          suggestions: parsedFeedback.suggestions || '',
          blocking: parsedFeedback.blocking
        };
        
        this.updateState({
          feedback: { ...this.state.feedback, ...feedback },
          history: [...this.state.history, `${agent.name} からのフィードバック (ラウンド ${this.state.round}): スコア ${parsedFeedback.score.toFixed(2)}`]
        });
      } catch (error) {
        console.error(`Error getting feedback from ${agent.name}:`, error);
      }
    }
    
    this.updateState({ status: 'evaluating' });
  }
  
  private async evaluateFeedback(): Promise<void> {
    const currentFeedback = Object.fromEntries(
      Object.entries(this.state.feedback).filter(([key]) => 
        this.config.agents.some(agent => agent.id === key)
      )
    );
    
    if (Object.keys(currentFeedback).length === 0) {
      this.updateState({
        status: 'complete',
        finalOutput: this.state.integratedDraft || 'フィードバックの収集に失敗しました',
        history: [...this.state.history, 'フィードバックの収集に失敗したため終了']
      });
      return;
    }
    
    const evaluation = evaluateLoop(currentFeedback, this.config);
    
    if (evaluation.continue && this.state.round < this.config.maxRounds) {
      this.updateState({
        round: this.state.round + 1,
        status: 'collecting_drafts',
        history: [...this.state.history, `評価結果: ${evaluation.reason}。ラウンド ${this.state.round + 1} に進みます。`]
      });
    } else {
      this.updateState({
        status: 'complete',
        finalOutput: this.state.integratedDraft || '最終出力の生成に失敗しました',
        history: [...this.state.history, `評価結果: ${evaluation.reason}。プロセスを終了します。`]
      });
    }
  }
  
  getState(): OrchestrationState {
    return this.state;
  }
}

export const orchestrationService = new OrchestrationService();
