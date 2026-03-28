import type { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      (body as { error?: string }).error || response.statusText,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<ApiResponse<T>>(path),
  post: <T>(path: string, data: unknown) =>
    request<ApiResponse<T>>(path, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(path: string, data: unknown) =>
    request<ApiResponse<T>>(path, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(path: string) =>
    request<ApiResponse<T>>(path, { method: "DELETE" }),
};

export { ApiError };
