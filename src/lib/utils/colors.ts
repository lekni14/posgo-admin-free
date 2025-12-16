/**
 * Semantic Colors Utility
 * ใช้สำหรับ map สีต่าง ๆ ให้เป็น shadcn default colors
 * ช่วยให้ developers ใช้งานง่ายและสอดคล้องกับ design system
 */

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type StatusVariant = 'solid' | 'outline' | 'subtle';

/**
 * สี semantic ตาม shadcn design system
 */
export const semanticColors = {
  // Primary colors (ใช้ตามธีมของ shadcn)
  primary: {
    foreground: 'text-primary',
    background: 'bg-primary/10',
    border: 'border-primary/20',
    solid: 'bg-primary text-primary-foreground',
  },

  // Success colors (เขียว)
  success: {
    foreground: 'text-emerald-600',
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    solid: 'bg-emerald-600 text-white',
  },

  // Error/Destructive colors (แดง)
  error: {
    foreground: 'text-destructive',
    background: 'bg-destructive/10',
    border: 'border-destructive/20',
    solid: 'bg-destructive text-destructive-foreground',
  },

  // Warning colors (เหลือง/ส้ม)
  warning: {
    foreground: 'text-amber-500',
    background: 'bg-amber-50',
    border: 'border-amber-200',
    solid: 'bg-amber-500 text-white',
  },

  // Info colors (น้ำเงิน - ใช้ primary)
  info: {
    foreground: 'text-primary',
    background: 'bg-primary/10',
    border: 'border-primary/20',
    solid: 'bg-primary text-primary-foreground',
  },

  // Muted colors (เทา)
  muted: {
    foreground: 'text-muted-foreground',
    background: 'bg-muted',
    border: 'border-muted',
    solid: 'bg-muted text-muted-foreground',
  },
} as const;

/**
 * ฟังก์ชันสำหรับเลือกสีตาม status type
 */
export function getStatusColors(status: StatusType) {
  switch (status) {
    case 'success':
      return semanticColors.success;
    case 'error':
      return semanticColors.error;
    case 'warning':
      return semanticColors.warning;
    case 'info':
      return semanticColors.info;
    case 'default':
    default:
      return semanticColors.primary;
  }
}

/**
 * ฟังก์ชันสำหรับสร้าง className ตาม status และ variant
 */
export function getStatusClassName(status: StatusType, variant: StatusVariant = 'subtle'): string {
  const colors = getStatusColors(status);

  switch (variant) {
    case 'solid':
      return colors.solid;
    case 'outline':
      return `${colors.foreground} ${colors.border} border bg-transparent`;
    case 'subtle':
    default:
      return `${colors.foreground} ${colors.background}`;
  }
}

/**
 * ฟังก์ชันสำหรับสร้าง Alert className
 */
export function getAlertClassName(status: StatusType): string {
  const colors = getStatusColors(status);
  return `${colors.border} ${colors.background}`;
}

/**
 * ฟังก์ชันสำหรับสร้าง Badge className
 */
export function getBadgeClassName(status: StatusType, variant: StatusVariant = 'subtle'): string {
  return getStatusClassName(status, variant);
}

/**
 * ฟังก์ชันสำหรับ icon colors
 */
export function getIconColor(status: StatusType): string {
  const colors = getStatusColors(status);
  return colors.foreground;
}

/**
 * ฟังก์ชันสำหรับ progress bar colors
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return semanticColors.success.foreground.replace('text-', 'bg-');
  if (percentage >= 50) return semanticColors.warning.foreground.replace('text-', 'bg-');
  return semanticColors.error.foreground.replace('text-', 'bg-');
}

/**
 * ฟังก์ชันสำหรับ HTTP status colors
 */
export function getHttpStatusColor(status: number): string {
  if (status >= 200 && status < 300) return semanticColors.success.foreground;
  if (status >= 300 && status < 400) return semanticColors.primary.foreground;
  if (status >= 400 && status < 500) return semanticColors.warning.foreground;
  if (status >= 500) return semanticColors.error.foreground;
  return semanticColors.muted.foreground;
}

/**
 * ฟังก์ชันสำหรับ response time colors
 */
export function getResponseTimeColor(ms: number): string {
  if (ms < 500) return semanticColors.success.foreground;
  if (ms < 1000) return semanticColors.primary.foreground;
  if (ms < 2000) return semanticColors.warning.foreground;
  return semanticColors.error.foreground;
}

/**
 * ฟังก์ชันสำหรับ role type colors
 */
export function getRoleTypeColor(type: string): { foreground: string; background: string } {
  switch (type.toLowerCase()) {
    case 'system':
      return {
        foreground: 'text-purple-600',
        background: 'bg-purple-100',
      };
    case 'standard':
      return {
        foreground: semanticColors.success.foreground,
        background: semanticColors.success.background,
      };
    case 'custom':
      return {
        foreground: 'text-orange-600',
        background: 'bg-orange-100',
      };
    case 'personal':
      return {
        foreground: semanticColors.muted.foreground,
        background: semanticColors.muted.background,
      };
    default:
      return {
        foreground: semanticColors.muted.foreground,
        background: semanticColors.muted.background,
      };
  }
}

/**
 * ฟังก์ชันสำหรับ session status colors
 */
export function getSessionStatusColor(isActive: boolean, isWarning: boolean): string {
  if (!isActive) return semanticColors.error.foreground;
  if (isWarning) return semanticColors.warning.foreground;
  return semanticColors.success.foreground;
}

/**
 * ฟังก์ชันสำหรับ session badge colors
 */
export function getSessionBadgeColor(seconds: number): string {
  if (seconds > 180) return getStatusClassName('warning', 'subtle');
  if (seconds > 60) return 'bg-orange-100 border-orange-300 text-orange-800';
  return getStatusClassName('error', 'subtle');
}

/**
 * ตัวอย่างการใช้งาน
 *
 * // Alert
 * <Alert className={getAlertClassName('success')}>
 *   <AlertDescription className={getStatusColors('success').foreground}>
 *     Success message
 *   </AlertDescription>
 * </Alert>
 *
 * // Badge
 * <Badge className={getBadgeClassName('error', 'solid')}>
 *   Error
 * </Badge>
 *
 * // Icon
 * <CheckCircle className={`h-4 w-4 ${getIconColor('success')}`} />
 *
 * // HTTP Status
 * <span className={getHttpStatusColor(200)}>200 OK</span>
 *
 * // Response Time
 * <span className={getResponseTimeColor(250)}>250ms</span>
 */
