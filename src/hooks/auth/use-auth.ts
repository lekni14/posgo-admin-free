
import { createSession } from "@/app/lib/session";
import {
  authService,
  LoginCredentials,
  LoginResponse,
} from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

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

export const useLogin = (
  options?: UseMutationOptions<LoginResponse, Error, LoginCredentials>
) => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Handle success: store the token/user data, redirect, etc.
      // setAuthToken(data.token); // Example: store the token
      console.log("Login successful:", data);
      // Example: redirect to dashboard
      await createSession(data);
      queryClient.setQueryData(['user'], data);
      window.location.href = "/dashboard"
      // redirect('/dashboard')

    },
    onError: (error) => {
      // Handle error: show an error message
      console.error("Login failed:", error.message);
    },
    ...options, // Allows passing extra options from the component
  });
};
