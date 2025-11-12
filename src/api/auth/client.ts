import { getAuth } from '../../lib/auth';

export interface JsonPostOptions {
  baseUrl: string;
  path: string;
  body?: unknown;
}

/**
 * Generic JSON POST helper that:
 * - pulls bearerToken from the global auth context
 * - stringifies JSON body
 * - returns parsed JSON
 */
export async function jsonPost<TResponse = unknown>(
  options: JsonPostOptions
): Promise<TResponse> {
  const { bearerToken } = getAuth();
  const { baseUrl, path, body } = options;

  const response = await fetch(baseUrl + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: body == null ? undefined : JSON.stringify(body),
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    // Centralized error logging/normalization
    console.error('[BenjiConnect SDK] jsonPost error:', {
      status: response.status,
      json,
    });
    throw new Error(
      (json as any)?.error ||
        `[BenjiConnect SDK] HTTP ${response.status} in jsonPost`
    );
  }

  return json as TResponse;
}
