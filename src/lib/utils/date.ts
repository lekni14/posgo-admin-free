import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import 'dayjs/locale/th';

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(buddhistEra);
dayjs.extend(isBetweenPlugin);
dayjs.locale('th');

export type DateInput = string | number | Date | Dayjs;

/**
 * Format date to Thai date string
 */
export const formatDate = (date: DateInput, format = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date to Buddhist Era (Thai calendar)
 */
export const formatDateBE = (date: DateInput, format = 'DD/MM/BBBB'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: DateInput, format = 'DD/MM/YYYY HH:mm'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date for display (Thai format)
 */
export const formatDateDisplay = (date: DateInput): string => {
  return dayjs(date).format('D MMMM YYYY');
};

/**
 * Format date for display with Buddhist Era
 */
export const formatDateDisplayBE = (date: DateInput): string => {
  return dayjs(date).format('D MMMM BBBB');
};

/**
 * Get relative time (เมื่อไหร่)
 */
export const getRelativeTime = (date: DateInput): string => {
  return dayjs(date).fromNow();
};

/**
 * Get time ago
 */
export const getTimeAgo = (date: DateInput): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return 'เมื่อสักครู่';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else {
    return formatDate(date);
  }
};

/**
 * Check if date is today
 */
export const isToday = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs(), 'week');
};

/**
 * Check if date is this month
 */
export const isThisMonth = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs(), 'month');
};

/**
 * Check if date is this year
 */
export const isThisYear = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs(), 'year');
};

/**
 * Get start of day
 */
export const startOfDay = (date?: DateInput): Dayjs => {
  return dayjs(date).startOf('day');
};

/**
 * Get end of day
 */
export const endOfDay = (date?: DateInput): Dayjs => {
  return dayjs(date).endOf('day');
};

/**
 * Get start of week
 */
export const startOfWeek = (date?: DateInput): Dayjs => {
  return dayjs(date).startOf('week');
};

/**
 * Get end of week
 */
export const endOfWeek = (date?: DateInput): Dayjs => {
  return dayjs(date).endOf('week');
};

/**
 * Get start of month
 */
export const startOfMonth = (date?: DateInput): Dayjs => {
  return dayjs(date).startOf('month');
};

/**
 * Get end of month
 */
export const endOfMonth = (date?: DateInput): Dayjs => {
  return dayjs(date).endOf('month');
};

/**
 * Add time to date
 */
export const addTime = (date: DateInput, amount: number, unit: dayjs.ManipulateType): Dayjs => {
  return dayjs(date).add(amount, unit);
};

/**
 * Subtract time from date
 */
export const subtractTime = (date: DateInput, amount: number, unit: dayjs.ManipulateType): Dayjs => {
  return dayjs(date).subtract(amount, unit);
};

/**
 * Check if date is between two dates
 */
export const isDateBetween = (date: DateInput, start: DateInput, end: DateInput, unit?: dayjs.OpUnitType): boolean => {
  return dayjs(date).isBetween(start, end, unit);
};

/**
 * Get difference between dates
 */
export const getDifference = (date1: DateInput, date2: DateInput, unit: dayjs.QUnitType = 'day'): number => {
  return dayjs(date1).diff(date2, unit);
};

/**
 * Parse date string
 */
export const parseDate = (dateString: string, format?: string): Dayjs => {
  return dayjs(dateString, format);
};

/**
 * Convert to UTC
 */
export const toUTC = (date: DateInput): Dayjs => {
  return dayjs(date).utc();
};

/**
 * Convert from UTC to local timezone
 */
export const fromUTC = (date: DateInput): Dayjs => {
  return dayjs.utc(date).local();
};

/**
 * Convert to timezone
 */
export const toTimezone = (date: DateInput, timezone: string): Dayjs => {
  return dayjs(date).tz(timezone);
};

/**
 * Get current timezone
 */
export const getCurrentTimezone = (): string => {
  return dayjs.tz.guess();
};

/**
 * Format for API (ISO string)
 */
export const formatForAPI = (date: DateInput): string => {
  return dayjs(date).toISOString();
};

/**
 * Format for input[type="date"]
 */
export const formatForDateInput = (date: DateInput): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Format for input[type="datetime-local"]
 */
export const formatForDateTimeInput = (date: DateInput): string => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
};

/**
 * Get age from birth date
 */
export const getAge = (birthDate: DateInput): number => {
  return dayjs().diff(birthDate, 'year');
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: DateInput): boolean => {
  return dayjs(date).isValid();
};

/**
 * Get Thai day name
 */
export const getThaiDayName = (date: DateInput): string => {
  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return dayNames[dayjs(date).day()];
};

/**
 * Get Thai month name
 */
export const getThaiMonthName = (date: DateInput): string => {
  const monthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];
  return monthNames[dayjs(date).month()];
};

// Export dayjs instance for advanced usage
export { dayjs };
