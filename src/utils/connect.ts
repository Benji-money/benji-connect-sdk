import { 
  BenjiConnectData, 
  BenjiConnectTokenData 
} from "../types/connect";

export const mapTokenDataToConnectData = (data: BenjiConnectTokenData): BenjiConnectData => ({
  displayName: data.display_name,
  merchantId: data.merchant_id,
  mode: data.mode,
  partnerId: data.partner_id,
  partnershipId: data.partnership_id,
  userExternalId: data.user_external_id
});