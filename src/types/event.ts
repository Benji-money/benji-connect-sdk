import { BenjiConnectAuthAction } from "./auth";

// Known event names coming from the SDK transport (postMessage)
export enum BenjiConnectEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  FLOW_EXIT = 'FLOW_EXIT',
  FLOW_SUCCESS = 'FLOW_SUCCESS',
  EVENT = 'EVENT',
  ERROR = 'ERROR',
}

// Known exit trigger types coming from the SDK transport (postMessage)
export enum BenjiConnectExitTrigger {
  ACTION_BUTTON_CLICKED = 'ACTION_BUTTON_CLICKED',
  BACK_TO_MERCHANT_CLICKED = 'BACK_TO_MERCHANT_CLICKED', // deprecated
  CLOSE_BUTTON_CLICKED = 'CLOSE_BUTTON_CLICKED',
  TAPPED_OUT_OF_BOUNDS = 'TAPPED_OUT_OF_BOUNDS'
}

export enum BenjiConnectErrorName {
  UNEXPECTED_ERROR = 'unexpected_error',
  PARTNER_CONNECT_ERROR = 'partner_connect_error'
}

export type BenjiConnectErrorID = '400' | '500'; // Placeholders for now

// Transport-layer token (raw, unprocessed from postMessage)
export interface BenjiConnectEventToken {
  access_token: string;
  refresh_token: string;
  expires_at?: string | number;
}

export interface BenjiConnectEventUserData {
  user: {
    id: number
    first_name: string
    last_name: string
  }
  status: BenjiConnectEventUserStatusData
  extra_data?: {
    total_rewards_earned?: number
    total_rewards_redeemed?: number
    created_date?: string
  }
}

export interface BenjiConnectEventUserStatusData {
  status_id: string
  num_of_rewards: number
  reward_status: string
  partner_status_tier_id?: number
}

// Basic structure for Benji Connect SDK typed events
export interface BenjiConnectEvent {
  type: BenjiConnectEventType;
  data?: BenjiConnectEventData;
}

export interface BenjiConnectEventData {
  [k: string]: unknown;
}

export interface BenjiConnectEventMessage<K extends BenjiConnectEventType = BenjiConnectEventType> {
  type: K; // discriminant
  data: BenjiConnectEventDataMap[K];
}

export interface BenjiConnectAuthSuccessEventData {
  action: BenjiConnectAuthAction;
  token?: BenjiConnectEventToken,
  metadata?: BenjiConnectEventUserData;
}

export interface BenjiConnectFlowExitEventData {
  step: string;
  trigger: BenjiConnectExitTrigger;
}

export interface BenjiConnectErrorEventData {
  error: Error;
}

// Canonical event map 
export type BenjiConnectEventDataMap = {
  [BenjiConnectEventType.AUTH_SUCCESS]: BenjiConnectAuthSuccessEventData;
  [BenjiConnectEventType.FLOW_EXIT]: BenjiConnectFlowExitEventData;
  [BenjiConnectEventType.FLOW_SUCCESS]: BenjiConnectAuthSuccessEventData;
  [BenjiConnectEventType.EVENT]: BenjiConnectEventData;
  [BenjiConnectEventType.ERROR]: BenjiConnectErrorEventData;

  // Optional catch-all fan-out
  '*': { type: BenjiConnectEventType; data: BenjiConnectEventDataMap[BenjiConnectEventType] };
};