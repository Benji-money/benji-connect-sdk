import { 
  environment,
  Credentials,
  Endpoints
} from '../config'
import { TrackEventName } from '../types/tracker';
import { BugsnagService } from './bugsnag';
import { MixpanelService } from './mixpanel';

function ensureMixpanel() {

  const token = Credentials.mixpanel_project_token;
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

  const apiKey = '';

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

  static configure() {
    if (this.configured) return;
    console.log('SDK Configuring Tracker for environment', environment);
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

  static trackError(eventName: string, properties?: Record<string, any>) {
  
  }

  static trackEvent(eventName: string, properties?: Record<string, any>) {
    MixpanelService.track(eventName, properties);
  }

}