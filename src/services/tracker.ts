import { 
  Credentials,
  Endpoints,
  Environment,
  Namespace,
  Version
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
    MixpanelService.init(Environment, token, accessURL);
  }
  
  return true;
}

function ensureBugsnag() {

  const apiKey = Credentials.bugsnag_api_key;

  if (!apiKey) {
    return false;
  }

  if (!BugsnagService.initialized) {
    BugsnagService.init(Environment, apiKey);
  }

  return true;
}

export class Tracker {

  static configured = false;

  static configureTracker() {
    if (this.configured) return;
    this.configureBugsnag();
    this.configureMixpanel();
    this.configured = true;
  }

  static configureBugsnag() {
    ensureBugsnag();
  }

  static configureMixpanel() {
    ensureMixpanel();
  }

  static reset() {
    BugsnagService.reset();
    MixpanelService.reset();
    this.configured = false;
  }

  static insertProperties() {
    let properties: Record<string, any> = {
      'environment' : Environment,
      'mode' : Environment,
      'namespace' : Namespace,
      'version' : Version
    };
    properties['merchant_name'] = '';
    properties['partner_name'] = '';
    properties['partnership_id'] = '';
    properties['user_id'] = '';
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