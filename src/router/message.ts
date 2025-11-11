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

import { Tracker } from '../services/tracker';
import { BenjiConnectAuthAction } from '../types/auth';

export class MessageRouter {

  static configuredListeners = false;
  static expectedOrigin: string = new URL(Endpoints.benji_connect_auth_url).origin;
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
    // Promise.reject(new Error('MessageRouter Test rejection'));
    // throw new Error('MessageRouter Test error');
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
        Tracker.trackError(error);
        break;
      }
      case 'unhandledrejection': {
        const rejectionEvent = event as PromiseRejectionEvent;
        const reason = rejectionEvent.reason instanceof Error
          ? rejectionEvent.reason
          : new Error(String(rejectionEvent.reason));
        Tracker.trackError(reason);
        break;
      }
      default: {
        console.log('SDK Received Unknown error message', event);
        break;
      }
    }
  }

  static handleMessage(event: MessageEvent<unknown>) {
  
      // Basic origin check
      if (!event || event.origin !== this.expectedOrigin) return;
  
      const raw = event.data;
      if (!raw || typeof raw !== 'object') return;
  
      const partial = raw as Partial<BenjiConnectEventMessage>;
      if (typeof partial.type !== 'string') return;
      
      const message = partial as BenjiConnectEventMessage;
      console.log('Received message ', message);
  
      // Constraint checks
      // if (Namespace && message.namespace && message.namespace !== Namespace) return;
      // if (Version != null && message.version != null && String(message.version) !== String(Version)) return;
  
      Tracker.trackEventMessageReceived(message);
      
      try {
        // Type events and route to callbacks
        switch (message.type) {
  
          case BenjiConnectEventType.AUTH_SUCCESS: {
            const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.AUTH_SUCCESS>;
            const callbackData = BenjiConnectCallbackMapperMap.AUTH_SUCCESS(connectMessage, connectMessage.data);
            Tracker.trackEventMessageReceived(connectMessage);
            this.onEvent?.(callbackData.type, callbackData.metadata);      
            break;
          }
  
          case BenjiConnectEventType.FLOW_EXIT: {
            const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.FLOW_EXIT>;
            const callbackData = BenjiConnectCallbackMapperMap.FLOW_EXIT(connectMessage.data) as BenjiConnectOnExitData;
            Tracker.trackEventMessageReceived(connectMessage);
            this.onExit?.(callbackData.metadata);
            this.close?.();
            break;
          }
  
          case BenjiConnectEventType.FLOW_SUCCESS: {
            const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.FLOW_SUCCESS>;
            Tracker.trackEventMessageReceived(connectMessage);
  
            // Only forward onSuccess if in connect auth flow
            if (connectMessage.data.action == BenjiConnectAuthAction.Connect) {
              const callbackData = BenjiConnectCallbackMapperMap.FLOW_SUCCESS(connectMessage.data) as BenjiConnectOnSuccessData;
              this.onSuccess?.(callbackData.token, callbackData.metadata);
            }         
            break;
          }
  
          case BenjiConnectEventType.ERROR: {
            const connectMessage = message as BenjiConnectEventMessage<BenjiConnectEventType.ERROR>;
            Tracker.trackEventMessageReceived(connectMessage);
            const callbackData = BenjiConnectCallbackMapperMap.ERROR(connectMessage.data);
            this.onError?.(callbackData.error, callbackData.error_id, callbackData.metadata);
            break;
          }
  
          default: {
            // Unknown event type (forward generically)
            const m = message as BenjiConnectEventMessage<any>;
            Tracker.trackEventMessageReceived(m);
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