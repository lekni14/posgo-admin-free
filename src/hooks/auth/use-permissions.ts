'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Hook for checking permissions in components
 * Follows Next.js rules: Custom hook for permission logic
 * 🎯 Permission-based access control with *:* wildcard support
 *
 * Uses auth store instead of API calls for better performance
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const permissions = React.useMemo(() => {
    return user?.permissions || [];
  }, [user?.permissions]);

  // 🔥 Wildcard permission matching for new design (category:key)
  const matchesWildcard = React.useCallback(
    (permission: string) => {
      if (permissions.includes('*:*')) return true; // ทุกอย่าง

      const [category, key] = permission.split(':');

      // ตรวจสอบ wildcards
      if (permissions.includes(`*:${key}`)) return true; // ทุก category, key ตรงกัน
      if (permissions.includes(`${category}:*`)) return true; // category ตรงกัน, ทุก key

      return false;
    },
    [permissions],
  );

  const hasPermission = React.useCallback(
    (permission: string) => {
      // // 🚫 BYPASS: Always return true for development
      // return true;

      // Exact match first
      if (permissions.includes(permission)) return true;

      // Wildcard matching (includes *:* check)
      return matchesWildcard(permission);
    },
    [permissions, matchesWildcard],
  );

  const hasAnyPermission = React.useCallback(
    (requiredPermissions: string[]) => {
      // // 🚫 BYPASS: Always return true for development
      // return true;

      return requiredPermissions.some((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  const hasAllPermissions = React.useCallback(
    (requiredPermissions: string[]) => {
      // // 🚫 BYPASS: Always return true for development
      // return true;

      return requiredPermissions.every((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
