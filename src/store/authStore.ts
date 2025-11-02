import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthService } from '@/services/api/auth'
import { LoginCredentials, RegisterData } from '@/lib/types'
import type { User } from '@/lib/types'

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          const res = await AuthService.login(credentials);
          const { accessToken, refreshToken, user } = res.data;
          
          set({
            isAuthenticated: true,
            user: user,
            accessToken,
            refreshToken,
            error: null,
          });
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({ error: errorMessage });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        try {
          const res = await AuthService.register(data);
          const { accessToken, refreshToken, user } = res.data;
          
          set({
            isAuthenticated: true,
            user: user,
            accessToken,
            refreshToken,
            error: null,
          });
          
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al registrarse';
          set({ error: errorMessage });
          return false;
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
)