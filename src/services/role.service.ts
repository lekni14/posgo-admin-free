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
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
    start_index: number;
    end_index: number;
  };
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
}

export interface RoleSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface RoleListResponse {
  data: Role[];
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

// Walk-in Registration Payload (matches WalkInRegistrationDto)
export interface WalkInRegistrationPayload {
  donorData: {
    donorId?: string;
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
    donorType: "first_time" | "regular_over_2_years" | "regular"; // Enum value, not UUID
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
    console.log(response);

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
   * Get donor by ID
   * Backend: GET /donation/donors/:id
   */
  // async getById(id: string): Promise<Donor> {
  //   const response = await this.get<BackendResponse<BackendDonorEntity>>(`/${id}`);

  //   // Console log response
  //   console.log('🔵 [Donor API] GET /donation/donors/:id', {
  //     endpoint: `/donation/donors/${id}`,
  //     method: 'GET',
  //     id: id,
  //     response: response,
  //   });

  //   if (!response.success || !response.data) {
  //     throw new Error('Donor not found');
  //   }

  //   return mapBackendToFrontend(response.data);
  // }
}

// Export singleton instance
export const roleService = new RoleService();
