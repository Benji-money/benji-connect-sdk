import Bugsnag from '@bugsnag/js'
import { BenjiConnectEnvironment } from '../types/types';

export class BugsnagService {
  static initialized = false

  static init(
    environment: BenjiConnectEnvironment, 
    apiKey: string,

  ) {
    if (this.initialized) return;

    Bugsnag.start({
      apiKey: apiKey,
      releaseStage: environment,
      enabledReleaseStages: ['production', 'staging', 'development'],
      onError: function (event) {
        /*try {
          const userStore = useUserStore()
          const currentUser = userStore.user

          if (currentUser) {
            event.setUser(String(currentUser.id), undefined, undefined)
          }
        } catch (error) {
          console.error('Error setting Bugsnag user data:', error)
        }*/
      }
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


/*
import { useUserStore } from '@/stores/user'

const addUserData = (event: any) => {
  try {
    const userStore = useUserStore()
    const currentUser = userStore.user

    if (currentUser) {
      event.setUser(
        String(currentUser.id),
        undefined,
        undefined
      )
    }
  } catch (error) {
    console.error('Error setting Bugsnag user data:', error)
  }
}
*/

  static track(error: Error | unknown, metadata?: Record<string, any>) {
    if (error instanceof Error) {
      Bugsnag.notify(error, (event) => {
        //addUserData(event)
        if (metadata) {
          event.addMetadata('custom', metadata)
        }
      })
    } else {
      Bugsnag.notify(new Error(String(error)), (event) => {
        //addUserData(event)
        if (metadata) {
          event.addMetadata('custom', metadata)
        }
      })
    }
  }

}

