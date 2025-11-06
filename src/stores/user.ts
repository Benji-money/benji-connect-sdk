import { defineStore } from 'pinia'
import { BenjiConnectUserData } from '../types/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as BenjiConnectUserData | null
  }),
});