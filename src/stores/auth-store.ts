import { create } from 'zustand';
// import type { User } from 'win-portal-auth-sdk';
import { STORAGE_KEYS, OAUTH_TOKEN_KEYS } from '@/lib/constants/storage';
import { User } from '@/services/user.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean; // ✅ เพิ่ม flag บอกว่า sync จาก localStorage เสร็จแล้ว

  // Actions
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // OAuth token only
  return localStorage.getItem(STORAGE_KEYS.OAUTH_ACCESS_TOKEN);
};

const setStoredToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;

  if (token) {
    // Store OAuth token
    localStorage.setItem(STORAGE_KEYS.OAUTH_ACCESS_TOKEN, token);
  } else {
    // Clean up all OAuth-related data
    OAUTH_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  }
};

export const useAuthStore = create<AuthState>()((set, get) => {
  // Listen for unauthorized events from API client
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      console.log('🔐 Unauthorized event received - clearing auth state');
      get().logout();
    });
  }

  // ✅ ป้องกัน hydration mismatch - เริ่มต้นด้วย null เสมอ
  // จะ sync token จาก localStorage ใน useEffect ของ component
  return {
    user: null,
    token: null, // ✅ เริ่มต้นด้วย null เสมอ (จะ sync จาก localStorage ภายหลัง)
    isAuthenticated: false,
    isLoading: false,
    hydrated: false, // ✅ เริ่มต้นยังไม่ได้ sync

    setAuth: (user, token) => {
      setStoredToken(token); // เก็บ token ใน localStorage
      // ❌ ไม่เก็บ user ใน localStorage - ให้ดึงจาก API ทุกครั้ง
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        hydrated: true,
      });
    },

    setToken: (token) => {
      setStoredToken(token); // เก็บ token ใน localStorage
      set({
        token,
        isAuthenticated: !!token,
        hydrated: true, // ✅ sync เสร็จแล้ว
      });
    },

    setUser: (user) => {
      // ❌ ไม่เก็บ user ใน localStorage - ให้ดึงจาก API ทุกครั้ง
      set({
        user,
        isAuthenticated: !!get().token && !!user,
      });
    },

    logout: () => {
      setStoredToken(null); // ลบ token จาก localStorage
      // ❌ ไม่ต้องลบ user เพราะไม่ได้เก็บไว้
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        hydrated: true, // ✅ ยังคง hydrated
      });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    updateUser: (updatedUser) => {
      const currentUser = get().user;
      if (currentUser) {
        const newUser = { ...currentUser, ...updatedUser };
        // ❌ ไม่บันทึก user ลง localStorage - state เท่านั้น
        set({
          user: newUser,
        });
      }
    },

    setHydrated: (hydrated) => {
      set({ hydrated });
    },
  };
});
