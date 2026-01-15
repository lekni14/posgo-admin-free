import { waitForConfig } from '@/stores/app-store';
import { STORAGE_KEYS, OAUTH_TOKEN_KEYS } from '@/lib/constants/storage';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { verifySession } from '@/app/lib/dal';
// import { toast } from 'sonner';

// ✅ Constants
const DEFAULT_TIMEOUT = 30000;
const LAST_RESORT_API_URL = 'http://localhost:3001'; // Direct API server call
const AUTH_REDIRECT_DELAY = 100;

/**
 * Runtime API Client Service
 *
 * สร้าง HTTP client พร้อม runtime configuration
 * เรียก API server โดยตรงโดยไม่ผ่าน proxy
 */
class ApiClientService {
  private client: AxiosInstance | null = null;
  private configPromise: Promise<void> | null = null;
  private isLoggingOut = false;

  /**
   * Initialize API client พร้อม runtime configuration
   */
  private async initializeClient(): Promise<void> {
    if (this.configPromise) {
      return this.configPromise;
    }

    this.configPromise = this.performClientInitialization();
    return this.configPromise;
  }

  /**
   * ดำเนินการ initialize client จริง พร้อม error handling
   */
  private async performClientInitialization(): Promise<void> {
    try {
      const config = await waitForConfig();
      this.client = this.createClientWithConfig(config.API_URL);
      console.log('✅ API Client initialized with baseURL:', config.API_URL);
    } catch (error) {
      console.error('❌ Failed to initialize API client:', error);
      await this.handleInitializationError();
    }
  }

  /**
   * จัดการ error ในกรณีที่ initialize ไม่สำเร็จ
   */
  private async handleInitializationError(): Promise<void> {
    try {
      // ลอง fallback config อีกครั้ง
      const fallbackConfig = await waitForConfig();
      this.client = this.createClientWithConfig(fallbackConfig.API_URL);
      console.warn('⚠️ Using fallback config:', fallbackConfig.API_URL);
    } catch {
      // Last resort - ใช้ hardcoded default
      this.client = this.createClientWithConfig(LAST_RESORT_API_URL);
      console.warn('⚠️ Using last resort API URL:', LAST_RESORT_API_URL);
    }
  }

  /**
   * สร้าง axios client พร้อม interceptors
   */
  private createClientWithConfig(baseURL: string): AxiosInstance {
    const client = axios.create({
      baseURL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupRequestInterceptor(client);
    this.setupResponseInterceptor(client);

    return client;
  }

  /**
   * ตั้งค่า request interceptor สำหรับ authentication และ FormData handling
   */
  private setupRequestInterceptor(client: AxiosInstance): void {
    client.interceptors.request.use(
      async (config) => {
        // Use OAuth token
        const token = await verifySession()
        // const token = localStorage.getItem(STORAGE_KEYS.OAUTH_ACCESS_TOKEN);
        if (token.token) {
          config.headers.Authorization = `Bearer ${token.token}`;
        }

        // ✅ ลบ Content-Type header เมื่อส่ง FormData
        // เพื่อให้ browser ตั้ง multipart/form-data boundary เอง
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  /**
   * ตั้งค่า response interceptor สำหรับ error handling
   */
  private setupResponseInterceptor(client: AxiosInstance): void {
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if(error.config.url === '/admin/login'){
          this.handleInitializationError()
        }
        // Handle 401 errors - immediately logout, no refresh attempts
        if (error.response?.status === 401) {
          console.warn('🔐 401 Unauthorized detected - initiating logout');
          // Don't try to refresh, just logout immediately
          this.handleUnauthorizedError();
          return Promise.reject(error);
        }

        // Handle other HTTP errors with toast notifications
        this.handleHttpError(error);

        return Promise.reject(error);
      },
    );
  }

  /**
   * จัดการ HTTP errors และแสดง toast notification
   */
  private handleHttpError(error: any): void {
    // Skip toast for 401 (handled separately with redirect)
    if (error.response?.status === 401) {
      return;
    }

    // Extract error message from standardized API response format
    const errorMessage = error.response?.data?.error?.message || error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';

    // Show error toast for all other HTTP errors
    if (typeof window !== 'undefined') {
      // toast.error(errorMessage);
      console.log(errorMessage)
    }
  }

  /**
   * จัดการ 401 unauthorized error
   */
  private handleUnauthorizedError(): void {
    // Prevent multiple concurrent logout attempts
    if (this.isLoggingOut) {
      console.log('⚠️ Already logging out, skipping duplicate call');
      return;
    }
    this.isLoggingOut = true;

    console.log('🔐 Handling unauthorized error - logging out user');

    // Clear all OAuth tokens
    OAUTH_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));

    if (typeof window === 'undefined') {
      this.isLoggingOut = false;
      return;
    }

    // Notify auth store via custom event (avoid circular imports)
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));

    // Redirect to login immediately
    console.log('🚀 Redirecting to login page from:', window.location.pathname);
    window.location.href = '/login';
  }

  /**
   * ดึง initialized HTTP client
   */
  async getClient(): Promise<AxiosInstance> {
    if (!this.client) {
      await this.initializeClient();
    }

    if (!this.client) {
      throw new Error('Failed to initialize API client after multiple attempts');
    }

    return this.client;
  }

  // ✅ HTTP Methods พร้อม type safety

  /**
   * HTTP GET request
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const client = await this.getClient();
    const response = await client.get<T>(url, config);
    return response.data;
  }

  /**
   * HTTP POST request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const client = await this.getClient();
    const response = await client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * HTTP PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const client = await this.getClient();
    const response = await client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * HTTP DELETE request
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const client = await this.getClient();
    const response = await client.delete<T>(url, config);
    return response.data;
  }

  /**
   * HTTP PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const client = await this.getClient();
    const response = await client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Reset client (สำหรับ config changes)
   */
  reset(): void {
    this.client = null;
    this.configPromise = null;
  }
}

// ✅ Export singleton instance
export const apiClient = new ApiClientService();
