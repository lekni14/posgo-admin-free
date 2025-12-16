/**
 * Utility functions for parsing API error responses
 */

/**
 * Parse error message from various API error structures
 *
 * Handles multiple error formats:
 * - { success: false, error: { message: "..." } }
 * - { error: { message: "..." } }
 * - { error: "message" }
 * - { message: "..." }
 * - Error object with message property
 * - String message
 *
 * @param error - Error object from API or mutation
 * @param fallbackMessage - Default message if no error message found
 * @returns Parsed error message string
 */
export function parseErrorMessage(error: unknown, fallbackMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'): string {
  // Handle null/undefined
  if (!error) {
    return fallbackMessage;
  }

  // Try different error structures
  const errorObj = error as any;

  // 1. Handle API response: { success: false, error: { message: "..." } }
  if (errorObj?.error?.message) {
    return errorObj.error.message;
  }

  // 2. Handle Error object: { message: "..." }
  if (errorObj?.message && typeof errorObj.message === 'string') {
    return errorObj.message;
  }

  // 3. Handle string error
  if (typeof error === 'string') {
    return error;
  }

  // 4. Handle direct error property as string
  if (errorObj?.error && typeof errorObj.error === 'string') {
    return errorObj.error;
  }

  // 5. Handle response data error structures
  if (errorObj?.response?.data?.error?.message) {
    return errorObj.response.data.error.message;
  }

  if (errorObj?.response?.data?.message) {
    return errorObj.response.data.message;
  }

  // 6. Fallback to default message
  return fallbackMessage;
}

/**
 * Parse error message with specific fallback for authentication errors
 */
export function parseAuthErrorMessage(error: unknown): string {
  return parseErrorMessage(error, 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
}

/**
 * Parse error message with specific fallback for validation errors
 */
export function parseValidationErrorMessage(error: unknown): string {
  return parseErrorMessage(error, 'ข้อมูลที่ป้อนไม่ถูกต้อง');
}

/**
 * Parse error message with specific fallback for network errors
 */
export function parseNetworkErrorMessage(error: unknown): string {
  return parseErrorMessage(error, 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
}

/**
 * Check if error indicates a network/connection issue
 */
export function isNetworkError(error: unknown): boolean {
  const errorObj = error as any;
  return (
    errorObj?.code === 'NETWORK_ERROR' ||
    errorObj?.message?.includes('Network Error') ||
    errorObj?.message?.includes('fetch') ||
    !errorObj?.response // No response typically means network issue
  );
}

/**
 * Check if error indicates authentication failure
 */
export function isAuthError(error: unknown): boolean {
  const errorObj = error as any;
  return (
    errorObj?.response?.status === 401 ||
    errorObj?.status === 401 ||
    errorObj?.code === 'UNAUTHORIZED' ||
    errorObj?.error?.code === 'UNAUTHORIZED'
  );
}

/**
 * Check if error indicates authorization failure (forbidden)
 */
export function isForbiddenError(error: unknown): boolean {
  const errorObj = error as any;
  return (
    errorObj?.response?.status === 403 ||
    errorObj?.status === 403 ||
    errorObj?.code === 'FORBIDDEN' ||
    errorObj?.error?.code === 'FORBIDDEN'
  );
}
