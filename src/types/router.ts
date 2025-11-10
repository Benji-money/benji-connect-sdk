import { buildContext } from '../utils/config';

import { 
  BenjiConnectAuthAction, 
  BenjiConnectAuthToken 
} from './auth';

import { 
  mapEventToConnectToken
} from '../utils/auth';

import { 
  extractUserData 
} from '../utils/types';

import { 
  BenjiConnectAuthSuccessData,
  BenjiConnectErrorEventData, 
  BenjiConnectEventDataMap, 
  BenjiConnectEventMessage, 
  BenjiConnectEventType, 
  BenjiConnectFlowExitEventData
} from './event';

import { BenjiConnectUserData } from './user';

export type MessageRouterConfig = {
  onSuccess?: (data: BenjiConnectOnSuccessData) => void;
  onError?: (data: BenjiConnectOnErrorData) => void;
  onExit?: (data: BenjiConnectOnExitData) => void;
  onEvent?: (data: BenjiConnectOnEventData) => void;
  close: () => void;
};

export interface BenjiConnectCallbackData {
  context: { 
    namespace: string; 
    version: string 
  };
  [k: string]: unknown;
}

export interface BenjiConnectOnSuccessData extends BenjiConnectCallbackData {
  action?: BenjiConnectAuthAction;
  token?: BenjiConnectAuthToken,
  userData?: BenjiConnectUserData;
}

export interface BenjiConnectOnErrorData extends BenjiConnectCallbackData  {
  error: Error;
}

export interface BenjiConnectOnExitData extends BenjiConnectCallbackData  {
  step?: string;
  trigger?: string;
}

export interface BenjiConnectOnEventData extends BenjiConnectCallbackData  {
  type: BenjiConnectEventType;
  metadata?: BenjiConnectEventDataMap[BenjiConnectEventType];
}

export const mapToAuthSuccessData = (
  message: BenjiConnectEventMessage<BenjiConnectEventType.AUTH_SUCCESS>,
  data: BenjiConnectAuthSuccessData
): BenjiConnectOnEventData => {
  return {
    type: message.type,
    context: buildContext(),
    action: data.action,
    token: mapEventToConnectToken(data.token),
    userData: extractUserData(data.metadata)
  };
};

export const mapToOnExitData = (
  message: BenjiConnectEventMessage<BenjiConnectEventType.FLOW_EXIT>,
  data: BenjiConnectFlowExitEventData
): BenjiConnectOnExitData => {
  return {
    context: buildContext(),
    step: data.step,
    trigger: data.trigger,
  };
};

export const mapToOnSuccessData = (
  message: BenjiConnectEventMessage<BenjiConnectEventType.FLOW_SUCCESS>,
  data: BenjiConnectAuthSuccessData
): BenjiConnectOnSuccessData => {
  return {
    context: buildContext(),
    action: data.action,
    userData: extractUserData(data.metadata),
    token: mapEventToConnectToken(data.token),
  };
};

export const mapToOnErrorData = (
  message: BenjiConnectEventMessage<BenjiConnectEventType.ERROR>,
  data: BenjiConnectErrorEventData
): BenjiConnectOnErrorData => {
  return {
    context: buildContext(),
    error: data.error
  };
};

export const mapToOnEventData = <K extends BenjiConnectEventType>(
  message: BenjiConnectEventMessage<K>,
  data: BenjiConnectEventDataMap[K]
): BenjiConnectOnEventData => {
  return {
    context: buildContext(),
    type: message.type,
    metadata: data
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
