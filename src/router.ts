import type { BenjiEventMap } from './types';

type RouterConfig = {
  expectedOrigin: string;
  emit: <K extends keyof BenjiEventMap & string>(type: K, detail: BenjiEventMap[K]) => void;
  onSuccess: (token: string, metadata?: unknown) => void;
  onExit: () => void;
  onEvent?: (evt: { type: string; data?: unknown }) => void;
  close: () => void;
  // optional: protocol guards
  namespace?: string;   // e.g., 'benji-connect-sdk'
  version?: string;    // e.g., 1.0.0
};

export function createMessageRouter(deps: RouterConfig) {
  const {
    expectedOrigin, emit, onSuccess, onExit, onEvent, close, namespace, version,
  } = deps;

  return function handleMessage(event: MessageEvent<any>) {
    if (!event || event.origin !== expectedOrigin) return;

    const message = event.data ?? {};
    // Optional namespace/version guards:
    if (namespace && message.namespace && message.ns !== namespace) return;
    if (typeof version === 'number' && typeof message.version === 'number' && message.version !== version) return;

    const { type, data } = message as { type?: string; data?: unknown };
    if (!type) return;

    switch (type) {
      case 'authSuccess': {
        const payload = (data ?? {}) as BenjiEventMap['authSuccess'];
        try {
          onSuccess(payload.token, payload.metadata);
          emit('authSuccess', payload);
        } finally {
          close();
        }
        break;
      }
      case 'authExit': {
        const payload = (data ?? {}) as BenjiEventMap['authExit'];
        close();
        onExit?.();
        emit('authExit', payload);
        break;
      }
      default: {
        onEvent?.({ type, data });
        // fan-out as catch-all
        emit('*', { type, data });
        break;
      }
    }
  };
}
