import { buildContext } from '../utils/config';

import { 
  extractUserData, 
  normalizeToken 
} from '../utils/types';

import { 
  BenjiConnectAuthExitEventData, 
  BenjiConnectAuthSuccessEventData, 
  BenjiConnectErrorEventData, 
  BenjiConnectEventData, 
  BenjiConnectEventMessage, 
  BenjiConnectEventMetadata, 
  BenjiConnectEventType, 
  BenjiConnectFlowSuccessEventData 
} from './event';

import { BenjiConnectUserData } from './user';

export type MessageRouterConfig = {
  onSuccess?: (data: BenjiConnectOnSuccessData) => void;
  onError?: (data: BenjiConnectOnErrorData) => void;
  onExit?: (data: BenjiConnectOnExitData) => void;
  onEvent?: (data: BenjiConnectOnEventData) => void;
  close: () => void;
};

/* ========== Derived Callback types (no unecessary metadata) =============== */

export interface BenjiConnectData {
  context: { namespace: string; version: string };
}

export interface BenjiConnectOnSuccessData extends BenjiConnectData {
  token: string;
  userData: BenjiConnectUserData;
}

export interface BenjiConnectOnErrorData extends BenjiConnectData  {
  errorCode: string;
  errorMessage: string;
}

export interface BenjiConnectOnExitData extends BenjiConnectData  {
  step?: string;
  trigger?: string;
}

export interface BenjiConnectOnEventData extends BenjiConnectData  {
  type: BenjiConnectEventType;
  metadata?: BenjiConnectEventMetadata;
}

/* ====================== Callback Mappers ====================== */

export const mapToAuthSuccessData = (
  message: BenjiConnectEventMessage<'AUTH_SUCCESS'>,
  data: BenjiConnectAuthSuccessEventData
): BenjiConnectOnEventData => {
  return {
    type: 'AUTH_SUCCESS',
    context: buildContext(),
    metadata: {
      userData: extractUserData(data),
      token: normalizeToken(data.token)
    }
  };
};

export const mapToOnExitData = (
  message: BenjiConnectEventMessage<'FLOW_EXIT'>,
  data: BenjiConnectAuthExitEventData
): BenjiConnectOnExitData => {
  return {
    context: buildContext(),
    step: data.step,
    trigger: data.trigger,
  };
};

export const mapToOnSuccessData = (
  message: BenjiConnectEventMessage<'FLOW_SUCCESS'>,
  data: BenjiConnectFlowSuccessEventData
): BenjiConnectOnSuccessData => {
  return {
    context: buildContext(),
    userData: extractUserData(data),
    token: normalizeToken(data.token),
  };
};

export const mapToOnErrorData = (
  message: BenjiConnectEventMessage<'ERROR'>,
  data: BenjiConnectErrorEventData
): BenjiConnectOnErrorData => {
  return {
    context: buildContext(),
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
  };
};

export const mapToOnEventData = (
  message: BenjiConnectEventMessage,
  data: BenjiConnectEventData
): BenjiConnectOnEventData => {
  return {
    context: buildContext(),
    type: message.type,
    metadata: data.metadata
  };
};

export type BenjiConnectCallbackDataMap = {
  AUTH_SUCCESS: BenjiConnectOnEventData;
  FLOW_EXIT: BenjiConnectOnExitData;
  FLOW_SUCCESS: BenjiConnectOnSuccessData;
  ERROR: BenjiConnectOnErrorData;
  EVENT: BenjiConnectOnEventData;
  '*': BenjiConnectOnEventData;
};

export const BenjiConnectCallbackMapperMap = {
  AUTH_SUCCESS: mapToAuthSuccessData,
  FLOW_EXIT: mapToOnExitData,
  FLOW_SUCCESS: mapToOnSuccessData,
  ERROR: mapToOnErrorData,
  EVENT: mapToOnEventData,
} as const;
