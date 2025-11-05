/// <reference path="./global.d.ts" />
import { 
  BENJI_CONNECT_AUTH_SERVICE_URL, 
  BENJI_CONNECT_AUTH_URL, 
  configure 
} from './config';
import type { 
  BenjiConnectConfig, 
  BenjiConnectOptions, 
  BenjiConnectEventMap, 
  BenjiConnectEnvironment 
} from './types/types';
import { TypedEmitter } from './services/emitter';
import { createMessageRouter } from './services/router';
import { tracker } from './analytics/tracker';

// @internal but not exported
interface InternalConfig extends BenjiConnectConfig {
  token?: string; // set after initialize()
}

class ConnectSDK {
  private sdkConfig: InternalConfig;
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLDivElement | null = null;
  private messageRouter?: (e: MessageEvent) => void;
  public events = new TypedEmitter<BenjiConnectEventMap>();

  constructor(config: BenjiConnectConfig) {
    const baseSDKConfig: BenjiConnectConfig = { ...config };

    // validations
    if (!baseSDKConfig.bearerToken) throw new Error('Bearer token is required');
    if (typeof baseSDKConfig.onSuccess !== 'function') throw new Error('onSuccess callback is required');
    if (typeof baseSDKConfig.onError !== 'function') throw new Error('onError callback is required');
    if (typeof baseSDKConfig.onExit !== 'function') throw new Error('onExit callback is required');

    // Produce an InternalSDKConfig (token intentionally absent at this point)
    this.sdkConfig = { 
      ...baseSDKConfig, 
      // token is optional and will be added in initialize()
    };

    // normalize onEvent
    if (!this.sdkConfig.onEvent) this.sdkConfig.onEvent = () => {};

    // set configuration for mode/environment based on consumer input at runtime
    configure(config.environment);

    const expectedOrigin = new URL(BENJI_CONNECT_AUTH_URL).origin;

    this.messageRouter = createMessageRouter({
      expectedOrigin,
      onSuccess: this.sdkConfig.onSuccess,
      onError: this.sdkConfig.onError,
      onExit: this.sdkConfig.onExit,
      onEvent: this.sdkConfig.onEvent,
      emit: (t, d) => this.events.emit(t, d as any),
      close: () => this.close(),
      namespace: __NAMESPACE__,
      version: __VERSION__,
    });
  }

  private async getAuthToken(params: BenjiConnectOptions): Promise<string> {
    const requestData: Record<string, unknown> = {
      ...(params.userExternalId ? { user_external_id: params.userExternalId } : {}),
      mode: params.mode || 1,
      ...((!params.mode || params.mode !== 2) ? {
        partner_id: params.partnerId,
        merchant_id: params.merchantId
      } : {}),
      display_name: params.displayName,
      ...(params.partnershipId ? { partnership_id: params.partnershipId } : {})
    };

    try {
      const response = await fetch(`${BENJI_CONNECT_AUTH_SERVICE_URL}/verify/token/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sdkConfig.bearerToken}`
        },
        body: JSON.stringify(requestData)
      });

      const json = await response.json();
      return json?.data?.token as string;
    } catch (error) {
      console.error('Error in getAuthToken:', error);
      throw error;
    }
  }

  async initialize(params: BenjiConnectOptions) {
    (this.sdkConfig as any).token = await this.getAuthToken(params);
  }

  async openWithParams(params: BenjiConnectOptions) {
    await this.initialize(params);
    this.open();
  }

  open() {
    if (this.iframe) return;

    // container
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position: 'fixed', 
      top: '0', 
      left: '0', 
      width: '100%', 
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      zIndex: '9999', 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'auto'
    } as CSSStyleDeclaration);

    // iframe
    const url = new URL((this.sdkConfig as any).authUrl);
    url.searchParams.set('code', (this.sdkConfig as any).token);
    url.searchParams.set('t', String(Date.now()));

    this.iframe = document.createElement('iframe');
    Object.assign(this.iframe.style, {
      position: 'relative', 
      width: '400px', 
      height: '645px',
      border: 'none', 
      borderRadius: '20px', 
      overflow: 'hidden'
    } as CSSStyleDeclaration);
    this.iframe.src = url.toString();

    this.container.appendChild(this.iframe);
    document.body.appendChild(this.container);

    window.addEventListener('message', this.messageRouter!);

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  close() {
    if (!this.iframe) return;
    window.removeEventListener('message', this.messageRouter!);
    document.body.removeChild(this.container!);
    this.iframe = null;
    this.container = null;
  }

  cleanup() {
    if (this.iframe) this.close();
  }

  ping() { return 'pong'; }
}

export default ConnectSDK;