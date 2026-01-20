"use client";

import { apiClient } from "./api-client.service";
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
  message?: string;
  timestamp?: string;
}
export interface BackendError {
  code: number;
  data: string;
  message: string;
}
// Backend Donor Entity (snake_case)
interface BackendRoleEntity {
  id: string;
  role_name: string;
  role_name_th: string;
  role_name_en: string;
  role_name_lo: string;
  role_access: string[];
  created_at: string;
  updated_at: string;
  site_id: string;
}

// ========================================
// Frontend DTOs (camelCase)
// ========================================
export interface Role {
  id: string;
  role_name: string;
  role_name_th: string;
  role_name_en: string;
  role_name_lo: string;
  role_access: string[];
}

export interface RoleSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface RoleSearchResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RoleListResponse {
  data: Role[];
}

export interface CreatePayload {
  role_name: string;
  role_name_th?: string;
  role_name_en?: string;
  role_name_lo?: string;
}

// ========================================
// Register Donor Types
// ========================================
export interface RegisterDonorData {
  donorId?: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string; // ISO date string
  age: number;
  weight: number;
  height: number;
  biologicalSex: "female" | "male";
  gender: string; // UUID
  phoneNumber: string;
  emergencyPhoneNumber: string;
  email?: string;
  contactAddressType?: string;
  addressNumber: string;
  road?: string;
  alley?: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  occupation: string; // UUID
  occupationOther?: string;
  bloodType?: string; // UUID
  donorType: string; // UUID
  donationType: string; // UUID
  // Walk-in donation fields
  locationId?: string; // UUID for donation location
  registrationSourceId?: string; // UUID for registration source (optional, defaults to WALK_IN)
  donationDate?: string; // ISO date string (optional)
  note?: string; // Optional note
}

// ========================================
// Mapper Functions
// ========================================
/**
 * แปลง Backend Entity (snake_case) เป็น Frontend Donor (camelCase)
 */

// ========================================
// Donor Service
// ========================================
export class RoleService extends BaseService {
  constructor() {
    super("/roles"); // Backend API endpoint
  }

  /**
   * Search donors by keyword
   * Backend: GET /donation/donors/search?keyword=xxx&page=1&limit=10
   */
  async lists(): Promise<RoleListResponse> {
    // Call backend API
    const response = await this.get<BackendResponse<BackendRoleEntity[]>>("/");

    // Transform backend response to frontend format
    if (response.code !== 200 || !response.data) {
      return {
        data: [],
      };
    }

    return {
      data: response.data,
    };
  }

  /**
   * Search Role by keyword
   * Backend: GET /donation/Inventorys/search?keyword=xxx&page=1&limit=10
   */
  async search(params: RoleSearchParams): Promise<RoleSearchResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams: Record<string, any> = {};
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
      BackendPaginatedResponse<BackendRoleEntity>
    >(`/getlistfilter`, {
      params: queryParams,
    });
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
  }
  async create(payload: CreatePayload): Promise<Role> {
    // async create(payload:CreatePayload): Promise<BackendResponse<BackendRoleEntity>> {
    const response = await apiClient.post<BackendResponse<BackendRoleEntity>>(
      ``,
      payload,
    );
    // if (response.code !== 200 || !response.data) {

    // }
    return {
      id: "",
      role_name: "",
      role_name_th: "",
      role_name_en: "",
      role_name_lo: "",
      role_access: [],
    };
  }
  async remove(
    id: number | string,
  ): Promise<BackendResponse<BackendRoleEntity>> {
    const response = await apiClient.delete<BackendResponse<BackendRoleEntity>>(
      `/${id}`,
    );
    console.log(response);
    // const response = await axios.delete<DeleteResponse>(`/api/items/${id}`);
    return response;
  }
}

// Export singleton instance
export const roleService = new RoleService();
