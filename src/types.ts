import { buildContext } from './context';

export type BenjiConnectEnvironment = 'development' | 'sandbox' | 'production';

export interface BenjiConnectConfig {
  environment: BenjiConnectEnvironment;
  bearerToken: string;
  onSuccess?: (data: BenjiConnectOnSuccessData) => void;
  onError?: (data: BenjiConnectOnErrorData) => void;
  onExit?: (data: BenjiConnectOnExitData) => void;
  onEvent?: (data: BenjiConnectOnEventData) => void;
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

export interface BenjiConnectAuthToken {
  accessToken?: string;
  refreshToken?: string; 
}

export interface BenjiConnectError {
  errorCode?: string;
  errorMessage?: string; 
}

export type BenjiConnectExitReason = 
  | 'closeButton' 
  | 'unknown' ;

export interface BenjiConnectUserData {
  id?: string;
  name?: string; 
  statusId?: string;
  rewardStatus?: string;
}





/* ================== Transport Event Types ================== */

// Transport-layer shapes (raw, unprocessed)
type BenjiConnectEventToken = string | { access_token: string; refresh_token?: string };

export interface BenjiConnectEventMetadata {
  user?: {
    id?: string | number;
    first_name?: string
    [k: string]: unknown;
  };
  status?: {
    status_id?: string;
    reward_status?: string;
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
  userData: BenjiConnectUserData;
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

const extractUserData = (data: BenjiConnectEventData): BenjiConnectUserData => {
  const raw = data.metadata;
  if (raw == null) {
    return {id: '', name: '', statusId: '', rewardStatus: ''};
  }
  const metadata = raw as BenjiConnectEventMetadata;
  const userData = {
    id: extractUserId(data),
    name: metadata.user?.first_name,
    statusId: metadata.status?.status_id,
    rewardStatus: metadata.status?.reward_status
  }
  return userData;
};

const extractUserId = (data: BenjiConnectEventData): string | undefined => {
  const raw = data.metadata?.user?.id ?? (data.metadata as any)?.user_id; // fallback if backend uses snake_case
  return raw == null ? undefined : String(raw);  // normalize to string
};

const normalizeToken = (token: BenjiConnectEventToken): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');

/* ========== Derived Callback types (no unecessary metadata) =============== */

export interface BenjiConnectData {
  context: { namespace: string; version: string };
}

export interface BenjiConnectOnSuccessData extends BenjiConnectData {
  token: string;
  userData: BenjiConnectUserData;
}

export interface BenjiConnectOnErrorData extends BenjiConnectData  {
  errorCode: string;
  errorMessage: string;
}

export interface BenjiConnectOnExitData extends BenjiConnectData  {
  reason?: string;
}

export interface BenjiConnectOnEventData extends BenjiConnectData  {
  type: BenjiConnectEventType;
  metadata?: BenjiConnectEventMetadata;
}

/* ====================== Callback Mappers ====================== */

export const mapToOnSuccessData = (
  message: BenjiConnectEventMessage<'authSuccess'>,
  data: BenjiConnectAuthSuccessEventData
): BenjiConnectOnSuccessData => {
  return {
    context: buildContext(),
    userData: extractUserData(data),
    token: normalizeToken(data.token),
  };
};

export const mapToOnErrorData = (
  message: BenjiConnectEventMessage<'authError'>,
  data: BenjiConnectErrorEventData
): BenjiConnectOnErrorData => {
  return {
    context: buildContext(),
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
  };
};

export const mapToOnExitData = (
  message: BenjiConnectEventMessage<'authExit'>,
  data: BenjiConnectAuthExitEventData
): BenjiConnectOnExitData => {
  return {
    context: buildContext(),
    reason: data.reason,
  };
};

export const mapToOnEventData = (
  message: BenjiConnectEventMessage,
  data: BenjiConnectEventData
): BenjiConnectOnEventData => {
  return {
    context: buildContext(),
    type: message.type,
    metadata: data.metadata
  };
};

export type BenjiConnectCallbackDataMap = {
  authSuccess: BenjiConnectOnSuccessData;
  authError: BenjiConnectOnErrorData;
  authExit: BenjiConnectOnExitData;
  '*': BenjiConnectOnEventData;
};

export const BenjiConnectCallbackMapperMap = {
  authSuccess: mapToOnSuccessData,
  authError: mapToOnErrorData,
  authExit: mapToOnExitData,
} as const;