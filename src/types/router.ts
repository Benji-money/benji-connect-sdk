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
  BenjiConnectAuthSuccessData,
  BenjiConnectErrorEventData, 
  BenjiConnectEventDataMap, 
  BenjiConnectEventMessage, 
  BenjiConnectEventType, 
  BenjiConnectFlowExitEventData
} from './event';

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
  data: BenjiConnectAuthSuccessData
): BenjiConnectOnEventData => {
  return {
    type: message.type,
    metadata: {
      context: buildContext(),
      action: data.action,
      token: mapEventToConnectToken(data.token),
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

export const mapToOnSuccessData = (data: BenjiConnectAuthSuccessData): BenjiConnectOnSuccessData => {
  return {
    token: extractAccessToken(data.token),
    metadata: {
      context: buildContext(),
      action: data.action,
      user_data: data.metadata
    }
  };
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

