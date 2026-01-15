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
  userId: string;
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
  InventoryData: {
    InventoryId?: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    dateOfBirth: Date;
    age: number;
    weight: number;
    height: number;
    biologicalSex: "female" | "male";
    gender: "woman" | "man" | "transwoman" | "transman"; // Enum value, not UUID
    phoneNumber: string;
    emergencyPhoneNumber: string;
    email?: string;
    addressNumber: string;
    road?: string;
    alley?: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    tambolId?: string; // UUID for tambol (FK)
    amphoeId?: string; // UUID for amphoe (FK)
    provinceId?: string; // UUID for province (FK)
    contactAddressType?: string;
    occupation:
      | "student"
      | "government_military"
      | "employee"
      | "monk"
      | "farmer"
      | "business"
      | "other"; // Enum value, not UUID
    occupationOther?: string;
    bloodType?: "unknown" | "A" | "B" | "AB" | "O"; // Enum value, not UUID
    InventoryType: "first_time" | "regular_over_2_years" | "regular"; // Enum value, not UUID
    donationType: "whole_blood" | "platelets" | "plasma"; // Enum value, not UUID
    consents?: Array<{
      consent_type:
        | "data_usage"
        | "marketing"
        | "donation_procedure"
        | "research";
      is_consented: boolean;
      consent_version?: string;
      signature_image_url?: string;
      ip_address?: string;
      witnessed_by_staff_id?: string;
      note?: string;
    }>;
  };
  donation: {
    location_id: string; // UUID (required)
    donation_type_id: string; // UUID (required) - this is UUID, not enum
    registration_source_id?: string; // UUID (optional)
    donation_datetime?: Date; // Optional
    note?: string; // Optional
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
      `/${id}`
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
        response.message || "Failed to register Inventory via walk-in"
      );
    }

    // ดึงข้อมูล Inventory จาก response โดยใช้ Inventory_id เพื่อดึงข้อมูลเต็ม
    const inventoryId = response.data.donor_id;
    return this.getById(inventoryId);
  }
}

// Export singleton instance
export const userService = new UserService();
