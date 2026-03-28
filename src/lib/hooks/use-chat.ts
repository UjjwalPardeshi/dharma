"use client";

import { useCallback, useState } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { api } from "@/lib/api-client";
import type { ConsultationRequest } from "@/types";
import { toast } from "sonner";

interface SendMessageOptions {
  preferences?: {
    tone?: "casual" | "devotional" | "philosophical" | "practical";
    tradition?: "hindu" | "buddhist" | "greek" | "universal";
  };
}

export function useChat() {
  const {
    currentSession,
    messages,
    isLoading,
    isStreaming,
    addMessage,
    updateLastMessage,
    setIsLoading,
    setIsStreaming,
  } = useChatStore();

  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (query: string, options?: SendMessageOptions) => {
      if (!query.trim()) {
        toast.error("Please enter a message");
        return;
      }

      if (isLoading || isStreaming) {
        toast.error("Please wait for the current response to complete");
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Add user message to store
        addMessage({
          id: `msg_${Date.now()}`,
          role: "user",
          content: query,
          responseJson: null,
          citations: null,
          createdAt: new Date().toISOString(),
        });

        // Add placeholder assistant message
        const assistantMessageId = `msg_${Date.now() + 1}`;
        addMessage({
          id: assistantMessageId,
          role: "assistant",
          content: "",
          responseJson: null,
          citations: null,
          createdAt: new Date().toISOString(),
        });

        setIsStreaming(true);

        // Build request
        const request: ConsultationRequest = {
          query,
          sessionId: currentSession?.id,
          preferences: options?.preferences,
        };

        // Make API call with streaming
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `API error: ${response.statusText}`
          );
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "stream") {
                  accumulatedContent += data.content;
                  updateLastMessage(accumulatedContent);
                } else if (data.type === "crisis") {
                  // Handle crisis response
                  updateLastMessage(data.content);
                  toast.error(
                    "Crisis detected - please see resources below",
                    {
                      duration: 10000,
                    }
                  );
                } else if (data.type === "done") {
                  // Consultation saved
                  console.log("Consultation saved:", data.consultationId);
                }
              } catch (e) {
                // Silently ignore JSON parse errors for non-JSON lines
              }
            }
          }
        }

        setIsStreaming(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsStreaming(false);

        // Remove last message on error
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role === "assistant" && !lastMessage.content) {
            // Keep it but mark as error
            updateLastMessage("[Error loading response - please try again]");
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      isStreaming,
      addMessage,
      updateLastMessage,
      setIsLoading,
      setIsStreaming,
      currentSession?.id,
      messages,
    ]
  );

  return {
    sendMessage,
    isLoading,
    isStreaming,
    error,
    messages,
    currentSession,
  };
}
