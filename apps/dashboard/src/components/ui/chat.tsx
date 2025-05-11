import { useState, useEffect } from 'react';
import { Send, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';
import { t } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system' | 'orchestrator';
  conversationId: string;
  timestamp: Date;
}

const sampleConversations = [
  {
    id: 'EX-1001',
    messages: [
      {
        id: '1001-1',
        content: 'プロンプトモジュールの実行をリクエストします',
        sender: 'user',
        conversationId: 'EX-1001',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '1001-2',
        content: 'リクエストを受け付けました。処理を開始します。',
        sender: 'orchestrator',
        conversationId: 'EX-1001',
        timestamp: new Date(Date.now() - 3590000)
      },
      {
        id: '1001-3',
        content: '処理が完了しました。結果を返します。',
        sender: 'system',
        conversationId: 'EX-1001',
        timestamp: new Date(Date.now() - 3580000)
      }
    ]
  },
  {
    id: 'EX-1002',
    messages: [
      {
        id: '1002-1',
        content: 'テキスト要約モジュールを実行してください',
        sender: 'user',
        conversationId: 'EX-1002',
        timestamp: new Date(Date.now() - 2400000)
      },
      {
        id: '1002-2',
        content: 'テキスト要約モジュールを実行します。入力テキストを処理中...',
        sender: 'orchestrator',
        conversationId: 'EX-1002',
        timestamp: new Date(Date.now() - 2390000)
      },
      {
        id: '1002-3',
        content: '要約が完了しました。結果: テキストの主要なポイントが抽出されました。',
        sender: 'system',
        conversationId: 'EX-1002',
        timestamp: new Date(Date.now() - 2380000)
      }
    ]
  },
  {
    id: 'EX-1003',
    messages: [
      {
        id: '1003-1',
        content: 'データ分析モジュールを実行',
        sender: 'user',
        conversationId: 'EX-1003',
        timestamp: new Date(Date.now() - 1200000)
      },
      {
        id: '1003-2',
        content: 'データ分析モジュールを起動しています。データセットを読み込み中...',
        sender: 'orchestrator',
        conversationId: 'EX-1003',
        timestamp: new Date(Date.now() - 1190000)
      },
      {
        id: '1003-3',
        content: '分析完了。トレンドを検出しました: 上昇傾向が見られます。',
        sender: 'system',
        conversationId: 'EX-1003',
        timestamp: new Date(Date.now() - 1180000)
      }
    ]
  }
];

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allMessages = sampleConversations.flatMap(conv => conv.messages);
    allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    setMessages(allMessages as Message[]);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      conversationId: `EX-${Date.now().toString().substring(0, 4)}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    setTimeout(() => {
      const orchestratorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `オーケストレーションを開始: "${input}"`,
        sender: 'orchestrator',
        conversationId: userMessage.conversationId,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, orchestratorMessage]);
      
      setTimeout(() => {
        const systemMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `処理完了: "${input}" の実行結果を返します。`,
          sender: 'system',
          conversationId: userMessage.conversationId,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, systemMessage]);
        setIsProcessing(false);
      }, 2000);
    }, 1000);
  };

  const handleEmergencyStop = () => {
    if (!isProcessing) return;
    
    setIsProcessing(false);
    toast({
      title: "緊急停止",
      description: "オーケストレーションプロセスが停止されました。",
      variant: "destructive"
    });
    
    const stopMessage: Message = {
      id: Date.now().toString(),
      content: "⚠️ オーケストレーションが緊急停止されました",
      sender: 'system',
      conversationId: messages[messages.length - 1]?.conversationId || 'system',
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
    setIsProcessing(false);
  };

  const getSenderLabel = (sender: string) => {
    switch(sender) {
      case 'user': return 'ユーザー';
      case 'system': return 'システム';
      case 'orchestrator': return 'オーケストレーター';
      default: return sender;
    }
  };

  const getSenderColor = (sender: string) => {
    switch(sender) {
      case 'user': return 'bg-accent text-accent-foreground ml-auto';
      case 'system': return 'bg-gray-800 text-white';
      case 'orchestrator': return 'bg-gray-700 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-base border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('chatTitle')}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleEmergencyStop}
            disabled={!isProcessing}
            className="flex items-center"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>緊急停止</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetUI}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>UI初期化</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>{t('typeMessage')}</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`p-3 rounded-2xl max-w-[80%] ${getSenderColor(message.sender)}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold">{getSenderLabel(message.sender)}</span>
                <span className="text-xs opacity-70">{message.conversationId}</span>
              </div>
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
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
            <Send className="w-4 h-4" />
            <span>{t('send')}</span>
          </Button>
        </div>
        {isProcessing && (
          <div className="mt-2 text-xs text-accent animate-pulse">
            オーケストレーション処理中...
          </div>
        )}
      </div>
    </Card>
  );
};
