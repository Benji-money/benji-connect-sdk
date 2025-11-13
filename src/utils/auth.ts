import { 
  BenjiConnectAuth, 
  BenjiConnectAuthToken 
} from "../types/auth";
import { BenjiConnectTokenData } from "../types/connect";
import { BenjiConnectEventToken } from "../types/event";

export const extractAccessToken = (token?: BenjiConnectEventToken | string): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');

export const mapEventToConnectToken = (data?: BenjiConnectEventToken): BenjiConnectAuthToken => ({
  access_token: data?.access_token ?? '',
  refresh_token: data?.refresh_token ?? '',
  expires_at: data?.expires_at ?? ''
});

export const mapTokenDataToAuth = (data: BenjiConnectTokenData): BenjiConnectAuth => ({
  accessToken: data.access_token,
  configToken: data.config_token
});