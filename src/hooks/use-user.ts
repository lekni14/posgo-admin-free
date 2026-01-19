'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UserSearchParams, type WalkInRegistrationPayload } from 'services/user.service';
import type { RegisterUserData, User, UserSearchResponse, BackendError } from 'services/user.service';

// ================================
// Query Keys
// ================================

export const userKeys = {
  all: ['user'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  search: (params?: UserSearchParams) => [...userKeys.lists(), 'search', params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// ================================
// Query Hooks (GET)
// ================================

/**
 * Search users by keyword
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSearchUsers({
 *   keyword: 'John',
 *   page: 1,
 *   limit: 10,
 * });
 * ```
 */
export function useSearchUsers(params: UserSearchParams, enabled = true) {
   return useQuery<UserSearchResponse>({
    queryKey: userKeys.search(params), // Unique key for caching
    queryFn: async () => userService.search(params), // Function that fetches the data
    // enabled: enabled && !!params.keyword && params.keyword.trim().length > 0,
  });
  // return useQuery<UserSearchResponse>({
  //   queryKey: userKeys.search(params),
  //   queryFn: async () => {
  //     return userService.search(params);
  //   },
  //   enabled: enabled && !!params.keyword && params.keyword.trim().length > 0,
  //   staleTime: 30 * 1000, // 30 seconds (shorter for search results)
  //   retry: false, // ไม่ retry เมื่อเกิด error
  // });
}

/**
 * Get user by ID
 * 
 * @example
 * ```tsx
 * const { data: user, isLoading } = useUser('123', true);
 * ```
 */
export function useUser(id: string, enabled = true) {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      return userService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}

// ================================
// Mutation Hooks (POST/PUT/DELETE)
// ================================

/**
 * Create new user via walk-in registration
 * 
 * @example
 * ```tsx
 * const { mutate: createUser, isPending, isSuccess, error } = useCreateUser();
 * 
 * CreateUser({
 *   userData: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     // ... other fields
 *   }
 * });
 * ```
 */
export function useCreateUser() {
  // const queryClient = useQueryClient();
return useMutation<User, BackendError, WalkInRegistrationPayload>({
    mutationFn: userService.register,
    onSuccess: (data) => {
      // data is of type PostData
      console.log('Post created:', data.id);
    },
    onError: (error) => {
      // error is of type ApiError
      console.error('Error creating post:', error?.data);
    },
  });
  // return useMutation<User, Error, WalkInRegistrationPayload>({
  //   mutationFn: async (payload: WalkInRegistrationPayload) => {
  //     return userService.register(payload);
  //   },
  //   onSuccess: (data) => {
  //     // Invalidate and refetch user lists
  //     queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  //     // Optionally set the new user in cache
  //     queryClient.setQueryData(userKeys.detail(data.id), data);
  //   },
  //   onError: (error) => {
  //     console.error('Failed to register user:', error);
  //   },
  // });
}

