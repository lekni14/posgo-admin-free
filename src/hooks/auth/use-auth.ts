import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    login: setAuth, // alias setAuth as login
    logout,
  };
}
