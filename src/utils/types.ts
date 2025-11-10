/*

import { BenjiConnectAuthAction } from "../types/auth";

import { 
  BenjiConnectEventData, 
  BenjiConnectEventMessage, 
  BenjiConnectEventMetadata,
  BenjiConnectEventToken 
} from "../types/event";

import { BenjiConnectUserData } from "../types/user";

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

export const extractUserId = (data: BenjiConnectEventData): string | undefined => {
  const raw = data.metadata?.user?.id ?? (data.metadata as any)?.user_id; // fallback if backend uses snake_case
  return raw == null ? undefined : String(raw);  // normalize to string
};

export const normalizeToken = (token: BenjiConnectEventToken): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');
*/

import { BenjiConnectUserData } from "../types/user";

export function extractUserData(
  input: BenjiConnectUserData | null | undefined
): BenjiConnectUserData | undefined {
  if (!input) return undefined;

  if ("user" in (input as any) && "status" in (input as any)) {
    return input as BenjiConnectUserData;
  }
;
  return undefined;
}