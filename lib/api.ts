const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

async function request<T = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    credentials: auth ? "include" : "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request gagal: ${res.status} ${res.statusText}`;

    throw new Error(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, auth = true) =>
    request<T>(endpoint, {
      method: "GET",
      auth,
    }),

  post: <T = any>(endpoint: string, body?: any, auth = true) =>
    request<T>(endpoint, {
      method: "POST",
      auth,
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, auth = true) =>
    request<T>(endpoint, {
      method: "PATCH",
      auth,
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, auth = true) =>
    request<T>(endpoint, {
      method: "PUT",
      auth,
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, auth = true) =>
    request<T>(endpoint, {
      method: "DELETE",
      auth,
    }),
};
