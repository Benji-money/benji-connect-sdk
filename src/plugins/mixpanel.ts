import type { App } from 'vue'
import mixpanelService from '@/services/mixpanel'

export const mixpanelPlugin = {
  install: (app: App) => {
    app.config.globalProperties.$mixpanel = mixpanelService
    app.provide('mixpanel', mixpanelService)
  }
}

// Type declaration for global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $mixpanel: typeof mixpanelService
  }
}
