import { BenjiConnectAuthToken } from "../types/auth";
import { BenjiConnectEventToken } from "../types/event";

export const extractAccessToken = (token?: BenjiConnectEventToken | string): string =>
  typeof token === 'string' ? token : (token?.access_token ?? '');

export const mapEventToConnectToken = (data?: BenjiConnectEventToken): BenjiConnectAuthToken => ({
  access_token: data?.access_token ?? '',
  refresh_token: data?.refresh_token ?? '',
  expires_at: data?.expires_at ?? ''
});