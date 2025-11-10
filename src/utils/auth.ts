import { BenjiConnectAuthToken } from "../types/auth";
import { BenjiConnectEventToken } from "../types/event";

export const mapEventToConnectToken = (data?: BenjiConnectEventToken): BenjiConnectAuthToken => ({
  accessToken: data?.access_token ?? '',
  refreshToken: data?.refresh_token ?? '',
  expiresAt: data?.expires_at ?? ''
});