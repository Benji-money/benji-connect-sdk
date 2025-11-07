export enum BenjiConnectAuthAction {
  Unknown = 'unknown',
  Connect = 'connect',
  Transfer = 'transfer',
  Redeem = 'redeem',
}

export interface BenjiConnectAuthToken {
  accessToken?: string;
  refreshToken?: string; 
}