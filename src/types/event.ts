import { BenjiConnectAuthAction } from "./auth";
import { BenjiConnectUserData } from "./user";

export interface BenjiConnectError {
  errorCode?: string;
  errorMessage?: string; 
}

// Transport-layer token (raw, unprocessed from postMessage)
export type BenjiConnectEventToken = string | { access_token: string; refresh_token?: string };

// Transport-layer metadata (raw, unprocessed from postMessage)
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

// Convenience alias (excludes the '*' catch-all key)
export type BenjiConnectEventType = BenjiConnectKnownEvent;

export interface BenjiConnectEvent {
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