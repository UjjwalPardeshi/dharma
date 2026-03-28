"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WelcomeState } from "./welcome-state";
import { MessageList } from "./message-list";
import { InputBox } from "./input-box";
import { QuotaIndicator } from "./quota-indicator";

interface ChatContainerProps {
  userName?: string | null;
  consultationsUsed?: number;
  consultationsLimit?: number;
}

export function ChatContainer({
  userName,
  consultationsUsed = 0,
  consultationsLimit = 5,
}: ChatContainerProps) {
  const { messages, isLoading, isStreaming, addMessage } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<{ scrollTo: (offset: number) => void } | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo(Number.MAX_SAFE_INTEGER);
      }, 0);
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content,
        responseJson: null,
        citations: null,
        createdAt: new Date().toISOString(),
      };

      addMessage(newMessage);

      // Simulate assistant response (will be replaced with actual API call)
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "Thank you for sharing this with me. Let me consult the ancient texts...",
          responseJson: null,
          citations: null,
          createdAt: new Date().toISOString(),
        };
        addMessage(assistantMessage);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea
        className="flex-1 overflow-hidden"
        ref={scrollRef as any}
      >
        <div className="p-6 max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            <WelcomeState userName={userName} onSelectTopic={handleSendMessage} />
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto w-full p-4">
          <InputBox
            onSend={handleSendMessage}
            disabled={isStreaming}
            placeholder="What's on your mind today?"
          />
          <QuotaIndicator used={consultationsUsed} limit={consultationsLimit} />
        </div>
      </div>
    </div>
  );
}
