import type {
  BenjiConnectEventMap,
  BenjiConnectEventMessage,
  BenjiConnectKnownEvent,
  BenjiConnectUserData,
} from './types';

import {
  BenjiConnectCallbackMapperMap,
} from './types';

type RouterConfig = {
  expectedOrigin: string;

  // Fan-out emitter to internal event bus
  emit: <K extends keyof BenjiConnectEventMap & string>(
    type: K,
    detail: BenjiConnectEventMap[K]
  ) => void;

  // Flat callbacks for simplicity)
  onSuccess: (token: string, userData?: BenjiConnectUserData) => void;
  onError: (errorCode: string, errorMessage: string) => void;
  onExit: (reason?: string) => void;

  // Typed one-stream listener for consumers who want all events
  onEvent?: <K extends BenjiConnectKnownEvent>(
    event: { type: K; data: BenjiConnectEventMap[K] }
  ) => void;

  close: () => void;

  // Optional guards
  namespace?: string;         // e.g., 'benji-connect-sdk'
  version?: string | number;  // e.g., '1.0.0'
};

export function createMessageRouter(deps: RouterConfig) {
  const {
    expectedOrigin,
    emit,
    onSuccess,
    onError,
    onExit,
    onEvent,
    close,
    namespace,
    version,
  } = deps;

  return function handleMessage(event: MessageEvent<unknown>) {

    console.log('benji-connect-sdk message event recieved', event);

    // Basic origin check
    if (!event || event.origin !== expectedOrigin) return;

    const raw = event.data;
    if (!raw || typeof raw !== 'object') return;

    const message = raw as Partial<BenjiConnectEventMessage>;
    if (typeof message.type !== 'string') return;

    // Constraint checks
    if (namespace && message.namespace && message.namespace !== namespace) return;
    if (version != null && message.version != null && String(message.version) !== String(version)) return;

    console.log('benji-connect-sdk recieved message', message);

    // Type events and route to callbacks
    switch (message.type) {

      case 'authSuccess': {

        const eventMessage = message as BenjiConnectEventMessage<'authSuccess'>;
        const eventData = eventMessage.data;
        console.log('benji-connect-sdk typed event', eventMessage, eventData);

        const callbackData = BenjiConnectCallbackMapperMap.authSuccess(eventMessage, eventData);
        console.log('benji-connect-sdk typed callback', callbackData);
        
        try {
          onEvent?.({ type: eventMessage.type, data: eventMessage.data });
          onSuccess(callbackData.token, callbackData.userId);
        } finally {
          close();
        }
        break;
      }

      case 'authError': {

        const eventMessage = message as BenjiConnectEventMessage<'authError'>;
        const eventData = eventMessage.data;
        console.log('benji-connect-sdk typed event', eventMessage, eventData);

        const callbackData = BenjiConnectCallbackMapperMap.authError(eventMessage, eventData);
        console.log('benji-connect-sdk typed callback', callbackData);
        
        try {
          close(); // user exited; ensure teardown
          onEvent?.({ type: eventMessage.type, data: eventMessage.data });
          onError(callbackData.errorCode, callbackData.errorMessage, callbackData.userId);
        } finally {
          close();
        }
        break;
      }

      case 'authExit': {

        const eventMessage = message as BenjiConnectEventMessage<'authExit'>;
        const eventData = eventMessage.data;
        console.log('benji-connect-sdk typed event', eventMessage, eventData);

        const callbackData = BenjiConnectCallbackMapperMap.authExit(eventMessage, eventData);
        console.log('benji-connect-sdk typed callback', callbackData);
        
        try {
          close(); // user exited; ensure teardown
          onEvent?.({ type: eventMessage.type, data: eventMessage.data });
          onExit(callbackData.reason);
        } finally {
          close();
        }
        break;
      }

      default: {
        // Unknown (forward generically)
        const unknownMessage = message as BenjiConnectEventMessage<any>;
        onEvent?.({ type: unknownMessage.type, data: unknownMessage.data });
        break;
      }
    }
  };
}
