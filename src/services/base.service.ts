'use client';

import { apiClient } from './api-client.service';

interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cancelKey?: string;
}

export class BaseService {
  private requestOptions: RequestOptions = {};
  private activeRequests = new Map<string, AbortController>();

  constructor(protected readonly basePath: string) {
    // Direct API calls - no proxy prefix needed
    this.basePath = basePath;
  }

  // ================================
  // Chain Methods
  // ================================

  /**
   * ตั้งค่า timeout สำหรับ request
   */
  withTimeout(ms: number): this {
    this.requestOptions.timeout = ms;
    return this;
  }

  /**
   * เพิ่ม custom headers
   */
  withHeaders(headers: Record<string, string>): this {
    this.requestOptions.headers = { ...this.requestOptions.headers, ...headers };
    return this;
  }

  /**
   * ใช้ AbortSignal ที่มีอยู่แล้ว
   */
  withAbortSignal(signal: AbortSignal): this {
    this.requestOptions.signal = signal;
    return this;
  }

  /**
   * สร้าง AbortController อัตโนมัติพร้อม key สำหรับ cancel ทีหลัง
   */
  withCancelToken(key?: string): this {
    const controller = new AbortController();
    const requestKey = key || `${this.basePath}-${Date.now()}-${Math.random()}`;

    this.activeRequests.set(requestKey, controller);
    this.requestOptions.signal = controller.signal;
    this.requestOptions.cancelKey = requestKey;

    return this;
  }

  // ================================
  // Cancel Methods
  // ================================

  /**
   * Cancel specific request by key
   */
  cancelRequest(key: string): boolean {
    const controller = this.activeRequests.get(key);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Cancel all active requests
   */
  cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => {
      controller.abort();
    });
    this.activeRequests.clear();
  }

  // ================================
  // Note: Generic CRUD methods removed to enforce type safety
  // Each service should implement specific methods with proper types
  // ================================

  // ================================
  // Protected Helper Methods
  // ================================

  /**
   * GET request ที่ return single response
   */
  protected async get<T = any>(endpoint: string, options?: any): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * POST request
   */
  protected async post<T = any>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * PUT request
   */
  protected async put<T = any>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * PATCH request
   */
  protected async patch<T = any>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * DELETE request
   */
  protected async del<T = void>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.request<T>('DELETE', endpoint, data, options);
  }

  // ================================
  // Special Request Methods
  // ================================

  /**
   * Download file as Blob - ใช้ request() โดยตรงแต่ return raw response
   */
  protected async downloadFile(endpoint: string, options?: any): Promise<Blob> {
    return this.request<Blob>('GET', endpoint, undefined, {
      responseType: 'blob',
      ...options,
    });
  }

  /**
   * Upload file with FormData
   * apiClient จะจัดการลบ Content-Type header อัตโนมัติเมื่อเจอ FormData
   */
  protected async uploadFile<T = any>(endpoint: string, formData: FormData, options?: any): Promise<T> {
    return this.post<T>(endpoint, formData, {
      ...options,
    });
  }

  // ================================
  // Core Request Method
  // ================================

  /**
   * Core request method ที่ใช้โดยทุก method
   */
  private async request<T>(method: string, endpoint: string, data?: any, options?: any): Promise<T> {
    const cancelKey = this.requestOptions.cancelKey;
    const fullUrl = `${this.basePath}${endpoint}`;

    try {
      const config = {
        signal: this.requestOptions.signal,
        timeout: this.requestOptions.timeout,
        headers: this.requestOptions.headers,
        ...options,
      };

      // Call appropriate HTTP method
      let response: T;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get<T>(fullUrl, config);
          break;
        case 'POST':
          response = await apiClient.post<T>(fullUrl, data, config);
          break;
        case 'PUT':
          response = await apiClient.put<T>(fullUrl, data, config);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(fullUrl, data, config);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(fullUrl, { ...config, data });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        throw new Error('Request cancelled');
      }
      throw error;
    } finally {
      this.cleanupRequest(cancelKey);
      this.resetOptions();
    }
  }

  /**
   * Cleanup request tracking
   */
  private cleanupRequest(key?: string): void {
    if (key && this.activeRequests.has(key)) {
      this.activeRequests.delete(key);
    }
  }

  /**
   * Reset request options after use
   */
  private resetOptions(): void {
    this.requestOptions = {};
  }
}
