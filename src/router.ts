import type {
  BenjiConnectEventData,
  BenjiConnectEventMap,
  BenjiConnectEventMessage,
  BenjiConnectOnSuccessData,
  BenjiConnectOnErrorData,
  BenjiConnectOnExitData,
  BenjiConnectOnEventData
} from './types';

import {
  BenjiConnectAuthAction,
  BenjiConnectCallbackMapperMap,
  mapToOnEventData
} from './types';

type RouterConfig = {
  expectedOrigin: string;

  // Fan-out emitter to internal event bus
  emit: <K extends keyof BenjiConnectEventMap & string>(
    type: K,
    detail: BenjiConnectEventMap[K]
  ) => void;

  onSuccess?: (data: BenjiConnectOnSuccessData) => void;
  onError?: (data: BenjiConnectOnErrorData) => void;
  onExit?: (data: BenjiConnectOnExitData) => void;
  onEvent?: (data: BenjiConnectOnEventData) => void;

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

    try {
      // Type events and route to callbacks
      switch (message.type) {

        case 'authSuccess': {
          const m = message as BenjiConnectEventMessage<'authSuccess'>;
          console.log('benji-connect-sdk authSuccess typed event', m, m.data);
          onEvent?.(mapToOnEventData(m, m.data)); // public event shape

          // Only forward onSuccess if in connect auth flow
          if (m.data.action == BenjiConnectAuthAction.Connect) {
            const callbackData = BenjiConnectCallbackMapperMap.authSuccess(m, m.data);
            console.log('benji-connect-sdk authSuccess typed callback', callbackData);
            onSuccess?.(callbackData);
          } else {
            console.log('benji-connect-sdk authSuccess not in conenct');
          }          
          break;
        }

        case 'authExit': {
          const m = message as BenjiConnectEventMessage<'authExit'>;
          const callbackData = BenjiConnectCallbackMapperMap.authExit(m, m.data);
          console.log('benji-connect-sdk authExit typed event', m, m.data);
          console.log('benji-connect-sdk authExit typed callback', callbackData);
          onEvent?.(mapToOnEventData(m, m.data));
          onExit?.(callbackData);
          break;
        }

        case 'error': {
          const m = message as BenjiConnectEventMessage<'error'>;
          const callbackData = BenjiConnectCallbackMapperMap.error(m, m.data);
          console.log('benji-connect-sdk error typed event', m, m.data);
          console.log('benji-connect-sdk error typed callback', callbackData);
          onEvent?.(mapToOnEventData(m, m.data));
          onError?.(callbackData);
          break;
        }

        default: {
          // Unknown (forward generically)
          const m = message as BenjiConnectEventMessage<any>;
          console.log('benji-connect-sdk default typed event', m, m.data);
          onEvent?.(mapToOnEventData(m, m.data as BenjiConnectEventData));
          break;
        }
      }
    } finally {
      // Close once per terminal event; all current events are terminal.
      close();
    }
  };
}
