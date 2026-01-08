/// <reference path="./global.d.ts" />

import { 
  configureConfig, 
  Endpoints
} from './config';

import { 
  type BenjiConnectConfig, 
  BenjiConnectEnvironment
} from './types/config';

import { 
  buildContext, 
  mapToConnectEnvironment 
} from './utils/config';

import { MessageRouter } from './router/message';
import { BenjiConnectExitTrigger } from './types/event';

class ConnectSDK {

  private sdkConfig: BenjiConnectConfig;
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLDivElement | null = null;

  constructor(config: BenjiConnectConfig) {

    this.sdkConfig = config;

    // Validations
    if (!this.sdkConfig.environment) throw new Error('Environment is required');
    if (!this.sdkConfig.token) throw new Error('Connect token is required');

    // Set internal config for environment based on consumer input at runtime
    const environment: BenjiConnectEnvironment = mapToConnectEnvironment(this.sdkConfig.environment);
    this.sdkConfig.environment = environment;
    configureConfig(environment);
  }

  async initialize() {
    
    // Configure message router for all postMessage from connect modal and error messages
    MessageRouter.configureMessageRouter({
      onSuccess: this.sdkConfig.onSuccess,
      onError: this.sdkConfig.onError,
      onExit: this.sdkConfig.onExit,
      onEvent: this.sdkConfig.onEvent,
      close: () => this.close()
    });

    // TODO: Tracker.configureWithOptions(sdkOptions);
    // TODO: Tracker.trackSDKInitialized();
  }

  async open() {
    await this.initialize();
    this.openUI();
    MessageRouter.addEventListeners();
     // TODO: Track SDK Opened Tracker.trackSDKOpened();
  }

  openUI() {
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
    console.debug('[Connect SDK] endpoints', Endpoints);
    console.log('[Connect SDK] opeining URL', Endpoints.benji_connect_auth_url);
    const url = new URL(Endpoints.benji_connect_auth_url);
    const connectToken = this.sdkConfig.token;
    url.searchParams.set('connect_token', connectToken);
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
      // Trigger exit when user taps outside modal bounds
      this.sdkConfig.onExit?.({
        context: buildContext(),
        trigger: BenjiConnectExitTrigger.TAPPED_OUT_OF_BOUNDS
      });
      if (e.target === this.container) this.close();
    });
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