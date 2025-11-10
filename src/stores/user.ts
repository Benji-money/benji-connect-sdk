/*import { defineStore } from 'pinia'
import { BenjiConnectAuthSuccessData } from '../types/event';
import { BenjiConnectUserData } from '../types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as BenjiConnectUserData | null
  }),
  actions: {
    refreshWithAuthSuccessData(data: BenjiConnectAuthSuccessData) {
      this.userData = data.userData;
    },
  }
});

*/