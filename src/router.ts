// router.ts
import type {
  BenjiConnectEventMap,
  BenjiConnectEventMessage,
  BenjiConnectKnownEvent,
} from './types';

type RouterConfig = {
  expectedOrigin: string;

  // Fan-out emitter to internal event bus
  emit: <K extends keyof BenjiConnectEventMap & string>(
    type: K,
    detail: BenjiConnectEventMap[K]
  ) => void;

  // FLAT callbacks (back-compat & simplicity)
  onSuccess: (token: string, metadata?: unknown) => void;
  onExit: (reason?: string) => void;

  // Typed one-stream listener for consumers who want everything
  onEvent?: <K extends BenjiConnectKnownEvent>(
    evt: { type: K; data: BenjiConnectEventMap[K] }
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

    // Optional constraint checks
    if (namespace && message.namespace && message.namespace !== namespace) return;
    if (version != null && message.version != null && String(message.version) !== String(version)) return;

    console.log('benji-connect-sdk case message', message);

    // From here consider the message well-formed for internal protocol
    switch (message.type) {
      case 'authSuccess': {
        const typedMessage = message as BenjiConnectEventMessage<'authSuccess'>;
        const payload = typedMessage.data;
        console.log('benji-connect-sdk recieved authSuccess', typedMessage);
        try {
          onSuccess(payload.token, payload.metadata);
          emit('authSuccess', payload);
        } finally {
          // Typical UX: close on success
          close();
        }
        break;
      }

      case 'authExit': {
        const typedMessage = message as BenjiConnectEventMessage<'authExit'>;
        const payload = typedMessage.data;
        console.log('benji-connect-sdk recieved authExit', typedMessage);
        close(); // user exited; ensure teardown
        //onExit?.(payload?.reason);
        onExit?.();
        emit('authExit', payload);
        break;
      }

      case 'authError': {
       const typedMessage = message as BenjiConnectEventMessage<'authError'>;
        const payload = typedMessage.data;
        console.log('benji-connect-sdk recieved authError', typedMessage);
        emit('authError', payload);
        onEvent?.({ type: 'authError', data: payload });
        break;
      }

      default: {
        // Unknown (forward generically)
        const unknownMessage = message as BenjiConnectEventMessage<any>;
        onEvent?.({ type: unknownMessage.type, data: unknownMessage.data });
        emit('*', { type: unknownMessage.type, data: unknownMessage.data });
        break;
      }
    }
  };
}
