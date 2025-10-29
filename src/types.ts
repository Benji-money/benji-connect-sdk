export type BenjiConnectEnvironment = 'development' | 'sandbox' | 'production';

export interface BenjiConnectConfig {
  environment: BenjiConnectEnvironment;
  bearerToken: string;
  onSuccess: (token: string, userId?: string) => void;
  onError: (errorCode: string, errorMessage: string, userId?: string) => void;
  onExit: (reason?: string) => void;
  onEvent?: (event: { type: string; data?: unknown }) => void;
}

export interface BenjiConnectOptions {
  userExternalId?: string;
  partnerId?: string;
  merchantId?: string;
  displayName?: string;
  partnershipId?: string;
  mode?: 1 | 2;
}

export interface BenjiConnectContext {
  namespace?: string;         // e.g., 'benji-connect-sdk'
  version?: string | number;  // e.g., '1.0.0'
}

export interface AuthSuccessPayload {
  token: string;
  metadata?: unknown;
}

/* ================== Transport Event Types ================== */

// Transport-layer shapes (raw, unprocessed)
type BenjiConnectEventToken = string | { access_token: string; refresh_token?: string };

interface BenjiConnectEventMetadata {
  user?: {
    id?: string | number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

// Known event names coming from the SDK transport (postMessage)
export type BenjiConnectKnownEvent =
  | 'authSuccess'
  | 'authExit'
  | 'authError';

// Optional convenience alias (excludes the '*' catch-all key)
export type BenjiConnectEventType = BenjiConnectKnownEvent;

export interface BenjiConnectEvent{
  type: BenjiConnectEventType;
  data?: BenjiConnectEventData;
}

export interface BenjiConnectEventData {
  metadata?: BenjiConnectEventMetadata;
}

export interface BenjiConnectAuthSuccessEventData extends BenjiConnectEventData {
  token: BenjiConnectEventToken;
}

export interface BenjiConnectAuthExitEventData extends BenjiConnectEventData  {
  reason?: string;
}

export interface BenjiConnectErrorEventData extends BenjiConnectEventData  {
  errorCode: string;
  errorMessage: string;
}

/* ====================== Event Mappers ====================== */

// Canonical event map 
export type BenjiConnectEventMap = {
  authSuccess: BenjiConnectAuthSuccessEventData;
  authExit: BenjiConnectAuthExitEventData;
  authError: BenjiConnectErrorEventData;

  // Optional catch-all fan-out
  '*': { type: BenjiConnectKnownEvent; data: BenjiConnectEventMap[BenjiConnectKnownEvent] };
};

// Discriminated message envelope over postMessage
export interface BenjiConnectEventMessage<K extends BenjiConnectKnownEvent = BenjiConnectKnownEvent> {
  namespace?: string;           // namespace, e.g., 'benji-connect-sdk'
  version?: string | number;    // sdk version
  type: K;                      // discriminant
  data: BenjiConnectEventMap[K];
}

/* ====================== Helpers to avoid repetition ====================== */

// Runtime guards
export const isEventMessage = (x: unknown): x is BenjiConnectEventMessage => {
  if (typeof x !== 'object' || x == null) return false;
  const t = (x as any).type;
  return typeof t === 'string';
};

const buildContext = (message: BenjiConnectEventMessage<any>) => ({
  namespace: message.namespace ?? '',
  version: String(message.version ?? ''),
});

const extractUserId = (data: BenjiConnectEventData): string | undefined => {
  const raw = data.metadata?.user?.id ?? (data.metadata as any)?.user_id; // fallback if backend uses snake_case
  return raw == null ? undefined : String(raw);  // normalize to string
};

const normalizeToken = (token: BenjiConnectEventToken): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');

/* ========== Derived Callback types (no unecessary metadata) =============== */

export interface BenjiConnectCallbackData {
  context: { namespace: string; version: string };
  userId?: string;
}

export interface BenjiConnectOnSuccessCallbackData extends BenjiConnectCallbackData {
  token: string;
}

export interface BenjiConnectOnErrorCallbackData extends BenjiConnectCallbackData  {
  errorCode: string;
  errorMessage: string;
}

export interface BenjiConnectOnExitCallbackData extends BenjiConnectCallbackData  {
  reason?: string;
}

export interface BenjiConnectOnEventCallbackData extends BenjiConnectCallbackData  {
  type: BenjiConnectEventType;
}

/* ====================== Callback Mappers ====================== */

export const mapToOnSuccessCallbackData = (
  message: BenjiConnectEventMessage<'authSuccess'>,
  data: BenjiConnectAuthSuccessEventData
): BenjiConnectOnSuccessCallbackData => {
  return {
    context: buildContext(message),
    userId: extractUserId(data),
    token: normalizeToken(data.token),
  };
};

export const mapToOnErrorCallbackData = (
  message: BenjiConnectEventMessage<'authError'>,
  data: BenjiConnectErrorEventData
): BenjiConnectOnErrorCallbackData => {
  return {
    context: buildContext(message),
    userId: extractUserId(data),
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
  };
};

export const mapToOnExitCallbackData = (
  message: BenjiConnectEventMessage<'authExit'>,
  data: BenjiConnectAuthExitEventData
): BenjiConnectOnExitCallbackData => {
  return {
    context: buildContext(message),
    userId: extractUserId(data),
    reason: data.reason,
  };
};

export const mapToOnEventCallbackData = (
  message: BenjiConnectEventMessage,
  data: BenjiConnectEventData
): BenjiConnectOnEventCallbackData => {
  return {
    context: buildContext(message),
    userId: extractUserId(data),
    type: message.type,
  };
};

export type BenjiConnectCallbackDataMap = {
  authSuccess: BenjiConnectOnSuccessCallbackData;
  authError: BenjiConnectOnErrorCallbackData;
  authExit: BenjiConnectOnExitCallbackData;
  '*': BenjiConnectOnEventCallbackData;
};

export const BenjiConnectCallbackMapperMap = {
  authSuccess: mapToOnSuccessCallbackData,
  authError: mapToOnErrorCallbackData,
  authExit: mapToOnExitCallbackData,
} as const;