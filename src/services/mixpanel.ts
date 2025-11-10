import mixpanel from 'mixpanel-browser'
import { BenjiConnectEnvironment } from '../types/config'
import { BenjiConnectUserData } from '../types/user';

export class MixpanelService {
  static initialized = false;
  private static identifiedUserId: string | number | null = null;
  private static hasAliased = false;

  static init(
    environment: BenjiConnectEnvironment, 
    token: string, 
    accessURL: string
  ) {

    if (this.initialized) return;

    const debug = environment === 'development';
    const host = new URL(accessURL).origin;

    try {
      mixpanel.init(token, {
        debug: debug,
        track_pageview: true,
        persistence: 'localStorage',
        api_host: host,
        loaded: () => {
          console.log('SDK Mixpanel initialized successfully')
        }
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
      // Don't set initialized = true, so all subsequent calls will be skipped
    }
  }

  // Configure with BenjiConnectUserData if needed
  // Example: identify user with Mixpanel
  static configureWithUserData(data: BenjiConnectUserData) {
    if (data.user.id && this.identifiedUserId !== data.user.id) {
      console.log('mixpanel currentUser', data.user.id)
      this.identify(data.user.id)
    }
  }

  // Configure with event properties if needed
  // Example: identify user with Mixpanel
  static configureWithProperties(properties?: Record<string, any>) {
    if (properties) {
      const userId: string = properties['user_id'];
      if(userId && this.identifiedUserId != userId) {
        this.identify(userId);
      }
    }
  }

  static track(eventName: string, properties?: Record<string, any>) {
    if (!this.initialized) {
      console.warn('SDK Mixpanel not initialized');
      return;
    }

    console.log('SDK Mixpanel track', eventName, properties);

    try {
      this.configureWithProperties(properties);
      mixpanel.track(eventName, properties);
    } catch (error) {
      console.error('Error tracking Mixpanel event:', error);
      // Event tracking failure should never break app flow
    }
  }

  static identify(userId: string | number) {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      const userIdStr = String(userId);

      // If this is the first identification in this session, create an alias
      // This links all previous anonymous events to this user
      if (!this.hasAliased) {
        mixpanel.alias(userIdStr);
        this.hasAliased = true;
        console.log('Mixpanel user aliased (first identification):', userIdStr);
      } else {
        // For subsequent identifications, just identify
        mixpanel.identify(userIdStr);
        console.log('Mixpanel user identified:', userIdStr);
      }

      this.identifiedUserId = userId;
    } catch (error) {
      console.error('Error identifying user in Mixpanel:', error);
    }
  }

  static setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return
    }

    try {
      mixpanel.people.set(properties)
    } catch (error) {
      console.error('Error setting user properties in Mixpanel:', error);
    }
  }

  static reset() {
    if (!this.initialized) return;

    try {
      mixpanel.reset()
      this.identifiedUserId = null;
      this.hasAliased = false;
    } catch (error) {
      console.error('Error resetting Mixpanel:', error);
    }
  }
}
