import Bugsnag from '@bugsnag/js'
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

const notifyError = (error: Error | unknown, metadata?: Record<string, any>) => {
  if (error instanceof Error) {
    Bugsnag.notify(error, (event) => {
      addUserData(event)
      if (metadata) {
        event.addMetadata('custom', metadata)
      }
    })
  } else {
    Bugsnag.notify(new Error(String(error)), (event) => {
      addUserData(event)
      if (metadata) {
        event.addMetadata('custom', metadata)
      }
    })
  }
}

export default {
  notifyError,
}
