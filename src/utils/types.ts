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

export const extractUserId = (data: BenjiConnectEventData): string | undefined => {
  const raw = data.metadata?.user?.id ?? (data.metadata as any)?.user_id; // fallback if backend uses snake_case
  return raw == null ? undefined : String(raw);  // normalize to string
};

export const normalizeToken = (token: BenjiConnectEventToken): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');