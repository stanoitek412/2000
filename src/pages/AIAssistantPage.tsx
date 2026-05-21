import { Header } from '../components/layout/Header';
import { AIChat } from '../components/ai/AIChat';

export function AIAssistantPage() {
  return (
    <div>
      <Header title="AI 助手" />
      <AIChat />
    </div>
  );
}
