import Bugsnag from '@bugsnag/js'
import BugsnagPerformance from '@bugsnag/browser-performance'
import { BenjiConnectEnvironment } from '../types/config';
import { Version } from '../config';

export class BugsnagService {
  static initialized = false

  static init(
    environment: BenjiConnectEnvironment, 
    apiKey: string,

  ) {
    if (this.initialized) return;

    Bugsnag.start({
      apiKey: apiKey,
      appVersion: Version,
      releaseStage: environment,
      enabledReleaseStages: ['production', 'staging', 'development'],
      onError: function (event) {
        console.log('Bugsnag in onError callback', event);
      }
    })

    BugsnagPerformance.start({
      apiKey: apiKey,
      appVersion: Version,
      releaseStage: environment,
      enabledReleaseStages: ['production', 'staging', 'development'],
      onSpanEnd: [(span) => {
        console.log('Bugsnag in onSpanEnd callback', span);
        return true
      }]
    })

    this.initialized = true;
  }

  static reset() {
    if (!this.initialized) return

    try {
      // TODO: Reset Bugsnag
      this.initialized = false;
    } catch (error) {
      console.error('Error resetting Bugsnag:', error)
    }
  }

  static addUserData = (event: any, metadata?: Record<string, any>) => {
    if (!metadata) return;
    const userId = metadata['user_id'];
    if(userId) {
      event.setUser(String(userId), undefined, undefined);
    }
  }

  static track(error: Error | unknown, metadata?: Record<string, any>) {
    console.log('Bugsnag track(error');
    if (error instanceof Error) {
      Bugsnag.notify(error, (event) => {
        this.addUserData(event, metadata);
        if (metadata) {
          event.addMetadata('custom', metadata)
        }
      })
    } else {
      Bugsnag.notify(new Error(String(error)), (event) => {
        this.addUserData(event, metadata);
        if (metadata) {
          event.addMetadata('custom', metadata)
        }
      })
    }
  }

}

