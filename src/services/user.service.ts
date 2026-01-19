"use client";

import { BaseService } from "./base.service";

// ========================================
// Backend Response Types
// ========================================
interface BackendResponse<T> {
  code: number;
  data?: T;
  message?: string;
  timestamp?: string;
}
export interface BackendError {
  code: number;
  data: string;
  message: string;

  // AxiosError<{ message: string }>;
}
interface BackendPaginatedResponse<T> {
  code: number;
  data?: {
    Data: T[];
    Pagination: {
      TotalRows: number;
      TotalPages: number;
      Rows: number | null;
    };
  };
  // pagination?: {
  //   page: number;
  //   limit: number;
  //   total: number;
  //   total_pages: number;
  //   has_next: boolean;
  //   has_prev: boolean;
  //   start_index: number;
  //   end_index: number;
  // };
  message?: string;
  timestamp?: string;
}

// Walk-in Registration Result
interface WalkInRegistrationResult {
  donor_id: string;
  donation_id: string;
  is_new_donor: boolean;
  donor: {
    id: string;
    code?: string;
    first_name: string;
    last_name: string;
    national_id: string;
  };
  donation: {
    id: string;
    donation_datetime: string;
    donation_status: string;
  };
  next_step: "pre-screening" | "deferral-check";
  message: string;
}

// Backend Donor Entity (snake_case)
interface BackendUserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  active: boolean;
  mobile: string;
  site_id: string;
  pin: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  userrole: null;
  role_name: {
    id: string;
    role_name: string;
    role_name_th: string;
    role_name_en: string;
    role_name_lo: string;
    role_access: [];
    created_at: string;
    updated_at: string;
    site_id: string;
  };
}

// ========================================
// Frontend DTOs (camelCase)
// ========================================
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  active: boolean;
  mobile: string;
  site_id: string;
  pin: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  userrole: null;
  role_name: {
    id: string;
    role_name: string;
    role_name_th: string;
    role_name_en: string;
    role_name_lo: string;
    role_access: [];
    created_at: string;
    updated_at: string;
    site_id: string;
  };
}

export interface UserSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface UserSearchResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ========================================
// Register Inventory Types
// ========================================
export interface RegisterUserData {
  // userId: string;
  firstName?: string;
  lastName?: string;
  gender?: string; // UUID
  phoneNumber?: string;
  email?: string;
  contactAddressType?: string;
  addressNumber?: string;
  road?: string;
  alley?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  expiresAt: Date;
  [key: string]: any;
}

// Walk-in Registration Payload (matches WalkInRegistrationDto)
export interface WalkInRegistrationPayload {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  active: boolean;
  mobile: string;
  site_id: string;
  pin: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  userrole: null;
  role_name: {
    id: string;
    role_name: string;
    role_name_th: string;
    role_name_en: string;
    role_name_lo: string;
    role_access: [];
    created_at: string;
    updated_at: string;
    site_id: string;
  };
}

// ========================================
// Mapper Functions
// ========================================
/**
 * แปลง Backend Entity (snake_case) เป็น Frontend Inventory (camelCase)
 */
function mapBackendToFrontend(backend: BackendUserEntity): User {
  return {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    role: "",
    active: false,
    mobile: "",
    site_id: "",
    pin: "",
    avatar: "",
    created_at: "",
    updated_at: "",
    userrole: null,
    role_name: {
      id: "",
      role_name: "",
      role_name_th: "",
      role_name_en: "",
      role_name_lo: "",
      role_access: [],
      created_at: "",
      updated_at: "",
      site_id: "",
    },
  };
}

// ========================================
// Inventory Service
// ========================================
export class UserService extends BaseService {
  constructor() {
    super("/user/posgo"); // Backend API endpoint
  }

  /**
   * Search Inventorys by keyword
   * Backend: GET /donation/Inventorys/search?keyword=xxx&page=1&limit=10
   */
  async search(params: UserSearchParams): Promise<UserSearchResponse> {
    const queryParams: Record<string, any> = {};
    console.log(params);
    if (params.keyword) {
      queryParams.keyword = params.keyword.trim();
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }
    console.log("search");
    // Call backend API
    const response = await this.get<
      BackendPaginatedResponse<BackendUserEntity>
    >(`/getlistfilter`, {
      params: queryParams,
    });

    // Transform backend response to frontend format
    if (response.code !== 200 || !response.data) {
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        hasNext: false,
        hasPrev: false,
      };
    }
    return {
      data: response.data.Data,
      total: response.data.Pagination.TotalPages,
      page: params.page || 1,
      limit: params.limit || 10,
      hasNext: false,
      hasPrev: false,
    };
    // return {
    //   data: response.data.map(mapBackendToFrontend),
    //   total: response.pagination.total,response.data.Pagination.TotalPages
    //   page: response.pagination.page,
    //   limit: response.pagination.limit,
    //   hasNext: response.pagination.has_next,
    //   hasPrev: response.pagination.has_prev,
    // };
  }

  /**
   * Get Inventory by ID
   * Backend: GET /donation/Inventorys/:id
   */
  async getById(id: string): Promise<User> {
    const response = await this.get<BackendResponse<BackendUserEntity>>(
      `/${id}`,
    );

    // Console log response
    console.log("🔵 [Inventory API] GET /donation/Inventorys/:id", {
      endpoint: `/donation/Inventorys/${id}`,
      method: "GET",
      id: id,
      response: response,
    });

    if (response.code !== 200 || !response.data) {
      throw new Error("Inventory not found");
    }

    return mapBackendToFrontend(response.data);
  }

  /**
   * Register new Inventory via walk-in registration
   * Backend: POST /donation/walk-in
   * สร้าง Inventory ใหม่พร้อม donation record
   *
   * @param payload - WalkInRegistrationPayload ที่เตรียมไว้แล้วจาก component
   */
  async register(payload: WalkInRegistrationPayload): Promise<User> {
    // Call backend API - use absolute path
    // Since basePath is /donation/Inventorys, we need to call the API directly
    // We'll use apiClient directly for this endpoint
    const { apiClient } = await import("./api-client.service");
    const response = await apiClient.post<
      BackendResponse<WalkInRegistrationResult>
    >("/donation/walk-in", payload);

    // Console log response
    console.log("🔵 [Inventory API] POST /donation/walk-in", {
      endpoint: "/donation/walk-in",
      method: "POST",
      payload: payload,
      response: response,
    });

    if (response.code !== 200 || !response.data) {
      throw new Error(
        response.message || "Failed to register Inventory via walk-in",
      );
    }

    // ดึงข้อมูล Inventory จาก response โดยใช้ Inventory_id เพื่อดึงข้อมูลเต็ม
    const inventoryId = response.data.donor_id;
    return this.getById(inventoryId);
  }
}

// Export singleton instance
export const userService = new UserService();
