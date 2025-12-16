/**
 * Local Storage Keys
 * Centralized storage key constants for OAuth and app data
 */

export const STORAGE_KEYS = {
  // OAuth Tokens
  OAUTH_ACCESS_TOKEN: 'oauth_access_token',
  OAUTH_REFRESH_TOKEN: 'oauth_refresh_token',
  OAUTH_ID_TOKEN: 'oauth_id_token',
  OAUTH_EXPIRES_AT: 'oauth_expires_at',
  OAUTH_USER: 'oauth_user',

  // OAuth Flow (Session Storage)
  OAUTH_STATE: 'oauth_state',
  OAUTH_CODE_VERIFIER: 'oauth_code_verifier',
  OAUTH_RETURN_URL: 'oauth_return_url',
} as const;

/**
 * Get all OAuth token keys for bulk operations
 */
export const OAUTH_TOKEN_KEYS = [
  STORAGE_KEYS.OAUTH_ACCESS_TOKEN,
  STORAGE_KEYS.OAUTH_REFRESH_TOKEN,
  STORAGE_KEYS.OAUTH_ID_TOKEN,
  STORAGE_KEYS.OAUTH_EXPIRES_AT,
  // ❌ ไม่เก็บ OAUTH_USER ใน localStorage อีกต่อไป - จะดึงจาก API ทุกครั้ง
] as const;

/**
 * Get all OAuth session keys (for cleanup)
 */
export const OAUTH_SESSION_KEYS = [
  STORAGE_KEYS.OAUTH_STATE,
  STORAGE_KEYS.OAUTH_CODE_VERIFIER,
  STORAGE_KEYS.OAUTH_RETURN_URL,
] as const;
