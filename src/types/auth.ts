export enum BenjiConnectAuthAction {
  Connect = 'connect',
  Transfer = 'transfer',
  Redeem = 'redeem',
}

export interface BenjiConnectAuthToken {
  access_token: string;
  refresh_token: string;
  expires_at?: string | number;
}

export interface BenjiConnectAuth {
  accessToken: string;
  configToken: string;
}