"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Session, ApiResponse, Message } from "@/types";
import { toast } from "sonner";

interface SessionWithMessages extends Session {
  messages: Message[];
}

export function useSessions(): UseQueryResult<Session[], Error> {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await api.get<Session[]>("/api/sessions");
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch sessions");
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSession(
  sessionId: string
): UseQueryResult<SessionWithMessages, Error> {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const response = await api.get<SessionWithMessages>(
        `/api/sessions/${sessionId}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch session");
      }
      return response.data!;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<Session>("/api/sessions", {});
      if (!response.success) {
        throw new Error(response.error || "Failed to create session");
      }
      return response.data!;
    },
    onSuccess: (newSession) => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      // Add new session to cache
      queryClient.setQueryData(
        ["session", newSession.id],
        {
          ...newSession,
          messages: [],
        } as SessionWithMessages
      );

      toast.success("New session created");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create session";
      toast.error(message);
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.delete<void>(`/api/sessions/${sessionId}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete session");
      }
    },
    onSuccess: (_, sessionId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["session", sessionId] });

      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      toast.success("Session deleted");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete session";
      toast.error(message);
    },
  });
}

export function useUpdateSessionTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      title,
    }: {
      sessionId: string;
      title: string;
    }) => {
      const response = await api.put<Session>(`/api/sessions/${sessionId}`, {
        title,
      });
      if (!response.success) {
        throw new Error(response.error || "Failed to update session");
      }
      return response.data!;
    },
    onSuccess: (updatedSession) => {
      // Update cache
      queryClient.setQueryData(["session", updatedSession.id], updatedSession);

      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      toast.success("Session updated");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update session";
      toast.error(message);
    },
  });
}

export function useRefreshSessions() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  };
}

export function useRefreshSession(sessionId: string) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
  };
}
