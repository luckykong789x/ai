import { Chat } from '@/components/ui/chat';
import { Card } from '@/components/ui/card';
import { t } from '@/lib/i18n';

const ChatTest = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('chatTitle')}</h1>
      
      <Card className="p-6 bg-base border-gray-800">
        <p className="mb-4">
          {t('chatTitle')}は、オーケストレーションシステムの動作を確認するためのインターフェースです。
          メッセージを送信して、システムの応答を確認できます。
        </p>
        
        <Chat />
      </Card>
    </div>
  );
};

export default ChatTest;
