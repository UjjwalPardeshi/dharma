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
  const { messages, isLoading, isStreaming, addMessage, setIsLoading, setIsStreaming } =
    useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const viewport = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 50);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      responseJson: null,
      citations: null,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);

    setIsLoading(true);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: content }),
      });

      const result = await res.json();

      if (!res.ok) {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.error || "Something went wrong. Please try again.",
          responseJson: null,
          citations: null,
          createdAt: new Date().toISOString(),
        });
        return;
      }

      const framework = result.data?.response;
      const formatted = framework ? formatParsedResponse(framework) : "I was unable to generate a response.";

      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatted,
        responseJson: framework || null,
        citations: null,
        createdAt: new Date().toISOString(),
      });
    } catch {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm unable to respond right now. Please check your connection and try again.",
        responseJson: null,
        citations: null,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-hidden" ref={scrollAreaRef}>
        <div className="p-6 max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            <WelcomeState userName={userName} onSelectTopic={handleSendMessage} />
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>
      </ScrollArea>

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

function formatParsedResponse(parsed: {
  empatheticAcknowledgment?: string;
  mythologicalParallel?: { story?: string; lesson?: string };
  practicalGuidance?: string[];
  lifeLesson?: string;
}): string {
  const sections: string[] = [];

  if (parsed.empatheticAcknowledgment) {
    sections.push(parsed.empatheticAcknowledgment);
  }

  if (parsed.mythologicalParallel?.story) {
    sections.push(
      `**From the Ancient Texts:**\n${parsed.mythologicalParallel.story}`
    );
    if (parsed.mythologicalParallel.lesson) {
      sections.push(`*${parsed.mythologicalParallel.lesson}*`);
    }
  }

  if (parsed.practicalGuidance?.length) {
    const steps = parsed.practicalGuidance
      .map((step, i) => `${i + 1}. ${step}`)
      .join("\n");
    sections.push(`**Practical Steps:**\n${steps}`);
  }

  if (parsed.lifeLesson) {
    sections.push(`**Life Lesson:** ${parsed.lifeLesson}`);
  }

  return sections.join("\n\n");
}

