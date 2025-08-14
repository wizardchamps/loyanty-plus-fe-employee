import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, transactionApi, storeApi, settingsApi, analyticsApi, customerApi } from '@/lib/api'
import { User, Transaction, Store, LoyaltySettings, Analytics, CreateTransactionData, CustomerLookupParams, CustomerLookupResponse } from '@/lib/types'
import { toast } from 'sonner'

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userByCode: (code: string) => ['users', 'code', code] as const,
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transactions', id] as const,
  userTransactions: (userId: string) => ['users', userId, 'transactions'] as const,
  stores: ['stores'] as const,
  store: (id: string) => ['stores', id] as const,
  settings: ['settings'] as const,
  analytics: ['analytics'] as const,
  customerLookup: (storeId: string, searchTerm: string) => ['customerLookup', storeId, searchTerm] as const,
}

// User Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: userApi.getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  })
}

export const useUserByCode = (code: string) => {
  return useQuery({
    queryKey: queryKeys.userByCode(code),
    queryFn: () => userApi.getUserByCode(code),
    enabled: !!code,
    retry: false, // Don't retry if user not found
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      toast.success('User created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`)
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      userApi.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      queryClient.invalidateQueries({ queryKey: queryKeys.user(updatedUser.id) })
      toast.success('User updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (_, deletedUserId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedUserId) })
      toast.success('User deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`)
    },
  })
}

// Transaction Hooks
export const useTransactions = () => {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: transactionApi.getTransactions,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => transactionApi.getTransaction(id),
    enabled: !!id,
  })
}

export const useUserTransactions = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userTransactions(userId),
    queryFn: () => transactionApi.getUserTransactions(userId),
    enabled: !!userId,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionApi.createTransaction,
    onSuccess: (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.userTransactions(newTransaction.userId) 
      })
      toast.success('Transaction created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`)
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, transactionData }: { id: string; transactionData: Partial<Transaction> }) =>
      transactionApi.updateTransaction(id, transactionData),
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(updatedTransaction.id) })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.userTransactions(updatedTransaction.userId) 
      })
      toast.success('Transaction updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`)
    },
  })
}

export const useCancelTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionApi.cancelTransaction,
    onSuccess: (cancelledTransaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(cancelledTransaction.id) })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.userTransactions(cancelledTransaction.userId) 
      })
      toast.success('Transaction cancelled successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel transaction: ${error.message}`)
    },
  })
}

// Store Hooks
export const useStores = () => {
  return useQuery({
    queryKey: queryKeys.stores,
    queryFn: storeApi.getStores,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useStore = (id: string) => {
  return useQuery({
    queryKey: queryKeys.store(id),
    queryFn: () => storeApi.getStore(id),
    enabled: !!id,
  })
}

export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: storeApi.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores })
      toast.success('Store created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create store: ${error.message}`)
    },
  })
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, storeData }: { id: string; storeData: Partial<Store> }) =>
      storeApi.updateStore(id, storeData),
    onSuccess: (updatedStore) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores })
      queryClient.invalidateQueries({ queryKey: queryKeys.store(updatedStore.id) })
      toast.success('Store updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update store: ${error.message}`)
    },
  })
}

export const useDeleteStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: storeApi.deleteStore,
    onSuccess: (_, deletedStoreId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores })
      queryClient.removeQueries({ queryKey: queryKeys.store(deletedStoreId) })
      toast.success('Store deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete store: ${error.message}`)
    },
  })
}

// Settings Hooks
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.getSettings,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
      toast.success('Settings updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update settings: ${error.message}`)
    },
  })
}

// Analytics Hooks
export const useAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: analyticsApi.getAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Customer Lookup Hooks
export const useCustomerLookup = () => {
  return useMutation({
    mutationFn: customerApi.lookupCustomer,
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to lookup customer'
      toast.error(message)
    },
  })
}
