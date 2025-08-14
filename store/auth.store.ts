import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User) => void
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  login: (user: User, token: string, refreshToken?: string) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User) => 
        set((state) => ({ 
          user, 
          isAuthenticated: !!user && !!state.token 
        })),

      setToken: (token: string) => 
        set((state) => ({ 
          token, 
          isAuthenticated: !!state.user && !!token 
        })),

      setRefreshToken: (refreshToken: string) => 
        set(() => ({ 
          refreshToken 
        })),

      login: (user: User, token: string, refreshToken?: string) => 
        set(() => ({ 
          user, 
          token, 
          refreshToken: refreshToken || null,
          isAuthenticated: true 
        })),

      logout: () => 
        set(() => ({ 
          user: null, 
          token: null, 
          refreshToken: null,
          isAuthenticated: false 
        })),

      clearAuth: () => 
        set(() => ({ 
          user: null, 
          token: null, 
          refreshToken: null,
          isAuthenticated: false 
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated 
      }),
      // Add onRehydrateStorage to fix authentication state after loading from localStorage
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (error) {
            console.log('An error happened during hydration', error);
            return;
          }
          
          // After rehydrating from localStorage, recalculate isAuthenticated
          if (hydratedState) {
            const hasValidAuth = !!(hydratedState.user && hydratedState.token);
            if (hydratedState.isAuthenticated !== hasValidAuth) {
              hydratedState.isAuthenticated = hasValidAuth;
            }
          }
        };
      },
    }
  )
)
