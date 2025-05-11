import { Chat } from '@/components/ui/chat';
import { Card } from '@/components/ui/card';

const ChatTest = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-base border-gray-800">
        <p className="mb-4">
          オーケストレーションシステムの動作を確認するためのインターフェースです。
          EX-1001、EX-1002、EX-1003の会話履歴が表示され、新しいメッセージを送信できます。
          緊急停止ボタンでプロセスを中断したり、UI初期化ボタンでチャットをリセットできます。
        </p>
        
        <Chat />
      </Card>
    </div>
  );
};

export default ChatTest;
