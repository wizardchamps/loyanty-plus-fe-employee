// Types for the loyalty system
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  loyaltyPoints: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  joinDate: string
  avatar?: string
  isActive: boolean
}

// Customer Lookup API Response Types
export interface CustomerLookupResponse {
  customer: {
    id: string
    email: string
    phoneNumber: string
    fullName: string
    userCode: string
    emailVerified: boolean
    phoneVerified: boolean
    isActive: boolean
  }
  membership: {
    userStoreCode: string
    pointsBalance: number
    totalPointsEarned: number
    totalPointsRedeemed: number
    memberSince: string
    isActive: boolean
    tier: string
    lastTransaction: string | null
  }
  store: {
    id: string
    name: string
    pointsPerAmount: number
  }
  recentTransactions: Array<{
    id: string
    amount: string
    pointsEarned: number
    pointsRedeemed: number
    type: 'PURCHASE' | 'REDEEM' | 'USE'
    description: string
    createdAt: string
  }>
}

export interface CustomerLookupParams {
  storeId: string
  userStoreCode?: string
  phoneNumber?: string
  email?: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'earn' | 'redeem'
  points: number
  amount: number
  description: string
  date: string
  status: 'pending' | 'completed' | 'cancelled'
  customerCode: string
}

export interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  manager: string
  isActive: boolean
  totalCustomers: number
  totalTransactions: number
  totalPoints: number
}

export interface LoyaltySettings {
  pointsPerDollar: number
  minPointsToRedeem: number
  tierBronzeMin: number
  tierSilverMin: number
  tierGoldMin: number
  tierPlatinumMin: number
  pointExpirationMonths: number
  welcomeBonus: number
  referralBonus: number
}

export interface Analytics {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalPointsEarned: number
  totalPointsRedeemed: number
  averagePointsPerUser: number
  topSpenders: User[]
  monthlyGrowth: number
}

export interface CreateTransactionData {
  customerCode: string
  type: 'earn' | 'redeem'
  amount: number
  description: string
}
