import { 
  BenjiConnectMetadata, 
  BenjiConnectOnErrorData, 
  BenjiConnectOnEventData, 
  BenjiConnectOnExitData, 
  BenjiConnectOnExitMetadata, 
  BenjiConnectOnSuccessData, 
  BenjiConnectOnSuccessMetadata 
} from './config';

import { 
  extractAccessToken, 
  mapEventToConnectToken 
} from '../utils/auth';

import { buildContext } from '../utils/config';
import { mapEventToConnectUserData } from '../utils/user';

import { 
  BenjiConnectAuthSuccessEventData,
  BenjiConnectErrorEventData, 
  BenjiConnectEventDataMap, 
  BenjiConnectEventMessage, 
  BenjiConnectEventType, 
  BenjiConnectFlowExitEventData
} from './event';
import { mapEventToConnectTransactionData } from '../utils/transaction';

export type MessageRouterConfig = {
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
  close?: () => void;
};

export const mapToAuthSuccessData = (
  message: BenjiConnectEventMessage<BenjiConnectEventType.AUTH_SUCCESS>,
  data: BenjiConnectAuthSuccessEventData
): BenjiConnectOnEventData => {
  return {
    type: message.type,
    metadata: {
      context: buildContext(),
      action: data.action,
      token: mapEventToConnectToken(data.token),
      transactionData: mapEventToConnectTransactionData(data.transaction),
      userData: mapEventToConnectUserData(data.metadata)
    }
  };
};

export const mapToOnExitData = (data: BenjiConnectFlowExitEventData): BenjiConnectOnExitData => {
  return {
     metadata: {
      context: buildContext(),
      step: data.step,
      trigger: data.trigger
    }
  };
};

export const mapToOnSuccessData = (data: BenjiConnectAuthSuccessEventData): BenjiConnectOnSuccessData => {
  
  const token = extractAccessToken(data.token);

  let metadata: BenjiConnectOnSuccessMetadata = {
    context: buildContext(),
    action: data.action,
    user_data: data.metadata
  };

  if (data.transaction) {
    metadata.transaction_data = data.transaction;
  }
  
  return { token, metadata };
};

export const mapToOnErrorData = (data: BenjiConnectErrorEventData): BenjiConnectOnErrorData => {
  return {
    error: data.error,
    error_id: '500', // Placeholder
    metadata: {
      context: buildContext()
    }
  };
};

export const mapToOnEventData = <K extends BenjiConnectEventType>(
  message: BenjiConnectEventMessage<K>,
  data: BenjiConnectEventDataMap[K]
): BenjiConnectOnEventData => {
  return {
    type: message.type,
    metadata: {
      context: buildContext(),
      ...data
    }
  };
};

export type BenjiConnectCallbackDataMap = {
  [BenjiConnectEventType.AUTH_SUCCESS]: BenjiConnectOnEventData;
  [BenjiConnectEventType.FLOW_EXIT]: BenjiConnectOnExitData;
  [BenjiConnectEventType.FLOW_SUCCESS]: BenjiConnectOnSuccessData;
  [BenjiConnectEventType.ERROR]: BenjiConnectOnErrorData;
  [BenjiConnectEventType.EVENT]: BenjiConnectOnEventData;
  '*': BenjiConnectOnEventData;
};

export const BenjiConnectCallbackMapperMap = {
  [BenjiConnectEventType.AUTH_SUCCESS]: mapToAuthSuccessData,
  [BenjiConnectEventType.FLOW_EXIT]: mapToOnExitData,
  [BenjiConnectEventType.FLOW_SUCCESS]: mapToOnSuccessData,
  [BenjiConnectEventType.ERROR]: mapToOnErrorData,
  [BenjiConnectEventType.EVENT]: mapToOnEventData,
} as const;

