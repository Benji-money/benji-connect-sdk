import { BenjiConnectAuthToken } from "../types/auth";
import { BenjiConnectOptions } from "../types/config";
import { BenjiConnectEventToken } from "../types/event";

export function buildAuthRequestBody(params: BenjiConnectOptions): Record<string, unknown> {
  return {
    ...(params.userExternalId
      ? { user_external_id: params.userExternalId }
      : {}),
    mode: params.mode || 1,
    ...(!params.mode || params.mode !== 2
      ? {
          partner_id: params.partnerId,
          merchant_id: params.merchantId,
        }
      : {}),
    display_name: params.merchantName,
    ...(params.partnershipId ? { partnership_id: params.partnershipId } : {}),
  };
}

export const mapEventToConnectToken = (data?: BenjiConnectEventToken): BenjiConnectAuthToken => ({
  accessToken: data?.access_token ?? '',
  refreshToken: data?.refresh_token ?? '',
  expiresAt: data?.expires_at ?? ''
});