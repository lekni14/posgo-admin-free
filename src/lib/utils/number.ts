import numeral from 'numeral';

// Thai number formatting locale
numeral.register('locale', 'th', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'พัน',
    million: 'ล้าน',
    billion: 'พันล้าน',
    trillion: 'ล้านล้าน',
  },
  ordinal: (number: number) => {
    return 'ที่ ' + number;
  },
  currency: {
    symbol: '฿',
  },
});

// Set default locale to Thai
numeral.locale('th');

export type NumberInput = number | string;

/**
 * Format number with commas
 */
export const formatNumber = (value: NumberInput, format = '0,0'): string => {
  return numeral(value).format(format);
};

/**
 * Format as currency (Thai Baht)
 */
export const formatCurrency = (value: NumberInput, decimals = 2): string => {
  const format = decimals > 0 ? `฿0,0.${'0'.repeat(decimals)}` : '฿0,0';
  return numeral(value).format(format);
};

/**
 * Format as percentage
 */
export const formatPercentage = (value: NumberInput, decimals = 1): string => {
  const format = decimals > 0 ? `0,0.${'0'.repeat(decimals)}%` : '0,0%';
  return numeral(value).format(format);
};

/**
 * Format with abbreviations (e.g., 1K, 1M)
 */
export const formatAbbreviated = (value: NumberInput, decimals = 1): string => {
  const format = decimals > 0 ? `0.${'0'.repeat(decimals)}a` : '0a';
  return numeral(value).format(format);
};

/**
 * Format with Thai abbreviations
 */
export const formatThaiAbbreviated = (value: NumberInput, decimals = 1): string => {
  const num = Number(value);

  if (num >= 1_000_000_000_000) {
    return `${formatNumber(num / 1_000_000_000_000, `0.${'0'.repeat(decimals)}`)} ล้านล้าน`;
  } else if (num >= 1_000_000_000) {
    return `${formatNumber(num / 1_000_000_000, `0.${'0'.repeat(decimals)}`)} พันล้าน`;
  } else if (num >= 1_000_000) {
    return `${formatNumber(num / 1_000_000, `0.${'0'.repeat(decimals)}`)} ล้าน`;
  } else if (num >= 1_000) {
    return `${formatNumber(num / 1_000, `0.${'0'.repeat(decimals)}`)} พัน`;
  } else {
    return formatNumber(num, '0,0');
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: NumberInput, decimals = 1): string => {
  const format = decimals > 0 ? `0.${'0'.repeat(decimals)}b` : '0b';
  return numeral(bytes).format(format);
};

/**
 * Format ordinal numbers (1st, 2nd, 3rd, etc.)
 */
export const formatOrdinal = (value: NumberInput): string => {
  return numeral(value).format('0o');
};

/**
 * Format duration in seconds to human readable
 */
export const formatDuration = (seconds: NumberInput): string => {
  const num = Number(seconds);

  if (num < 60) {
    return `${Math.round(num)} วินาที`;
  } else if (num < 3600) {
    const minutes = Math.floor(num / 60);
    const remainingSeconds = Math.round(num % 60);
    return remainingSeconds > 0 ? `${minutes} นาที ${remainingSeconds} วินาที` : `${minutes} นาที`;
  } else if (num < 86400) {
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    return minutes > 0 ? `${hours} ชั่วโมง ${minutes} นาที` : `${hours} ชั่วโมง`;
  } else {
    const days = Math.floor(num / 86400);
    const hours = Math.floor((num % 86400) / 3600);
    return hours > 0 ? `${days} วัน ${hours} ชั่วโมง` : `${days} วัน`;
  }
};

/**
 * Format score or rating
 */
export const formatScore = (value: NumberInput, maxValue = 5, decimals = 1): string => {
  const format = decimals > 0 ? `0.${'0'.repeat(decimals)}` : '0';
  return `${numeral(value).format(format)}/${maxValue}`;
};

/**
 * Parse number from string
 */
export const parseNumber = (value: string): number => {
  const parsed = numeral(value).value();
  return parsed !== null ? parsed : 0;
};

/**
 * Convert string to number safely
 */
export const toNumber = (value: NumberInput): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Check if value is a valid number
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Round to specific decimal places
 */
export const roundTo = (value: NumberInput, decimals = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(Number(value) * multiplier) / multiplier;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: NumberInput, total: NumberInput): number => {
  const num = Number(value);
  const totalNum = Number(total);

  if (totalNum === 0) return 0;
  return (num / totalNum) * 100;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: NumberInput, newValue: NumberInput): number => {
  const old = Number(oldValue);
  const newNum = Number(newValue);

  if (old === 0) return newNum === 0 ? 0 : 100;
  return ((newNum - old) / old) * 100;
};

/**
 * Generate random number between min and max
 */
export const randomBetween = (min: number, max: number, decimals = 0): number => {
  const random = Math.random() * (max - min) + min;
  return decimals > 0 ? roundTo(random, decimals) : Math.floor(random);
};

/**
 * Sum array of numbers
 */
export const sum = (numbers: NumberInput[]): number => {
  return numbers.reduce<number>((acc, num) => acc + Number(num), 0);
};

/**
 * Calculate average
 */
export const average = (numbers: NumberInput[]): number => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

/**
 * Find minimum value
 */
export const min = (numbers: NumberInput[]): number => {
  return Math.min(...numbers.map((n) => Number(n)));
};

/**
 * Find maximum value
 */
export const max = (numbers: NumberInput[]): number => {
  return Math.max(...numbers.map((n) => Number(n)));
};

/**
 * Format number range
 */
export const formatRange = (min: NumberInput, max: NumberInput, format = '0,0'): string => {
  return `${numeral(min).format(format)} - ${numeral(max).format(format)}`;
};

/**
 * Thai number to text (for small numbers)
 */
export const numberToThaiText = (num: number): string => {
  const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const teens = ['สิบ', 'สิบเอ็ด', 'สิบสอง', 'สิบสาม', 'สิบสี่', 'สิบห้า', 'สิบหก', 'สิบเจ็ด', 'สิบแปด', 'สิบเก้า'];
  const tens = ['', '', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ'];

  if (num === 0) return 'ศูนย์';
  if (num < 0) return 'ลบ' + numberToThaiText(-num);
  if (num >= 100) return formatNumber(num); // Use numeral for larger numbers

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? ones[one] : '');
  }

  return formatNumber(num);
};

// Export numeral instance for advanced usage
export { numeral };
