import { 
  Endpoints
} from '../config';

import {
  BenjiConnectEventType,
  type BenjiConnectEventData,
  type BenjiConnectEventMessage
} from '../types/event';

import type {
  BenjiConnectOnSuccessData,
  BenjiConnectOnExitData,
  BenjiConnectMetadata,
  BenjiConnectOnSuccessMetadata,
  BenjiConnectOnExitMetadata
} from '../types/config';

import {
  BenjiConnectCallbackMapperMap,
  MessageRouterConfig,
  mapToOnEventData
} from '../types/router';

export class MessageRouter {

  static configuredListeners = false;
  static onSuccess?: (
      token: string, 
      metadata: BenjiConnectOnSuccessMetadata
    ) => void;
  static onError?: (
      error: Error,
      error_id: string,
      metadata: BenjiConnectMetadata
    ) => void;
  static onExit?: (
    metadata: BenjiConnectOnExitMetadata
  ) => void;
  static onEvent?: (
      type: BenjiConnectEventType, 
      metadata: BenjiConnectMetadata
    ) => void;
  static close?: () => void;

  static configureMessageRouter(config: MessageRouterConfig) {
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onExit = config.onExit;
    this.onEvent = config.onEvent;
    this.close = config.close;
  }

  static errorEventHandler = (event: Event) => { 
    return MessageRouter.handleErrorMessage(event) 
  };

  static messageEventHandler = (event: MessageEvent<unknown>) => { 
    return MessageRouter.handleMessage(event) 
  };

  static addEventListeners() {
    if (this.configuredListeners) return;
    window.addEventListener('error', this.errorEventHandler);
    window.addEventListener('unhandledrejection', this.errorEventHandler);
    window.addEventListener('message', this.messageEventHandler);
    this.configuredListeners = true;

    // Test uncaught error handling
    // Promise.reject(new Error('[Benji Connect SDK]  MessageRouter Test rejection'));
    // throw new Error('[Benji Connect SDK] MessageRouter Test error');
  }

  static removeEventListeners() {
    window.removeEventListener('error', this.errorEventHandler);
    window.removeEventListener('unhandledrejection', this.errorEventHandler);
    window.removeEventListener('message', this.messageEventHandler);
    this.configuredListeners = false;
  }

  static handleErrorMessage(event: Event) {   
    switch(event.type) {
      case 'error': {
        const errorEvent = event as ErrorEvent;
        const error = errorEvent.error || new Error(errorEvent.message);
        // TODO: Track error
        break;
      }
      case 'unhandledrejection': {
        const rejectionEvent = event as PromiseRejectionEvent;
        const reason = rejectionEvent.reason instanceof Error
          ? rejectionEvent.reason
          : new Error(String(rejectionEvent.reason));
        // TODO: Track error (reason)
        break;
      }
      default: {
        console.error('[Benji Connect SDK] Received Unknown error message', event);
        break;
      }
    }
  }

  static handleMessage(event: MessageEvent<unknown>) {

    console.debug('[Benji Connect SDK] Received message', event);
  
    // Basic origin check
    const expectedOrigin: string = new URL(Endpoints.benji_connect_auth_url).origin;
    if (!event || event.origin !== expectedOrigin) {
      console.warn('[Benji Connect SDK] Skipped message, received event from unexpected origin', event.origin, expectedOrigin);
      return;
    }

    const raw = event.data;
    if (!raw || typeof raw !== 'object') return;

    const partial = raw as Partial<BenjiConnectEventMessage>;
    if (typeof partial.type !== 'string') return;
    
    const message = partial as BenjiConnectEventMessage;

    // TODO: Proper Constraint checks
    // if (Namespace && message.namespace && message.namespace !== Namespace) return;
    // if (Version != null && message.version != null && String(message.version) !== String(Version)) return;

    // TODO: Track message received either here or below but not both
    
    try {
      // Type events and route to callbacks
      switch (message.type) {

        case BenjiConnectEventType.AUTH_SUCCESS: {
          const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.AUTH_SUCCESS>;
          const callbackData = BenjiConnectCallbackMapperMap.AUTH_SUCCESS(connectMessage, connectMessage.data);
          // TODO: Track message received?
          this.onEvent?.(callbackData.type, callbackData.metadata);      
          break;
        }

        case BenjiConnectEventType.FLOW_EXIT: {
          const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.FLOW_EXIT>;
          const callbackData = BenjiConnectCallbackMapperMap.FLOW_EXIT(connectMessage.data) as BenjiConnectOnExitData;
          // TODO: Track message received?
          this.onExit?.(callbackData.metadata);
          this.close?.();
          break;
        }

        case BenjiConnectEventType.FLOW_SUCCESS: {
          const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.FLOW_SUCCESS>;
          // TODO: Track message received?
          // Forward onSuccess when flow completes for connect, redeem and transfer 
          const callbackData = BenjiConnectCallbackMapperMap.FLOW_SUCCESS(connectMessage.data) as BenjiConnectOnSuccessData;
          this.onSuccess?.(callbackData.token, callbackData.metadata);       
          break;
        }

        case BenjiConnectEventType.ERROR: {
          const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.ERROR>;
          // TODO: Track message received?
          const callbackData = BenjiConnectCallbackMapperMap.ERROR(connectMessage.data);
          this.onError?.(callbackData.error, callbackData.error_id, callbackData.metadata);
          break;
        }

        default: {
          // Unknown event type (forward generically)
          const m = message as BenjiConnectEventMessage<any>;
          // TODO: Track message received?
          const callbackData = mapToOnEventData(m, m.data as BenjiConnectEventData);
          this.onEvent?.(callbackData.type, callbackData.metadata);
          break;
        }
      }
    } finally {
      // TODO: Any cleanup logic 
    }
  }

}