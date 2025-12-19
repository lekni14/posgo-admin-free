'use client';

import { BaseService } from './base.service';

// ========================================
// Backend Response Types
// ========================================
interface BackendResponse<T> {
  success: boolean;
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
  next_step: 'pre-screening' | 'deferral-check';
  message: string;
}

// Backend Donor Entity (snake_case)
interface BackendDonorEntity {
  id: string;
  code?: string;
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_mobile: string;
  phone_home?: string;
  email?: string;
  address_number?: string;
  road?: string;
  alley?: string;
  address?: string;
  tambol_id?: string;
  amphoe_id?: string;
  province_id?: string;
  postal_code?: string;
  contact_address_type_id?: string;
  full_address?: string;
  biological_sex_id: string;
  gender_id: string;
  blood_group_abo_id?: string;
  blood_group_rh_id?: string;
  donor_status_id?: string;
  donor_type_id: string;
  occupation_id?: string;
  occupation_other?: string;
  preferred_contact_channel_id?: string;
  allow_marketing: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  total_donations: number;
  last_donation_date?: string;
  next_eligible_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  biological_sex?: { id: string; name: string; name_en?: string };
  gender?: { id: string; name: string; name_en?: string };
  blood_group_abo?: { id: string; name: string; code?: string };
  blood_group_rh?: { id: string; name: string; code?: string };
  donor_status?: { id: string; name: string; name_en?: string };
  donor_type?: { id: string; name: string; name_en?: string };
  occupation?: { id: string; name: string; name_en?: string };
}

// ========================================
// Frontend DTOs (camelCase)
// ========================================
export interface Donor {
  id: string;
  code?: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  age?: number;
  phoneMobile: string;
  phoneHome?: string;
  email?: string;
  addressNumber?: string;
  road?: string;
  alley?: string;
  address?: string;
  tambolId?: string;
  amphoeId?: string;
  provinceId?: string;
  postalCode?: string;
  fullAddress?: string;
  biologicalSexId: string;
  genderId: string;
  gender?: string;
  bloodGroupAboId?: string;
  bloodType?: string; // Combined ABO + Rh (e.g., "A+", "O-")
  donorStatusId?: string;
  donorStatus?: string;
  donorTypeId: string;
  donorType?: string;
  occupationId?: string;
  occupation?: string;
  totalDonations: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface DonorSearchResponse {
  data: Donor[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
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
  biologicalSex: 'female' | 'male';
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
    biologicalSex: 'female' | 'male';
    gender: 'woman' | 'man' | 'transwoman' | 'transman'; // Enum value, not UUID
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
    occupation: 'student' | 'government_military' | 'employee' | 'monk' | 'farmer' | 'business' | 'other'; // Enum value, not UUID
    occupationOther?: string;
    bloodType?: 'unknown' | 'A' | 'B' | 'AB' | 'O'; // Enum value, not UUID
    donorType: 'first_time' | 'regular_over_2_years' | 'regular'; // Enum value, not UUID
    donationType: 'whole_blood' | 'platelets' | 'plasma'; // Enum value, not UUID
    consents?: Array<{
      consent_type: 'data_usage' | 'marketing' | 'donation_procedure' | 'research';
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
function mapBackendToFrontend(backend: BackendDonorEntity): Donor {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Combine blood type (ABO + Rh)
  const getBloodType = (): string | undefined => {
    if (!backend.blood_group_abo) return undefined;
    const abo = backend.blood_group_abo.code || backend.blood_group_abo.name;
    const rh = backend.blood_group_rh?.code || backend.blood_group_rh?.name || '+';
    return `${abo}${rh}`;
  };

  return {
    id: backend.id,
    code: backend.code,
    nationalId: backend.national_id,
    firstName: backend.first_name,
    lastName: backend.last_name,
    fullName: `${backend.first_name} ${backend.last_name}`,
    dateOfBirth: backend.date_of_birth,
    age: calculateAge(backend.date_of_birth),
    phoneMobile: backend.phone_mobile,
    phoneHome: backend.phone_home,
    email: backend.email,
    addressNumber: backend.address_number,
    road: backend.road,
    alley: backend.alley,
    address: backend.address,
    tambolId: backend.tambol_id,
    amphoeId: backend.amphoe_id,
    provinceId: backend.province_id,
    postalCode: backend.postal_code,
    fullAddress: backend.full_address,
    biologicalSexId: backend.biological_sex_id,
    genderId: backend.gender_id,
    gender: backend.gender?.name || backend.gender?.name_en,
    bloodGroupAboId: backend.blood_group_abo_id,
    bloodType: getBloodType(),
    donorStatusId: backend.donor_status_id,
    donorStatus: backend.donor_status?.name || backend.donor_status?.name_en,
    donorTypeId: backend.donor_type_id,
    donorType: backend.donor_type?.name || backend.donor_type?.name_en,
    occupationId: backend.occupation_id,
    occupation: backend.occupation?.name || backend.occupation?.name_en,
    totalDonations: backend.total_donations,
    lastDonationDate: backend.last_donation_date,
    nextEligibleDate: backend.next_eligible_date,
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
  };
}

// ========================================
// Donor Service
// ========================================
export class DonorService extends BaseService {
  constructor() {
    super('/donation/donors'); // Backend API endpoint
  }

  /**
   * Search donors by keyword
   * Backend: GET /donation/donors/search?keyword=xxx&page=1&limit=10
   */
  async search(params: DonorSearchParams): Promise<DonorSearchResponse> {
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

    // Call backend API
    const response = await this.get<BackendPaginatedResponse<BackendDonorEntity>>('/search', {
      params: queryParams,
    });

    // Console log response
    console.log('🔵 [Donor API] GET /donation/donors/search', {
      endpoint: '/donation/donors/search',
      method: 'GET',
      params: queryParams,
      response: response,
    });

    // Transform backend response to frontend format
    if (!response.success || !response.data || !response.pagination) {
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
      data: response.data.map(mapBackendToFrontend),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      hasNext: response.pagination.has_next,
      hasPrev: response.pagination.has_prev,
    };
  }

  /**
   * Get donor by ID
   * Backend: GET /donation/donors/:id
   */
  async getById(id: string): Promise<Donor> {
    const response = await this.get<BackendResponse<BackendDonorEntity>>(`/${id}`);

    // Console log response
    console.log('🔵 [Donor API] GET /donation/donors/:id', {
      endpoint: `/donation/donors/${id}`,
      method: 'GET',
      id: id,
      response: response,
    });

    if (!response.success || !response.data) {
      throw new Error('Donor not found');
    }

    return mapBackendToFrontend(response.data);
  }

  /**
   * Register new donor via walk-in registration
   * Backend: POST /donation/walk-in
   * สร้าง donor ใหม่พร้อม donation record
   * 
   * @param payload - WalkInRegistrationPayload ที่เตรียมไว้แล้วจาก component
   */
  async register(payload: WalkInRegistrationPayload): Promise<Donor> {

    // Call backend API - use absolute path
    // Since basePath is /donation/donors, we need to call the API directly
    // We'll use apiClient directly for this endpoint
    const { apiClient } = await import('./api-client.service');
    const response = await apiClient.post<BackendResponse<WalkInRegistrationResult>>(
      '/donation/walk-in',
      payload
    );

    // Console log response
    console.log('🔵 [Donor API] POST /donation/walk-in', {
      endpoint: '/donation/walk-in',
      method: 'POST',
      payload: payload,
      response: response,
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to register donor via walk-in');
    }

    // ดึงข้อมูล donor จาก response โดยใช้ donor_id เพื่อดึงข้อมูลเต็ม
    const donorId = response.data.donor_id;
    return this.getById(donorId);
  }
}

// Export singleton instance
export const donorService = new DonorService();

