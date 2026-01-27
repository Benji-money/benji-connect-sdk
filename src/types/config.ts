import { BenjiConnectAuthAction } from './auth';
import { BenjiConnectEventType } from './event';
import { BenjiConnectTransactionData } from './transaction';
import { BenjiConnectUserData } from './user';

export enum BenjiConnectEnvironment {
  DEVELOPMENT = 'development',
  SANDBOX = 'sandbox',
  PRODUCTION = 'production',
}

export enum BenjiConnectMode {
  CONNECT = 1,
  TRANSFER = 3,
  REDEEM = 4
}

export interface BenjiConnectConfig {
  environment: BenjiConnectEnvironment | string;
  token: string;
  onSuccess?: (
    token: string, 
    metadata: BenjiConnectOnSuccessMetadata
  ) => void;
  onError?: (
    error: Error,
    error_id: string,
    metadata: BenjiConnectMetadata
  ) => void;
  onExit?: (
    metadata: BenjiConnectOnExitMetadata
  ) => void;
  onEvent?: (
    type: BenjiConnectEventType, 
    metadata: BenjiConnectMetadata
  ) => void;
}

export interface BenjiConnectContext {
  namespace?: string;         // e.g., 'benji-connect-sdk'
  version?: string | number;  // e.g., '1.0.0'
}

/*
 * SDK config callback structures below
 */

export interface BenjiConnectOnSuccessData {
  token: string;
  metadata: BenjiConnectOnSuccessMetadata;
}

export interface BenjiConnectOnErrorData  {
  error: Error;
  error_id: string;
  metadata: BenjiConnectMetadata;
}

export interface BenjiConnectOnExitData  {
  metadata: BenjiConnectOnExitMetadata;
}

export interface BenjiConnectOnEventData {
  type: BenjiConnectEventType;
  metadata: BenjiConnectMetadata;
}

export interface BenjiConnectMetadata {
  context: { 
    namespace: string; 
    version: string 
  };
  [k: string]: unknown;
}

export interface BenjiConnectOnSuccessMetadata extends BenjiConnectMetadata {
  action?: BenjiConnectAuthAction;
  transaction_data?: BenjiConnectTransactionData | null;
  user_data?: BenjiConnectUserData;
}

export interface BenjiConnectOnExitMetadata extends BenjiConnectMetadata {
  trigger?: string;
  step?: string;
}