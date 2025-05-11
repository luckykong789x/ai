import { useState } from 'react';
import { Send } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';
import { t } from '@/lib/i18n';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    setTimeout(() => {
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Orchestration processed: "${input}"`,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[500px] bg-base border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">{t('chatTitle')}</h2>
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
              className={`p-3 rounded-2xl max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-accent text-accent-foreground ml-auto' 
                  : 'bg-gray-800 text-white'
              }`}
            >
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
          />
          <Button onClick={handleSend} className="rounded-xl">
            <Send className="w-4 h-4" />
            <span>{t('send')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
