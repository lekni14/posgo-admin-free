/**
 * OAuth Authentication Utilities
 *
 * Helper functions for OAuth 2.0 / OIDC authentication flows
 */

import { getAuthClient } from '@/services/auth-sdk.service';
import { STORAGE_KEYS } from './constants/storage';

/**
 * Generate PKCE parameters for OAuth 2.0 authorization code flow
 */
export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  // Generate random code verifier (128 characters)
  const array = new Uint8Array(96);
  crypto.getRandomValues(array);
  const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Generate code challenge (SHA256 hash of code verifier)
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    codeVerifier,
    codeChallenge,
  };
}

/**
 * Generate random state parameter for OAuth 2.0
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Start OAuth login flow
 * Redirects user to Win Portal authorization page
 *
 * @param returnUrl - URL to return to after successful authentication
 */
export async function startOAuthLogin(returnUrl: string = '/'): Promise<void> {
  try {
    const authClient = getAuthClient();

    if (!authClient.oauth) {
      throw new Error('OAuth not initialized. Check environment configuration.');
    }

    // Get app config to get OAuth authorization server URL
    const response = await fetch('/api/config');
    const config = await response.json();

    if (!config.OAUTH_AUTHORIZATION_SERVER) {
      throw new Error('OAuth authorization server URL not configured.');
    }

    // Generate PKCE parameters
    console.log('[OAuth] Generating PKCE parameters...');
    const pkce = await generatePKCE();
    const state = generateState();

    // Store for callback verification
    sessionStorage.setItem(STORAGE_KEYS.OAUTH_CODE_VERIFIER, pkce.codeVerifier);
    sessionStorage.setItem(STORAGE_KEYS.OAUTH_STATE, state);
    sessionStorage.setItem(STORAGE_KEYS.OAUTH_RETURN_URL, returnUrl);

    // Build authorization URL manually using the correct authorization server
    const authParams = new URLSearchParams({
      response_type: 'code',
      client_id: config.OAUTH_CLIENT_ID,
      redirect_uri: config.OAUTH_REDIRECT_URI,
      scope: 'openid profile email',
      state: state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${config.OAUTH_AUTHORIZATION_SERVER}/oauth/authorize?${authParams.toString()}`;

    console.log('[OAuth] Redirecting to:', authUrl);

    // Redirect to authorization server
    window.location.href = authUrl;
  } catch (error) {
    console.error('[OAuth] Failed to start login flow:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated via OAuth
 */
export function isOAuthAuthenticated(): boolean {
  const accessToken = localStorage.getItem('oauth_access_token');
  const expiresAt = localStorage.getItem('oauth_expires_at');

  if (!accessToken || !expiresAt) {
    return false;
  }

  // Check if token is expired
  const now = Date.now();
  const expiry = parseInt(expiresAt, 10);

  return now < expiry;
}

/**
 * Get OAuth user info from storage
 */
export function getOAuthUser(): any | null {
  const userJson = localStorage.getItem('oauth_user');
  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Get OAuth access token
 */
export function getOAuthAccessToken(): string | null {
  return localStorage.getItem('oauth_access_token');
}

/**
 * Refresh OAuth access token
 */
export async function refreshOAuthToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('oauth_refresh_token');
    if (!refreshToken) {
      console.warn('[OAuth] No refresh token available');
      return false;
    }

    const authClient = getAuthClient();
    if (!authClient.oauth) {
      console.warn('[OAuth] OAuth not initialized');
      return false;
    }

    console.log('[OAuth] Refreshing access token...');
    const tokens = await authClient.oauth.refreshAccessToken(refreshToken);

    // Update stored tokens
    localStorage.setItem('oauth_access_token', tokens.access_token);
    if (tokens.refresh_token) {
      // Some servers rotate refresh tokens
      localStorage.setItem('oauth_refresh_token', tokens.refresh_token);
    }

    // Update expiration time
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem('oauth_expires_at', expiresAt.toString());

    // Update auth client token
    authClient.setToken(tokens.access_token);

    console.log('[OAuth] Token refreshed successfully');
    return true;
  } catch (error) {
    console.error('[OAuth] Token refresh failed:', error);
    return false;
  }
}

/**
 * Logout from OAuth session
 * Revokes tokens and clears storage
 */
export async function logoutOAuth(): Promise<void> {
  try {
    const accessToken = getOAuthAccessToken();
    const authClient = getAuthClient();

    // Revoke access token if available
    if (accessToken && authClient.oauth) {
      try {
        await authClient.oauth.revokeToken(accessToken, 'access_token');
        console.log('[OAuth] Access token revoked');
      } catch (error) {
        console.warn('[OAuth] Failed to revoke access token:', error);
      }
    }

    // Clear all OAuth data
    localStorage.removeItem('oauth_access_token');
    localStorage.removeItem('oauth_refresh_token');
    localStorage.removeItem('oauth_id_token');
    localStorage.removeItem('oauth_expires_at');
    localStorage.removeItem('oauth_user');

    // Clear auth client token
    authClient.clearToken();

    console.log('[OAuth] Logged out successfully');
  } catch (error) {
    console.error('[OAuth] Logout error:', error);
    // Clear storage anyway
    localStorage.removeItem('oauth_access_token');
    localStorage.removeItem('oauth_refresh_token');
    localStorage.removeItem('oauth_id_token');
    localStorage.removeItem('oauth_expires_at');
    localStorage.removeItem('oauth_user');
  }
}

/**
 * Setup automatic token refresh before expiration
 */
export function setupTokenRefresh(): () => void {
  const refreshBeforeExpiry = 60 * 1000; // Refresh 1 minute before expiry

  const checkAndRefresh = async () => {
    const expiresAt = localStorage.getItem('oauth_expires_at');
    if (!expiresAt) {
      return;
    }

    const expiry = parseInt(expiresAt, 10);
    const now = Date.now();
    const timeUntilExpiry = expiry - now;

    // If token expires in less than 1 minute, refresh it
    if (timeUntilExpiry < refreshBeforeExpiry && timeUntilExpiry > 0) {
      console.log('[OAuth] Token expiring soon, refreshing...');
      await refreshOAuthToken();
    }
  };

  // Check every 30 seconds
  const intervalId = setInterval(checkAndRefresh, 30 * 1000);

  // Initial check
  checkAndRefresh();

  // Return cleanup function
  return () => clearInterval(intervalId);
}
