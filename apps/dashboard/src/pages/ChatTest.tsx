import { OrchestrationChat } from '@/components/ui/orchestration-chat';
import { Card } from '@/components/ui/card';

const ChatTest = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-base border-gray-800">
        <p className="mb-4">
          オーケストレーションシステムの動作を確認するためのインターフェースです。
          統合-フィードバック・ループパターンを使用して、複数のAIエージェントの出力を統合します。
          緊急停止ボタンでプロセスを中断したり、UI初期化ボタンでチャットをリセットできます。
        </p>
        
        <OrchestrationChat />
      </Card>
    </div>
  );
};

export default ChatTest;
