import BugsnagService from './bugsnag';
import MixpanelService from './mixpanel';

export interface Tracker {
  init(): void;
  trackError(eventName: string, properties?: Record<string, any>): void;
  trackEvent(eventName: string, properties?: Record<string, any>): void;
}

function root(): any {
  return (typeof window !== 'undefined' ? window : globalThis) as any;
}


let bugsnagService: typeof BugsnagService | undefined;
let mixpanelService: typeof MixpanelService | undefined;

export const tracker: Tracker = {



  init() {
    
  },

  trackError(eventName: string, properties?: Record<string, any>) {
  
  },

  trackEvent(eventName: string, properties?: Record<string, any>) {

  }

}