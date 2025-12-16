import validator from 'validator';
import { isEmpty, isString, isNumber, isArray, isObject } from 'lodash';

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmptyValue = (value: unknown): boolean => {
  return isEmpty(value);
};

/**
 * Check if value is not empty
 */
export const isNotEmptyValue = (value: unknown): boolean => {
  return !isEmpty(value);
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

/**
 * Validate Thai mobile phone number
 */
export const isValidThaiMobile = (mobile: string): boolean => {
  // Remove all non-digit characters
  const cleaned = mobile.replace(/\D/g, '');

  // Check if it's a valid Thai mobile number (08x, 09x, 06x)
  const thaiMobileRegex = /^(08|09|06)\d{8}$/;
  return thaiMobileRegex.test(cleaned);
};

/**
 * Validate Thai phone number (both landline and mobile)
 */
export const isValidThaiPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');

  // Mobile: 08x, 09x, 06x (10 digits)
  // Landline: 0x (9 digits)
  const mobileRegex = /^(08|09|06)\d{8}$/;
  const landlineRegex = /^0[2-7]\d{7}$/;

  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
};

/**
 * Validate Thai ID card number
 */
export const isValidThaiIdCard = (idCard: string): boolean => {
  const cleaned = idCard.replace(/\D/g, '');

  if (cleaned.length !== 13) return false;

  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleaned[12]);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string,
): {
  isValid: boolean;
  score: number;
  issues: string[];
} => {
  const issues: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    issues.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    issues.push('ต้องมีตัวอักษรภาษาอังกฤษตัวเล็ก');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    issues.push('ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    issues.push('ต้องมีตัวเลข');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    issues.push('ควรมีอักขระพิเศษเพื่อความปลอดภัย');
  }

  if (password.length >= 12) {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    issues,
  };
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  return validator.isURL(url);
};

/**
 * Validate credit card number
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  return validator.isCreditCard(cleaned);
};

/**
 * Validate UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  return validator.isUUID(uuid);
};

/**
 * Validate date string
 */
export const isValidDate = (date: string): boolean => {
  return validator.isDate(date);
};

/**
 * Validate numeric string
 */
export const isValidNumeric = (value: string): boolean => {
  return validator.isNumeric(value);
};

/**
 * Validate alpha (letters only)
 */
export const isValidAlpha = (value: string): boolean => {
  return validator.isAlpha(value);
};

/**
 * Validate alphanumeric
 */
export const isValidAlphanumeric = (value: string): boolean => {
  return validator.isAlphanumeric(value);
};

/**
 * Validate length range
 */
export const isValidLength = (value: string, min: number, max?: number): boolean => {
  return validator.isLength(value, { min, max });
};

/**
 * Validate IP address
 */
export const isValidIP = (ip: string): boolean => {
  return validator.isIP(ip);
};

/**
 * Validate MAC address
 */
export const isValidMACAddress = (mac: string): boolean => {
  return validator.isMACAddress(mac);
};

/**
 * Validate JSON string
 */
export const isValidJSON = (json: string): boolean => {
  return validator.isJSON(json);
};

/**
 * Validate base64 string
 */
export const isValidBase64 = (base64: string): boolean => {
  return validator.isBase64(base64);
};

/**
 * Validate hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return validator.isHexColor(color);
};

/**
 * Thai business registration number validation
 */
export const isValidThaiBusinessRegistration = (regNumber: string): boolean => {
  const cleaned = regNumber.replace(/\D/g, '');

  if (cleaned.length !== 13) return false;

  // Business registration number validation algorithm
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(cleaned[i]);
    const product = digit * weights[i];
    sum += product > 9 ? Math.floor(product / 10) + (product % 10) : product;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleaned[12]);
};

/**
 * Thai tax ID validation
 */
export const isValidThaiTaxId = (taxId: string): boolean => {
  const cleaned = taxId.replace(/\D/g, '');

  if (cleaned.length !== 13) return false;

  // Same algorithm as Thai ID card
  return isValidThaiIdCard(cleaned);
};

/**
 * File type validation
 */
export const isValidFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

/**
 * File size validation (in bytes)
 */
export const isValidFileSize = (fileSize: number, maxSize: number): boolean => {
  return fileSize <= maxSize;
};

/**
 * Image file validation
 */
export const isValidImageFile = (fileName: string): boolean => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return isValidFileType(fileName, imageTypes);
};

/**
 * Document file validation
 */
export const isValidDocumentFile = (fileName: string): boolean => {
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  return isValidFileType(fileName, documentTypes);
};

/**
 * Username validation (alphanumeric with underscore and dash)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Strong password validation with custom rules
 */
export const isStrongPassword = (password: string): boolean => {
  const { isValid } = validatePasswordStrength(password);
  return isValid;
};

/**
 * Sanitize HTML input
 */
export const sanitizeHtml = (input: string): string => {
  return validator.escape(input);
};

/**
 * Normalize email
 */
export const normalizeEmail = (email: string): string => {
  return validator.normalizeEmail(email) || email;
};

/**
 * Validate array of values
 */
export const validateArray = <T>(array: T[], validator: (item: T) => boolean): boolean => {
  return isArray(array) && array.every(validator);
};

/**
 * Validate object structure
 */
export const validateObjectStructure = (
  obj: unknown,
  requiredFields: string[],
): { isValid: boolean; missingFields: string[] } => {
  if (!isObject(obj) || obj === null) {
    return { isValid: false, missingFields: requiredFields };
  }

  const missingFields = requiredFields.filter((field) => !(field in (obj as Record<string, unknown>)));

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Validate enum value
 */
export const isValidEnumValue = <T>(value: unknown, enumObject: Record<string, T>): value is T => {
  return Object.values(enumObject).includes(value as T);
};

/**
 * Validate age (from birth date)
 */
export const isValidAge = (birthDate: string | Date, minAge = 0, maxAge = 150): boolean => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  return age >= minAge && age <= maxAge;
};

/**
 * Validate date range
 */
export const isValidDateRange = (startDate: string | Date, endDate: string | Date): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return start <= end;
};

// Export validator instance for advanced usage
export { validator };
