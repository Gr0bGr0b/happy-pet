import Constants from 'expo-constants';

// EXPO_PUBLIC_API_URL lets docker/LAN override without editing config — needed to run
// on a physical phone, where "localhost" is the phone itself.
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  'http://localhost:8080/api/v1';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, signal } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ApiError(response.status, text || `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Multipart upload — JSON body helpers above can't express a file part. */
export async function uploadFile<T>(
  path: string,
  form: FormData,
  signal?: AbortSignal
): Promise<T> {
  // Content-Type is deliberately unset: the runtime must add the multipart boundary.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    body: form,
    signal
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ApiError(response.status, text || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}
