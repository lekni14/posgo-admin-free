import { create } from 'zustand';
import axios from 'axios';
// import { initializeAuthClient } from '@/services/auth-sdk.service';

export interface Config {
  API_URL: string;
  WS_URL: string;
  OAUTH_API_URL: string;
  APP_PREFIX_KEY: string;
  API_KEY: string;
  DEFAULT_USERNAME: string;
  DEFAULT_PASSWORD: string;
  [key: string]: any;
}

interface AppState {
  config: Config | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  init: () => Promise<void>;
}

const defaultConfig: Config = {
  API_URL: 'https://apiuat.posgo.app/api/v1',
  WS_URL: 'http://localhost:4001',
  OAUTH_API_URL: 'http://localhost:3001',
  APP_PREFIX_KEY: 'win',
  API_KEY: '',
  DEFAULT_USERNAME: '',
  DEFAULT_PASSWORD: '',
};

export const useAppStore = create<AppState>()((set, get) => ({
  config: null,
  isLoading: false,
  error: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return;

    try {
      set({ isLoading: true, error: null });

      const response = await fetch('/api/config');
      const config = response.ok ? await response.json() : {};

      const finalConfig = { ...defaultConfig, ...config };
      axios.defaults.baseURL = finalConfig.API_URL;

      // Initialize auth client if API key is available
      if (finalConfig.API_KEY) {
        try {
          // Prepare OAuth configuration if available
          const oauthConfig =
            finalConfig.OAUTH_CLIENT_ID && finalConfig.OAUTH_REDIRECT_URI
              ? {
                  clientId: finalConfig.OAUTH_CLIENT_ID,
                  redirectUri: finalConfig.OAUTH_REDIRECT_URI,
                  scope: 'openid profile email',
                }
              : undefined;

          // Use OAUTH_API_URL for Auth SDK (Main API - OAuth Provider)
          // NOT API_URL which is for Template API (business logic)
          // initializeAuthClient(finalConfig.API_KEY, finalConfig.OAUTH_API_URL, oauthConfig);

          // ❌ ลบการ set token ที่นี่ออก - ให้ useHydrationSync จัดการแทน
          // เพื่อป้องกัน hydration mismatch
        } catch (error) {
          console.warn('Failed to initialize auth client:', error);
        }
      }

      set({
        config: finalConfig,
        isLoading: false,
        initialized: true,
        error: null,
      });
    } catch (error) {
      const finalConfig = { ...defaultConfig };
      axios.defaults.baseURL = finalConfig.API_URL;

      set({
        config: finalConfig,
        isLoading: false,
        initialized: true,
        error: error instanceof Error ? error.message : 'Config load failed',
      });
    }
  },
}));

// Selective hooks
export const useAppConfig = () => useAppStore((state) => state.config);
export const useAppLoading = () => useAppStore((state) => state.isLoading);
export const useAppError = () => useAppStore((state) => state.error);
export const useAppInitialized = () => useAppStore((state) => state.initialized);

// Compatibility functions for existing code
export const API_URL = () => useAppStore.getState().config?.API_URL || defaultConfig.API_URL;
export const WS_URL = () => useAppStore.getState().config?.WS_URL || defaultConfig.WS_URL;
export const DEFAULT_USERNAME = () => useAppStore.getState().config?.DEFAULT_USERNAME || defaultConfig.DEFAULT_USERNAME;
export const DEFAULT_PASSWORD = () => useAppStore.getState().config?.DEFAULT_PASSWORD || defaultConfig.DEFAULT_PASSWORD;

export const waitForConfig = async (): Promise<Config> => {
  const state = useAppStore.getState();
  if (state.initialized && state.config) {
    return state.config;
  }

  // Wait for init
  await useAppStore.getState().init();
  return useAppStore.getState().config || defaultConfig;
};
