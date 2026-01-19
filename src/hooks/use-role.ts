import { RoleListResponse, RoleSearchParams, roleService } from "services/role.service";
import { useQuery } from "@tanstack/react-query";


export const roleKeys = {
  all: ['role'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  search: (params?: RoleSearchParams) => [...roleKeys.lists(), 'search', params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
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
export function useListRoles() {
  return useQuery<RoleListResponse>({
    queryKey: roleKeys.all,
    queryFn: async () => {
      return roleService.lists();
    },
    staleTime: 30 * 1000, // 30 seconds (shorter for search results)
    retry: false, // ไม่ retry เมื่อเกิด error
  });
}