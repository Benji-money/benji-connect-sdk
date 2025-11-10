export interface AuthContextState {
  bearerToken: string;
  authPayload: Record<string, unknown>;
}

export enum BenjiConnectAuthAction {
  Connect = 'connect',
  Transfer = 'transfer',
  Redeem = 'redeem',
}

export interface BenjiConnectAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string | number;
}