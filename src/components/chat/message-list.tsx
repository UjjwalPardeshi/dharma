"use client";

import type { Message } from "@/types";
import { UserMessage } from "./user-message";
import { SageMessage } from "./sage-message";
import { LoadingState } from "./loading-state";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-6 py-6">
      {messages.map((message, index) => (
        <div key={message.id || index}>
          {message.role === "user" ? (
            <UserMessage content={message.content} />
          ) : (
            <SageMessage
              content={message.content}
              responseJson={message.responseJson}
              citations={message.citations}
            />
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <LoadingState />
        </div>
      )}
    </div>
  );
}
