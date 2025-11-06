/// <reference path="./global.d.ts" />
import { 
  configureConfig, 
  Endpoints
} from './config';

import { 
  type BenjiConnectConfig, 
  type BenjiConnectOptions, 
  BenjiConnectMode
} from './types/types';

import { MessageRouter } from './router/message';
import { Tracker } from './services/tracker';

// @internal but not exported
interface InternalConfig extends BenjiConnectConfig {
  token?: string; // set after initialize()
}

class ConnectSDK {

  private sdkConfig: InternalConfig;
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLDivElement | null = null;

  constructor(config: BenjiConnectConfig) {

    const baseSDKConfig: BenjiConnectConfig = { ...config };
    console.log('SDK Initializing with config', config);

    // Validations
    if (!baseSDKConfig.bearerToken) throw new Error('Bearer token is required');
    if (typeof baseSDKConfig.onSuccess !== 'function') throw new Error('onSuccess callback is required');
    if (typeof baseSDKConfig.onError !== 'function') throw new Error('onError callback is required');
    if (typeof baseSDKConfig.onExit !== 'function') throw new Error('onExit callback is required');

    // Produce an InternalSDKConfig (token intentionally absent at this point)
    this.sdkConfig = { 
      ...baseSDKConfig, 
      // token is optional and will be added in initialize()
    };

    // Normalize onEvent
    if (!this.sdkConfig.onEvent) this.sdkConfig.onEvent = () => {};

    // Set config for mode/environment based on consumer input at runtime
    configureConfig(config.environment, BenjiConnectMode.CONNECT); // For now only in connect mode

    // Configure tracker for new config environment
    Tracker.configureTracker(); 

    MessageRouter.configureMessageRouter({
      onSuccess: this.sdkConfig.onSuccess,
      onError: this.sdkConfig.onError,
      onExit: this.sdkConfig.onExit,
      onEvent: this.sdkConfig.onEvent,
      close: () => this.close()
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
      display_name: params.merchantName,
      ...(params.partnershipId ? { partnership_id: params.partnershipId } : {})
    };

    try {
      const response = await fetch(`${Endpoints.benji_connect_auth_service_url}/verify/token/create`, {
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
    Tracker.configureWithOptions(params);
    (this.sdkConfig as any).token = await this.getAuthToken(params);
    Tracker.trackSDKInitialized();
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
    const url = new URL(Endpoints.benji_connect_auth_url);
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

    MessageRouter.addEventListeners();

    // TODO: Move to message router? 
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });

    Tracker.trackSDKOpened();
  }

  close() {
    if (!this.iframe) return;
    MessageRouter.removeEventListeners();
    Tracker.trackSDKClosed();
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