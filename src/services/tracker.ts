import { track } from 'mixpanel-browser';
import { 
  environment,
  Credentials,
  Endpoints
} from '../config'
import { TrackEventName } from '../types/tracker';
import { BugsnagService } from './bugsnag';
import { MixpanelService } from './mixpanel';

function ensureMixpanel() {

  const token = Credentials.mixpanel_token;
  const accessURL = Endpoints.mixpanel_access_url;

  if (!token || !accessURL) {
    return false;
  }

  if (!MixpanelService.initialized) {
    MixpanelService.init(environment, token, accessURL);
  }
  
  return true;
}

function ensureBugsnag() {

  const apiKey = Credentials.bugsnag_api_key;

  if (!apiKey) {
    return false;
  }

  if (!BugsnagService.initialized) {
    BugsnagService.init(environment, apiKey);
  }

  return true;
}

export class Tracker {

  static configured = false

  /*
  variables sdk may want to know about for tracking...
  ?
  merchant_name
  partner_name
  partnership_id
  user_id
  ?
  */

  static errorEventHandler = (event: Event) => { 
    return Tracker.handleErrorMessage(event) 
  };

  static configure() {
    if (this.configured) return;
    this.configureBugsnag();
    this.configureMixpanel();
    this.configureEventListeners();
    this.configured = true;

    // Testing error handling
    Promise.reject(new Error('Test rejection'));
    throw new Error('Test error');
  }

  static configureBugsnag() {
    ensureBugsnag();
  }

  static configureMixpanel() {
    ensureMixpanel();
  }

  static configureEventListeners() {
    window.addEventListener('error', this.errorEventHandler);
    window.addEventListener('unhandledrejection', this.errorEventHandler);
  }

  static reset() {
    BugsnagService.reset();
    MixpanelService.reset();
    this.resetEventListeners();
    this.configured = false;
  }

  static resetEventListeners() {
    window.removeEventListener('error', this.errorEventHandler);
    window.removeEventListener('unhandledrejection', this.errorEventHandler);
  }

  static handleErrorMessage(event: Event) {   
    switch(event.type) {
      case 'error': {
        const errorEvent = event as ErrorEvent;
        console.log('SDK Received Error event', errorEvent);
        const error = errorEvent.error || new Error(errorEvent.message);
        this.trackError(error);
        break;
      }
      case 'unhandledrejection': {
        const rejectionEvent = event as PromiseRejectionEvent;
        console.log('SDK Received Rejection event', rejectionEvent);
        const reason = rejectionEvent.reason instanceof Error
          ? rejectionEvent.reason
          : new Error(String(rejectionEvent.reason));
        this.trackError(reason);
        break;
      }
      default: {
        console.log('SDK Received Unknown error message', event);
        break;
      }
    }
  }

  static trackError(error: Error) {
    console.log('SDK Tracking error', error);
    // Todo: Add properties? 
    BugsnagService.track(error);
  }

  static trackEvent(eventName: string, properties?: Record<string, any>) {
    MixpanelService.track(eventName, properties);
  }

  static trackSDKInitialized() {
    this.trackEvent(TrackEventName.CONNECT_SDK_INITIALIZED, {});
  }

  static trackSDKOpened() {
    this.trackEvent(TrackEventName.CONNECT_SDK_OPENED, {});
  }

  static trackSDKEventReceived() {
    this.trackEvent(TrackEventName.CONNECT_SDK_EVENT_RECEIVED, {});
  }

  static trackSDKClosed() {
    this.trackEvent(TrackEventName.CONNECT_SDK_CLOSED, {});
  }

}