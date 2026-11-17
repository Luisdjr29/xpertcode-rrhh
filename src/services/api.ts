const DEFAULT_API_URL = "http://localhost:8080";

const resolveApiUrl = (): string => {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  return (configured && configured.trim().length > 0 ? configured : DEFAULT_API_URL).replace(/\/$/, "");
};

const API_BASE_URL = resolveApiUrl();

export interface ApiErrorDetails {
  status: number;
  message: string;
  body?: unknown;
}

export class ApiError extends Error {
  public status: number;
  public body?: unknown;

  constructor({ status, message, body }: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const getErrorMessage = (status: number, body: unknown): string => {
  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }

  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim().length > 0) {
      return record.message;
    }
    if (typeof record.error === "string" && record.error.trim().length > 0) {
      return record.error;
    }
  }

  return `Request failed with status ${status}`;
};

export async function apiRequest<TResponse>(
  path: string,
  init: RequestInit = {},
): Promise<TResponse | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      message: getErrorMessage(response.status, body),
      body,
    });
  }

  if (body === null) {
    return null;
  }

  return body as TResponse;
}

export async function apiGet<TResponse>(path: string): Promise<TResponse | null> {
  return apiRequest<TResponse>(path, { method: "GET" });
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse | null> {
  return apiRequest<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiPut<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse | null> {
  return apiRequest<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiPatch<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse | null> {
  return apiRequest<TResponse>(path, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiDelete(path: string): Promise<void> {
  await apiRequest<null>(path, { method: "DELETE" });
}
