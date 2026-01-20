import {
  BackendError,
  CreatePayload,
  Role,
  RoleListResponse,
  RoleSearchParams,
  roleService,
} from "services/role.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const roleKeys = {
  all: ["role"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  search: (params?: RoleSearchParams) =>
    [...roleKeys.lists(), "search", params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
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
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, BackendError, CreatePayload>({
    mutationFn: roleService.create,
    onSuccess: () => {
      // Invalidate the query for the list of items to refetch the data
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      console.log("Item create successfully, list invalidated.");
    },
    onError: (error) => {
      console.error("Error create item:", error);
    },
  });
};
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.remove,
    onSuccess: () => {
      // Invalidate the query for the list of items to refetch the data
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      console.log("Item deleted successfully, list invalidated.");
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });
};
