import { buildContext } from '../context';

export enum BenjiConnectEnvironment {
  DEVELOPMENT = 'development',
  TRANSFER = 'sandbox',
  REDEEM = 'production'
}

export enum BenjiConnectMode {
  CONNECT = 1,
  TRANSFER = 3,
  REDEEM = 4
}

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
  userId?: string;
  partnerId?: string;
  merchantId?: string;
  merchantName?: string;
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

export interface BenjiConnectUserData {
  id?: string;
  name?: string; 
  statusId?: string;
  rewardStatus?: string;
}

export enum BenjiConnectAuthAction {
  Unknown = 'unknown',
  Connect = 'connect',
  Transfer = 'transfer',
  Redeem = 'redeem',
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
  | 'AUTH_SUCCESS'
  | 'FLOW_EXIT'
  | 'FLOW_SUCCESS'
  | 'EVENT'
  | 'ERROR';

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
  action: BenjiConnectAuthAction;
  token: BenjiConnectEventToken;
  userData: BenjiConnectUserData;
}

export interface BenjiConnectAuthExitEventData extends BenjiConnectEventData  {
  step?: string;
  trigger?: string;
}

export interface BenjiConnectFlowSuccessEventData extends BenjiConnectEventData {
  action: BenjiConnectAuthAction;
  token: BenjiConnectEventToken;
  userData: BenjiConnectUserData;
}

export interface BenjiConnectErrorEventData extends BenjiConnectEventData  {
  errorCode: string;
  errorMessage: string;
}

/* ====================== Event Mappers ====================== */

// Canonical event map 
export type BenjiConnectEventMap = {
  AUTH_SUCCESS: BenjiConnectAuthSuccessEventData;
  FLOW_EXIT: BenjiConnectAuthExitEventData;
  FLOW_SUCCESS: BenjiConnectFlowSuccessEventData;
  EVENT: BenjiConnectEventData;
  ERROR: BenjiConnectErrorEventData;

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

const extractAuthAction = (data: BenjiConnectEventData): BenjiConnectAuthAction => {
  const rawData = data.metadata; // raw metadata
  if (rawData == null) {
    return BenjiConnectAuthAction.Unknown;
  }
  const action = (rawData as any).action;
  if (typeof action === 'string' && action in BenjiConnectAuthAction) {
    // Type assertion since enum values are strings
    return action as BenjiConnectAuthAction;
  }
  return BenjiConnectAuthAction.Unknown;
};

export const extractUserData = (data: BenjiConnectEventData): BenjiConnectUserData => {
  const rawData = data.metadata;
  if (rawData == null) {
    return {id: '', name: '', statusId: '', rewardStatus: ''};
  }
  const metadata = rawData as BenjiConnectEventMetadata;
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
  step?: string;
  trigger?: string;
}

export interface BenjiConnectOnEventData extends BenjiConnectData  {
  type: BenjiConnectEventType;
  metadata?: BenjiConnectEventMetadata;
}

/* ====================== Callback Mappers ====================== */

export const mapToAuthSuccessData = (
  message: BenjiConnectEventMessage<'AUTH_SUCCESS'>,
  data: BenjiConnectAuthSuccessEventData
): BenjiConnectOnEventData => {
  return {
    type: 'AUTH_SUCCESS',
    context: buildContext(),
    metadata: {
      userData: extractUserData(data),
      token: normalizeToken(data.token)
    }
  };
};

export const mapToOnExitData = (
  message: BenjiConnectEventMessage<'FLOW_EXIT'>,
  data: BenjiConnectAuthExitEventData
): BenjiConnectOnExitData => {
  return {
    context: buildContext(),
    step: data.step,
    trigger: data.trigger,
  };
};

export const mapToOnSuccessData = (
  message: BenjiConnectEventMessage<'FLOW_SUCCESS'>,
  data: BenjiConnectFlowSuccessEventData
): BenjiConnectOnSuccessData => {
  return {
    context: buildContext(),
    userData: extractUserData(data),
    token: normalizeToken(data.token),
  };
};

export const mapToOnErrorData = (
  message: BenjiConnectEventMessage<'ERROR'>,
  data: BenjiConnectErrorEventData
): BenjiConnectOnErrorData => {
  return {
    context: buildContext(),
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
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
  AUTH_SUCCESS: BenjiConnectOnEventData;
  FLOW_EXIT: BenjiConnectOnExitData;
  FLOW_SUCCESS: BenjiConnectOnSuccessData;
  ERROR: BenjiConnectOnErrorData;
  EVENT: BenjiConnectOnEventData;
  '*': BenjiConnectOnEventData;
};

export const BenjiConnectCallbackMapperMap = {
  AUTH_SUCCESS: mapToAuthSuccessData,
  FLOW_EXIT: mapToOnExitData,
  FLOW_SUCCESS: mapToOnSuccessData,
  ERROR: mapToOnErrorData,
  EVENT: mapToOnEventData,
} as const;