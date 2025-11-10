/*
export interface BenjiConnectUserData {
  user: {
    id: number
    firstName: string
  }
  status: BenjiConnectUserStatusData
  extraData?: {
    totalRewardsEarned?: number
    totalRewardsRedeemed?: number
    createdDate?: string
  }
}

export interface BenjiConnectUserStatusData {
  statusId: string
  numOfRewards: number
  rewardStatus: string
  partnerStatusTierId?: number
}
*/

export interface BenjiConnectUserData {
  user: {
    id: number
    first_name: string
    last_name: string
  }
  status: BenjiConnectUserStatusData
  extra_data?: {
    total_rewards_earned?: number
    total_rewards_redeemed?: number
    created_date?: string
  }
}

export interface BenjiConnectUserStatusData {
  status_id: string
  num_of_rewards: number
  reward_status: string
  partner_status_tier_id?: number
}