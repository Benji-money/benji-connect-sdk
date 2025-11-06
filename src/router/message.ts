import { 
  Endpoints,
  Namespace, 
  Version 
} from '../config';

import type {
  BenjiConnectEventData,
  BenjiConnectEventMessage,
  BenjiConnectOnSuccessData,
  BenjiConnectOnErrorData,
  BenjiConnectOnExitData,
  BenjiConnectOnEventData
} from '../types/types';

import {
  BenjiConnectAuthAction,
  BenjiConnectCallbackMapperMap,
  mapToOnEventData
} from '../types/types';

import { MessageRouterConfig } from '../types/router';

import { Tracker } from '../services/tracker';

export class MessageRouter {

  static configuredListeners = false;
  static expectedOrigin: string = new URL(Endpoints.benji_connect_auth_url).origin;
  static onSuccess?: (data: BenjiConnectOnSuccessData) => void;
  static onError?: (data: BenjiConnectOnErrorData) => void;
  static onExit?: (data: BenjiConnectOnExitData) => void;
  static onEvent?: (data: BenjiConnectOnEventData) => void;
  static close: () => void;

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
        console.log('SDK Received Error event', errorEvent);
        const error = errorEvent.error || new Error(errorEvent.message);
        Tracker.trackError(error);
        break;
      }
      case 'unhandledrejection': {
        const rejectionEvent = event as PromiseRejectionEvent;
        console.log('SDK Received Rejection event', rejectionEvent);
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
  
      const message = raw as Partial<BenjiConnectEventMessage>;
      if (typeof message.type !== 'string') return;
  
      // Constraint checks
      if (Namespace && message.namespace && message.namespace !== Namespace) return;
      if (Version != null && message.version != null && String(message.version) !== String(Version)) return;
  
      try {
        // Type events and route to callbacks
        switch (message.type) {
  
          case 'AUTH_SUCCESS': {
            const m = message as BenjiConnectEventMessage<'AUTH_SUCCESS'>;
            Tracker.trackEventMessageReceived(m);
            const callbackData = BenjiConnectCallbackMapperMap.AUTH_SUCCESS(m, m.data);
            this.onEvent?.(callbackData);      
            break;
          }
  
          case 'FLOW_EXIT': {
            const m = message as BenjiConnectEventMessage<'FLOW_EXIT'>;
            Tracker.trackEventMessageReceived(m);
            const callbackData = BenjiConnectCallbackMapperMap.FLOW_EXIT(m, m.data);
            this.onEvent?.(mapToOnEventData(m, m.data));
            this.onExit?.(callbackData);
            close();
            break;
          }
  
          case 'FLOW_SUCCESS': {
            const m = message as BenjiConnectEventMessage<'FLOW_SUCCESS'>;
            Tracker.trackEventMessageReceived(m);
            this.onEvent?.(mapToOnEventData(m, m.data)); // public event shape
  
            // Only forward onSuccess if in connect auth flow
            if (m.data.action == BenjiConnectAuthAction.Connect) {
              const callbackData = BenjiConnectCallbackMapperMap.FLOW_SUCCESS(m, m.data);
              this.onSuccess?.(callbackData);
            }         
            break;
          }
  
          case 'ERROR': {
            const m = message as BenjiConnectEventMessage<'ERROR'>;
            Tracker.trackEventMessageReceived(m);
            const callbackData = BenjiConnectCallbackMapperMap.ERROR(m, m.data);
            this.onEvent?.(mapToOnEventData(m, m.data));
            this.onError?.(callbackData);
            break;
          }
  
          default: {
            // Unknown (forward generically)
            const m = message as BenjiConnectEventMessage<any>;
            Tracker.trackEventMessageReceived(m);
            this.onEvent?.(mapToOnEventData(m, m.data as BenjiConnectEventData));
            break;
          }
        }
      } finally {
        // TODO: Any cleanup logic 
      }
    }

}