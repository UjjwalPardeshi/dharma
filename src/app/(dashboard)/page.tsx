import { auth } from "@/lib/auth";
import { ChatContainer } from "@/components/chat/chat-container";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <ChatContainer
      userName={session?.user?.name}
      consultationsUsed={0}
      consultationsLimit={5}
    />
  );
}
