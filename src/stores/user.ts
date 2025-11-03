import { defineStore } from 'pinia'
import { BenjiConnectUserData } from '../types/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as BenjiConnectUserData | null
  }),
});