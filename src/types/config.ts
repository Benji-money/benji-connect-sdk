import { 
  BenjiConnectOnErrorData, 
  BenjiConnectOnEventData, 
  BenjiConnectOnExitData, 
  BenjiConnectOnSuccessData 
} from './router';

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