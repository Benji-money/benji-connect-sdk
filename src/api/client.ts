export interface JsonGetOptions {
  baseUrl: string;
  path: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export interface JsonPostOptions {
  baseUrl: string;
  path: string;
  body?: unknown;
}

/**
 * Generic JSON GET helper that:
 * - pulls bearerToken from the global auth context
 * - serializes query params if provided
 * - returns parsed JSON
 */
export async function jsonGet<TResponse = unknown>(
  options: JsonGetOptions
): Promise<TResponse> {
  //const { bearerToken } = getAuth();
  const { baseUrl, path, params } = options;

  // Serialize query params if any
  const queryString =
    params && Object.keys(params).length > 0
      ? '?' +
        new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value != null) acc[key] = String(value);
            return acc;
          }, {})
        ).toString()
      : '';

  const response = await fetch(baseUrl + path + queryString, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${bearerToken}`,
    },
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    // Centralized error logging/normalization
    console.error('[BenjiConnect SDK] jsonGet error:', {
      status: response.status,
      json,
    });
    throw new Error(
      (json as any)?.error ||
        `[BenjiConnect SDK] HTTP ${response.status} in jsonGet`
    );
  }

  return json as TResponse;
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
  // const { bearerToken } = getAuth();
  const { baseUrl, path, body } = options;

  const response = await fetch(baseUrl + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${bearerToken}`,
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
