export type BenjiConnectTokenData = {
  access_token: string;
  config_token: string;
  display_name: string;
  merchant_id: number;
  mode: number;
  partner_id: number;
  partnership_id: number;
  user_external_id: string;
}

export interface BenjiConnectData {
  displayName?: string;
  merchantId?: number;
  mode?: number; // 1 | 2;
  partnerId?: number;
  partnershipId?: number;
  userExternalId?: string;
  userId?: number;
}