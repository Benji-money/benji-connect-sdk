export type BenjiConnectEnvironment = 'development' | 'sandbox' | 'production';

export interface BenjiConnectConfig {
  environment: BenjiConnectEnvironment;
  bearerToken: string;
  onSuccess: (token: string, metadata?: unknown) => void;
  onExit: () => void;
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

export interface AuthSuccessPayload {
  token: string;
  metadata?: unknown;
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
  metadata?: unknown;
}

export interface BenjiConnectOnSuccessData extends BenjiConnectEventData {
  token: string;
  userId?: string;
}

export interface BenjiConnectOnErrorData extends BenjiConnectEventData  {
  errorCode: string;
  errorMessage: string;
  userId?: string;
}

export interface BenjiConnectOnExitData extends BenjiConnectEventData  {
  userId?: string;
}

/*
export type BenjiConnectEventMap = {
  authSuccess: AuthSuccessPayload;
  authExit: { reason?: string };
  // catch-all: use '*' to listen to all events generically
  '*': { type: string; data?: unknown };
};
*/

// Canonical event map (single source of truth)
export type BenjiConnectEventMap = {
  authSuccess: BenjiConnectOnSuccessData;
  authExit: BenjiConnectOnExitData;
  authError: BenjiConnectOnErrorData;

  // Optional catch-all fan-out
  '*': { type: BenjiConnectKnownEvent; data: BenjiConnectEventMap[BenjiConnectKnownEvent] };
};

// Discriminated message envelope over postMessage
export interface BenjiConnectEventMessage<K extends BenjiConnectKnownEvent = BenjiConnectKnownEvent> {
  namespace?: string;           // optional namespace, e.g., 'benji-connect-sdk'
  version?: string | number;    // optional protocol/app version
  type: K;                      // discriminant
  data: BenjiConnectEventMap[K];
}

// Runtime guards
export const isEventMessage = (x: unknown): x is BenjiConnectEventMessage => {
  if (typeof x !== 'object' || x == null) return false;
  const t = (x as any).type;
  return typeof t === 'string';
};