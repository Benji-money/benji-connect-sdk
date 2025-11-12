/// <reference path="./global.d.ts" />

import { 
  configureConfig, 
  Endpoints
} from './config';

import { configureAuth } from './lib/auth';
import { requestAuthToken } from './api/auth/requestAuthToken';

import { 
  type BenjiConnectConfig, 
  type BenjiConnectOptions, 
  BenjiConnectMode
} from './types/config';

import { MessageRouter } from './router/message';

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

    // Validations
    if (!baseSDKConfig.bearerToken) throw new Error('Bearer token is required');

    // Produce an InternalSDKConfig (token intentionally absent at this point)
    this.sdkConfig = { 
      ...baseSDKConfig, 
      // token is optional and will be added in initialize()
    };

    // Set config for mode/environment based on consumer input at runtime
    configureConfig(config.environment, BenjiConnectMode.CONNECT); // For now only in connect mode

    // TODO: Configure tracker for new config environment 

    MessageRouter.configureMessageRouter({
      onSuccess: this.sdkConfig.onSuccess,
      onError: this.sdkConfig.onError,
      onExit: this.sdkConfig.onExit,
      onEvent: this.sdkConfig.onEvent,
      close: () => this.close()
    });
  }

  async initialize(params: BenjiConnectOptions) {
    configureAuth(this.sdkConfig, params);
    (this.sdkConfig as any).token = await requestAuthToken();
    // TODO: Tracker.configureWithOptions(params);
    // TODO: Tracker.trackSDKInitialized();
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

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });

    MessageRouter.addEventListeners();
    // TODO: Track SDK Opened Tracker.trackSDKOpened();
  }

  close() {
    if (!this.iframe) return;
    document.body.removeChild(this.container!);
    MessageRouter.removeEventListeners();
    // TODO: Track SDK Closed Tracker.trackSDKClosed();
    this.iframe = null;
    this.container = null;
  }

  cleanup() {
    if (this.iframe) this.close();
  }

  ping() { return 'pong'; }
}

export default ConnectSDK;