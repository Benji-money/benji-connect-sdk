import { 
  Credentials,
  Endpoints,
  Environment,
  Mode,
  Namespace,
  Version
} from '../config'

import { BenjiConnectOptions } from '../types/config';
import { BenjiConnectEventMessage } from '../types/event';
import { TrackEventName } from '../types/tracker';
import { BenjiConnectUserData } from '../types/user';

import { 
  isConnectUserData, 
  mapEventToConnectUserData 
} from '../utils/user';

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
  static connectOptions?: BenjiConnectOptions;
  static userData?: BenjiConnectUserData;

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

  static configureWithOptions(options: BenjiConnectOptions) {
    this.connectOptions = options;
  }

  static configureWithEvent(properties?: Record<string, any>) {

    const metadata = properties?.data?.metadata;
    if(!metadata) return;

    const userData = mapEventToConnectUserData(metadata);

    if(isConnectUserData(userData)) {
      Tracker.configureWithUserData(userData);
    }
  }

  static configureWithUserData(data?: BenjiConnectUserData) {
    if (!data) return;
    this.userData = data;
    MixpanelService.configureWithUserData(data);
  }

  static reset() {
    BugsnagService.reset();
    MixpanelService.reset();
    this.configured = false;
  }

  static enrichedProperties(properties?: Record<string, any>) {
    let enriched: Record<string, any> = {
      'environment' : Environment,
      'mode' : Mode,
      'namespace' : Namespace,
      'version' : Version,
      'timestamp' :  new Date().toISOString(),
      ...(properties ?? {}), // spread original properties if defined
    };
    if (this.connectOptions?.merchantId) {
      enriched['merchant_id'] = this.connectOptions?.merchantId;
    }
    if (this.connectOptions?.partnerId) {
      enriched['partner_id'] = this.connectOptions?.partnerId;
    }
    if (this.connectOptions?.partnershipId) {
      enriched['partnership_id'] = this.connectOptions?.partnershipId;
    }
    if (this.connectOptions?.merchantName) {
      enriched['merchant_name'] = this.connectOptions?.merchantName;
    }
    if (this.userData?.user.id) {
      enriched['user_id'] = this.userData?.user.id;
    }
  /*
   * TODO: Fill out other properties below
   */
    return enriched;
  }

  static trackError(error: Error) {
    console.log('SDK Tracking error', error);
    const metadata = this.enrichedProperties();
    BugsnagService.track(error, metadata);
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

    // First update Tracker state (e.g., user info from event properties)
    Tracker.configureWithEvent(properties);

    // Then enrich properties
    const eventProperties = this.enrichedProperties(properties);

    // Track
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