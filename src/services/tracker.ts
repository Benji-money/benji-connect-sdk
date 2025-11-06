import { 
  Credentials,
  Endpoints,
  Environment,
  Mode,
  Namespace,
  Version
} from '../config'
import { TrackEventName } from '../types/tracker';
import { BenjiConnectEventMessage } from '../types/types';
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

  static enhancedProperties(properties?: Record<string, any>) {
    let enhanced: Record<string, any> = {
      'environment' : Environment,
      'mode' : Mode,
      'namespace' : Namespace,
      'version' : Version,
      ...(properties ?? {}), // spread original properties if defined
    };
    enhanced['merchant_name'] = '';
    enhanced['partner_name'] = '';
    enhanced['partnership_id'] = '';
    enhanced['user_id'] = '';
    return enhanced;
  }

  static trackError(error: Error) {
    console.log('SDK Tracking error', error);
    // Todo: Add properties? 
    BugsnagService.track(error);
  }

  static trackEventMessageReceived(message: BenjiConnectEventMessage) {
    console.log('SDK Tracking event message', message);
    let properties: Record<string, any> = {
      'message_event_type' : message.type,
      'message_event_data' : message.data
    };
    this.trackEvent(TrackEventName.CONNECT_SDK_EVENT_MESSAGE_RECEIVED, properties);
  }

  static trackEvent(eventName: string, properties?: Record<string, any>) {
    const eventProperties = this.enhancedProperties(properties);
    MixpanelService.track(eventName, eventProperties);
  }

  static trackSDKInitialized() {
    this.trackEvent(TrackEventName.CONNECT_SDK_INITIALIZED);
  }

  static trackSDKOpened() {
    this.trackEvent(TrackEventName.CONNECT_SDK_OPENED);
  }

  static trackSDKClosed() {
    this.trackEvent(TrackEventName.CONNECT_SDK_CLOSED);
  }

}