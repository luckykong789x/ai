import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';
import { t } from '../../lib/i18n';
import { useToast } from '../../hooks/use-toast';
import { orchestrationService, OrchestrationState } from '../../services/orchestration';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  metadata?: {
    round?: number;
    score?: number;
    type?: 'draft' | 'feedback' | 'integrated' | 'system';
  };
}

export const OrchestrationChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [orchestrationState, setOrchestrationState] = useState<OrchestrationState | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const unsubscribe = orchestrationService.subscribe((state) => {
      setOrchestrationState(state);
      
      if (state.history.length > 0) {
        const newMessages: Message[] = state.history.map((historyItem, index) => {
          let sender = 'system';
          if (historyItem.includes('AI-1')) sender = 'AI-1';
          else if (historyItem.includes('AI-2')) sender = 'AI-2';
          else if (historyItem.includes('統合')) sender = 'orchestrator';
          else if (historyItem.includes('フィードバック')) {
            sender = historyItem.includes('AI-1') ? 'AI-1' : 'AI-2';
          }
          
          const metadata: Message['metadata'] = {};
          if (historyItem.includes('ラウンド')) {
            const roundMatch = historyItem.match(/ラウンド (\d+)/);
            if (roundMatch) metadata.round = parseInt(roundMatch[1]);
          }
          if (historyItem.includes('スコア')) {
            const scoreMatch = historyItem.match(/スコア (\d+\.\d+)/);
            if (scoreMatch) metadata.score = parseFloat(scoreMatch[1]);
          }
          
          if (historyItem.includes('ドラフト')) metadata.type = 'draft';
          else if (historyItem.includes('フィードバック')) metadata.type = 'feedback';
          else if (historyItem.includes('統合')) metadata.type = 'integrated';
          else metadata.type = 'system';
          
          return {
            id: `history-${index}`,
            content: historyItem,
            sender,
            timestamp: new Date(Date.now() - (state.history.length - index) * 1000),
            metadata
          };
        });
        
        if (state.status === 'complete' && state.finalOutput) {
          newMessages.push({
            id: `final-output`,
            content: state.finalOutput,
            sender: 'orchestrator',
            timestamp: new Date(),
            metadata: { type: 'integrated' }
          });
        }
        
        setMessages(newMessages);
      }
    });
    
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim() || orchestrationState?.status === 'collecting_drafts' || 
        orchestrationState?.status === 'integrating' || 
        orchestrationState?.status === 'collecting_feedback' || 
        orchestrationState?.status === 'evaluating') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    orchestrationService.start(input);
  };
  
  const handleEmergencyStop = () => {
    if (orchestrationState?.status === 'idle' || orchestrationState?.status === 'complete' || 
        orchestrationState?.status === 'stopped') return;
    
    orchestrationService.stop();
    
    toast({
      title: "緊急停止",
      description: "オーケストレーションプロセスが停止されました。",
      variant: "destructive"
    });
    
    const stopMessage: Message = {
      id: Date.now().toString(),
      content: "⚠️ オーケストレーションが緊急停止されました",
      sender: 'system',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, stopMessage]);
  };
  
  const handleResetUI = () => {
    toast({
      title: "UI初期化",
      description: "チャットUIが初期化されました。",
    });
    setMessages([]);
    setInput('');
    
    orchestrationService.stop();
  };
  
  const getSenderLabel = (sender: string) => {
    switch(sender) {
      case 'user': return 'ユーザー';
      case 'system': return 'システム';
      case 'orchestrator': return 'オーケストレーター';
      case 'AI-1': return 'DeepSeek-V3 (AI-1)';
      case 'AI-2': return 'DeepSeek-V3 (AI-2)';
      default: return sender;
    }
  };
  
  const getSenderColor = (sender: string) => {
    switch(sender) {
      case 'user': return 'bg-accent text-accent-foreground ml-auto';
      case 'system': return 'bg-gray-800 text-white';
      case 'orchestrator': return 'bg-gray-700 text-white';
      case 'AI-1': return 'bg-blue-900 text-white';
      case 'AI-2': return 'bg-purple-900 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };
  
  const isProcessing = orchestrationState?.status === 'collecting_drafts' || 
                       orchestrationState?.status === 'integrating' || 
                       orchestrationState?.status === 'collecting_feedback' || 
                       orchestrationState?.status === 'evaluating';
  
  const getStatusText = () => {
    if (!orchestrationState) return '';
    
    switch(orchestrationState.status) {
      case 'collecting_drafts': return `ドラフト収集中 (ラウンド ${orchestrationState.round})...`;
      case 'integrating': return `ドラフト統合中 (ラウンド ${orchestrationState.round})...`;
      case 'collecting_feedback': return `フィードバック収集中 (ラウンド ${orchestrationState.round})...`;
      case 'evaluating': return `評価中 (ラウンド ${orchestrationState.round})...`;
      case 'complete': return '完了';
      case 'stopped': return '停止済み';
      default: return '';
    }
  };
  
  return (
    <Card className="flex flex-col h-[600px] bg-base border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{t('chatTitle')}</h2>
          <p className="text-xs text-gray-400">{t('integrated')}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleEmergencyStop}
            disabled={!isProcessing}
            className="flex items-center"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>{t('emergencyStop')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetUI}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>{t('resetUI')}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>{t('typeMessage')}</p>
            <p className="text-xs mt-2">統合-フィードバック・ループを使用したオーケストレーションを体験できます</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`p-3 rounded-2xl max-w-[80%] ${getSenderColor(message.sender)}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold">{getSenderLabel(message.sender)}</span>
                {message.metadata?.round && (
                  <span className="text-xs opacity-70">ラウンド {message.metadata.round}</span>
                )}
                {message.metadata?.score !== undefined && (
                  <span className="text-xs opacity-70">スコア: {message.metadata.score.toFixed(2)}</span>
                )}
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
            className="flex-1 p-2 rounded-xl bg-gray-800 border border-gray-700 text-white"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSend} 
            className="rounded-xl"
            disabled={isProcessing}
          >
            <Send className="w-4 h-4 mr-1" />
            <span>{t('send')}</span>
          </Button>
        </div>
        {isProcessing && (
          <div className="mt-2 text-xs text-accent flex items-center">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            <span className="animate-pulse">{getStatusText()}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
