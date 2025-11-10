import { BenjiConnectEventUserData } from "../types/event";
import { BenjiConnectUserData } from "../types/user";

export function isConnectUserData (
  input: BenjiConnectUserData | Record<string, any>
): boolean {
  if (!input) return false;
  const data = mapEventToConnectUserData(input);
  if (data.user.id != 0) return true;
  return false;
}

export const mapEventToConnectUserData = (
  data?: BenjiConnectEventUserData | Record<string, any>
): BenjiConnectUserData => ({
  user: {
    id: data?.user?.id ?? 0,
    first_name: data?.user?.first_name ?? '',
    last_name: data?.user?.last_name ?? ''
  },
  status: {
    status_id: data?.status?.status_id ?? '',
    num_of_rewards: data?.status?.num_of_rewards ?? 0,
    reward_status: data?.status?.reward_status ?? '',
    partner_status_tier_id: data?.status?.partner_status_tier_id
  },
  extra_data: {
    total_rewards_earned: data?.extra_data?.total_rewards_earned,
    total_rewards_redeemed: data?.extra_data?.total_rewards_redeemed,
    created_date: data?.extra_data?.created_date
  }
});
