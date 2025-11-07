import { defineStore } from 'pinia'
import { BenjiConnectAuthSuccessEventData } from '../types/event';
import { BenjiConnectUserData } from '../types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as BenjiConnectUserData | null
  }),
  actions: {
    refreshWithAuthSuccessData(data: BenjiConnectAuthSuccessEventData) {
      this.userData = data.userData;
    },
  }
});