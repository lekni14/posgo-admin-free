// Date utilities (tree-shakeable exports)
export {
  formatDate,
  formatDateTime,
  parseDate,
  isValidDate,
  formatDateBE,
  formatDateDisplay,
  getRelativeTime,
  getTimeAgo,
  isToday,
  isYesterday,
  addTime,
  subtractTime,
  getDifference,
  formatForAPI,
  getThaiDayName,
  getThaiMonthName,
} from './date';

// Number utilities (tree-shakeable exports)
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  parseNumber,
  formatFileSize,
  formatThaiAbbreviated,
  randomBetween,
  roundTo,
  clamp,
} from './number';

// Hydration utilities (tree-shakeable exports)
export {
  hasExtensionAttributes,
  cleanExtensionAttributes,
  createExtensionObserver,
  isClientSide,
  isHydrated,
  logHydrationWarning,
  withHydrationFallback,
  shouldSuppressHydrationWarning,
} from './hydration.utils';

// Color utilities (tree-shakeable exports)
export {
  semanticColors,
  getStatusColors,
  getStatusClassName,
  getAlertClassName,
  getBadgeClassName,
  getIconColor,
  getProgressColor,
  getHttpStatusColor,
  getResponseTimeColor,
  getRoleTypeColor,
  getSessionStatusColor,
  getSessionBadgeColor,
} from './colors';

// Validation utilities
export {
  isEmptyValue,
  isNotEmptyValue,
  isValidEmail,
  isValidThaiMobile,
  isValidThaiPhone,
  isValidThaiIdCard,
  validatePasswordStrength,
  isValidUrl,
  isValidCreditCard,
  isValidUUID,
  isValidDate as isValidDateString, // Rename to avoid conflict
  isValidNumeric,
  isValidAlpha,
  isValidAlphanumeric,
  isValidLength,
  isValidIP,
  isValidMACAddress,
  isValidJSON,
  isValidBase64,
  isValidHexColor,
  isValidThaiBusinessRegistration,
  isValidThaiTaxId,
  isValidFileType,
  isValidFileSize,
  isValidImageFile,
  isValidDocumentFile,
  isValidUsername,
  isStrongPassword,
  sanitizeHtml,
  normalizeEmail,
  validateArray,
  validateObjectStructure,
  isValidEnumValue,
  isValidAge,
  isValidDateRange,
} from './validation';

// Error parsing utilities (tree-shakeable exports)
export { parseErrorMessage, isNetworkError, isAuthError, isForbiddenError } from './error-parser';

// Lodash utilities (commonly used functions)
export {
  // Array utilities
  chunk,
  compact,
  difference,
  intersection,
  union,
  uniq,
  uniqBy,
  flatten,
  groupBy,
  sortBy,
  orderBy,
  shuffle,
  sample,

  // Object utilities
  pick,
  omit,
  merge,
  cloneDeep,
  get,
  set,
  has,
  keys,
  values,
  entries,
  assign,
  defaults,

  // String utilities
  camelCase,
  kebabCase,
  snakeCase,
  startCase,
  upperFirst,
  lowerFirst,
  capitalize,
  deburr,
  escape,
  unescape,
  truncate,
  pad,
  padStart,
  padEnd,
  trim,
  trimStart,
  trimEnd,

  // Function utilities
  debounce,
  throttle,
  delay,

  // Type checking utilities
  isArray,
  isObject,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isDate,
  isNull,
  isUndefined,
  isEmpty,
  isEqual,

  // Math utilities
  sum,
  mean,
  min,
  max,
  random,
  range,

  // Collection utilities
  forEach,
  map,
  filter,
  find,
  findIndex,
  reduce,
  some,
  every,
  includes,
  size,
} from 'lodash';

// Re-export commonly used external libraries
export { default as axios } from 'axios';
export { default as dayjs } from 'dayjs';
export { default as numeral } from 'numeral';
export { default as validator } from 'validator';
