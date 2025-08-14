import { User, Transaction, Store, LoyaltySettings, Analytics, CreateTransactionData, CustomerLookupResponse, CustomerLookupParams } from './types'
import { apiClient } from './axios-config'
import { AxiosResponse } from 'axios'

// Simulate API calls with mock data for development
const MOCK_MODE = process.env.NODE_ENV === 'development'

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generic API client wrapper for mock mode
async function makeApiCall<T>(endpoint: string, options?: { method?: string; data?: any }): Promise<T> {
  if (MOCK_MODE) {
    await delay(500) // Simulate network delay
    return getMockData(endpoint, options) as T
  }

  const { method = 'GET', data } = options || {}
  let response: AxiosResponse<T>

  switch (method.toLowerCase()) {
    case 'post':
      response = await apiClient.post<T>(endpoint, data)
      break
    case 'put':
      response = await apiClient.put<T>(endpoint, data)
      break
    case 'patch':
      response = await apiClient.patch<T>(endpoint, data)
      break
    case 'delete':
      response = await apiClient.delete<T>(endpoint)
      break
    default:
      response = await apiClient.get<T>(endpoint)
  }

  return response.data
}

// Mock data for development
function getMockData(endpoint: string, options?: { method?: string; data?: any }): any {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      loyaltyPoints: 1250,
      tier: 'Gold',
      joinDate: '2024-01-15',
      avatar: '/placeholder-user.jpg',
      isActive: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0124',
      loyaltyPoints: 850,
      tier: 'Silver',
      joinDate: '2024-02-20',
      avatar: '/placeholder-user.jpg',
      isActive: true,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1-555-0125',
      loyaltyPoints: 2100,
      tier: 'Platinum',
      joinDate: '2024-01-05',
      avatar: '/placeholder-user.jpg',
      isActive: true,
    },
  ]

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: '1',
      type: 'earn',
      points: 50,
      amount: 25.00,
      description: 'Purchase at Main Store',
      date: '2024-08-14',
      status: 'completed',
      customerCode: 'CX001',
    },
    {
      id: '2',
      userId: '2',
      type: 'redeem',
      points: -100,
      amount: 10.00,
      description: 'Redeemed for coffee',
      date: '2024-08-13',
      status: 'completed',
      customerCode: 'CX002',
    },
    {
      id: '3',
      userId: '3',
      type: 'earn',
      points: 75,
      amount: 37.50,
      description: 'Purchase at Downtown Store',
      date: '2024-08-12',
      status: 'pending',
      customerCode: 'CX003',
    },
  ]

  const mockStores: Store[] = [
    {
      id: '1',
      name: 'Main Store',
      address: '123 Main St',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
      phone: '+1-555-0100',
      manager: 'Alice Johnson',
      isActive: true,
      totalCustomers: 150,
      totalTransactions: 450,
      totalPoints: 12500,
    },
    {
      id: '2',
      name: 'Mall Location',
      address: '456 Mall Blvd',
      city: 'Suburbs',
      state: 'CA',
      zipCode: '90211',
      phone: '+1-555-0101',
      manager: 'Bob Wilson',
      isActive: true,
      totalCustomers: 200,
      totalTransactions: 600,
      totalPoints: 18000,
    },
  ]

  const mockSettings: LoyaltySettings = {
    pointsPerDollar: 2,
    minPointsToRedeem: 100,
    tierBronzeMin: 0,
    tierSilverMin: 500,
    tierGoldMin: 1000,
    tierPlatinumMin: 2000,
    pointExpirationMonths: 12,
    welcomeBonus: 100,
    referralBonus: 50,
  }

  const mockAnalytics: Analytics = {
    totalUsers: 350,
    activeUsers: 320,
    totalTransactions: 1050,
    totalPointsEarned: 30500,
    totalPointsRedeemed: 8200,
    averagePointsPerUser: 87,
    topSpenders: mockUsers.slice(0, 3),
    monthlyGrowth: 12.5,
  }

  // Route the mock data based on endpoint
  if (endpoint === '/users') return mockUsers
  if (endpoint.startsWith('/users/')) {
    const userId = endpoint.split('/')[2]
    return mockUsers.find(u => u.id === userId)
  }
  if (endpoint === '/transactions') return mockTransactions
  if (endpoint === '/stores') return mockStores
  if (endpoint === '/settings') return mockSettings
  if (endpoint === '/analytics') return mockAnalytics
  
  // Mock customer lookup response
  if (endpoint.includes('/customers/lookup')) {
    // Extract store ID from endpoint
    const storeIdMatch = endpoint.match(/\/stores\/([^/]+)\/customers\/lookup/)
    const storeId = storeIdMatch ? storeIdMatch[1] : 'mock-store-1'
    
    return {
      customer: {
        id: 'cust-123',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        fullName: 'John Doe',
        userCode: 'UC123456',
        emailVerified: true,
        phoneVerified: true,
        isActive: true
      },
      membership: {
        userStoreCode: 'ST001-USR123',
        pointsBalance: 150,
        totalPointsEarned: 200,
        totalPointsRedeemed: 50,
        memberSince: '2024-01-15T10:30:00Z',
        isActive: true,
        tier: 'Standard',
        lastTransaction: '2024-08-13T14:25:00Z'
      },
      store: {
        id: storeId,
        name: 'Coffee Corner',
        pointsPerAmount: 10
      },
      recentTransactions: [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          amount: '25.50',
          pointsEarned: 26,
          pointsRedeemed: 0,
          type: 'PURCHASE' as const,
          description: 'Coffee and pastry purchase',
          createdAt: '2024-08-13T14:25:00Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          amount: '0.00',
          pointsEarned: 0,
          pointsRedeemed: 50,
          type: 'REDEEM' as const,
          description: 'Free coffee redemption',
          createdAt: '2024-08-10T11:15:00Z'
        }
      ]
    }
  }
  
  return []
}

// API Functions
export const userApi = {
  getUsers: (): Promise<User[]> => makeApiCall<User[]>('/users'),
  getUser: (id: string): Promise<User> => makeApiCall<User>(`/users/${id}`),
  getUserByCode: (code: string): Promise<User> => makeApiCall<User>(`/users/code/${code}`),
  createUser: (userData: Omit<User, 'id'>): Promise<User> => 
    makeApiCall<User>('/users', {
      method: 'POST',
      data: userData,
    }),
  updateUser: (id: string, userData: Partial<User>): Promise<User> =>
    makeApiCall<User>(`/users/${id}`, {
      method: 'PUT',
      data: userData,
    }),
  deleteUser: (id: string): Promise<void> =>
    makeApiCall<void>(`/users/${id}`, { method: 'DELETE' }),
}

export const transactionApi = {
  getTransactions: (): Promise<Transaction[]> => makeApiCall<Transaction[]>('/transactions'),
  getTransaction: (id: string): Promise<Transaction> => makeApiCall<Transaction>(`/transactions/${id}`),
  getUserTransactions: (userId: string): Promise<Transaction[]> => 
    makeApiCall<Transaction[]>(`/users/${userId}/transactions`),
  createTransaction: (transactionData: CreateTransactionData): Promise<Transaction> =>
    makeApiCall<Transaction>('/transactions', {
      method: 'POST',
      data: transactionData,
    }),
  updateTransaction: (id: string, transactionData: Partial<Transaction>): Promise<Transaction> =>
    makeApiCall<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      data: transactionData,
    }),
  cancelTransaction: (id: string): Promise<Transaction> =>
    makeApiCall<Transaction>(`/transactions/${id}/cancel`, { method: 'POST' }),
}

export const storeApi = {
  getStores: (): Promise<Store[]> => makeApiCall<Store[]>('/stores'),
  getStore: (id: string): Promise<Store> => makeApiCall<Store>(`/stores/${id}`),
  createStore: (storeData: Omit<Store, 'id'>): Promise<Store> =>
    makeApiCall<Store>('/stores', {
      method: 'POST',
      data: storeData,
    }),
  updateStore: (id: string, storeData: Partial<Store>): Promise<Store> =>
    makeApiCall<Store>(`/stores/${id}`, {
      method: 'PUT',
      data: storeData,
    }),
  deleteStore: (id: string): Promise<void> =>
    makeApiCall<void>(`/stores/${id}`, { method: 'DELETE' }),
}

export const settingsApi = {
  getSettings: (): Promise<LoyaltySettings> => makeApiCall<LoyaltySettings>('/settings'),
  updateSettings: (settings: Partial<LoyaltySettings>): Promise<LoyaltySettings> =>
    makeApiCall<LoyaltySettings>('/settings', {
      method: 'PUT',
      data: settings,
    }),
}

export const analyticsApi = {
  getAnalytics: (): Promise<Analytics> => makeApiCall<Analytics>('/analytics'),
}

export const customerApi = {
  lookupCustomer: (params: CustomerLookupParams): Promise<CustomerLookupResponse> => {
    const { storeId, userStoreCode, phoneNumber, email } = params
    
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (userStoreCode) queryParams.append('userStoreCode', userStoreCode)
    if (phoneNumber) queryParams.append('phoneNumber', phoneNumber)
    if (email) queryParams.append('email', email)
    
    const queryString = queryParams.toString()
    const endpoint = `/stores/${storeId}/customers/lookup${queryString ? `?${queryString}` : ''}`
    
    return makeApiCall<CustomerLookupResponse>(endpoint)
  },
}
