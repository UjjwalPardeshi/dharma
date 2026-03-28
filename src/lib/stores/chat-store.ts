import { create } from "zustand";
import type { Message, Session } from "@/types";

interface ChatState {
  currentSession: Session | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  setCurrentSession: (session: Session | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSession: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  setCurrentSession: (session) => set({ currentSession: session }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0) {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      return { messages };
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  reset: () =>
    set({
      currentSession: null,
      messages: [],
      isLoading: false,
      isStreaming: false,
    }),
}));
