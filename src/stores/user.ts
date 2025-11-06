import { defineStore } from 'pinia'
import { 
  BenjiConnectAuthSuccessEventData, 
  BenjiConnectUserData 
} from '../types/types';

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