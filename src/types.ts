export type Env = 'development' | 'sandbox' | 'production';

export interface ConnectSDKConfig {
  env: Env;
  bearerToken: string;
  onSuccess: (token: string, metadata?: unknown) => void;
  onExit: () => void;
  onEvent?: (evt: { type: string; data?: unknown }) => void;
}

export interface OpenParams {
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

export type BenjiEventMap = {
  authSuccess: AuthSuccessPayload;
  authExit: { reason?: string };
  // catch-all: use '*' when you want to listen to all events generically
  '*': { type: string; data?: unknown };
};
