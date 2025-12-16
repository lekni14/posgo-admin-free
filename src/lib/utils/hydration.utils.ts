/**
 * Hydration Utilities - เครื่องมือจัดการปัญหา hydration
 */

/**
 * รายการ attributes ที่มักเกิดจาก browser extensions และอาจทำให้เกิด hydration mismatch
 */
const KNOWN_EXTENSION_ATTRIBUTES = [
  'cz-shortcut-listen', // ClickToPlugin
  'data-new-gr-c-s-check-loaded', // Grammarly
  'data-gr-ext-installed', // Grammarly
  'spellcheck', // Browser spellcheck
  'data-ms-editor', // Microsoft Editor
  'data-clarity-mask', // Microsoft Clarity
  'data-reactroot', // React DevTools
  'data-testid', // Testing tools
  'style', // Dynamic styles from extensions
];

/**
 * ตรวจสอบว่า element มี attributes จาก browser extensions หรือไม่
 */
export function hasExtensionAttributes(element: Element): boolean {
  return KNOWN_EXTENSION_ATTRIBUTES.some((attr) => element.hasAttribute(attr));
}

/**
 * ลบ attributes ที่มาจาก browser extensions ออกจาก element
 * ใช้เมื่อต้องการทำความสะอาด DOM ก่อน hydration
 */
export function cleanExtensionAttributes(element: Element): void {
  KNOWN_EXTENSION_ATTRIBUTES.forEach((attr) => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });
}

/**
 * สร้าง observer สำหรับตรวจสอบการเปลี่ยนแปลง DOM จาก extensions
 */
export function createExtensionObserver(
  target: Element,
  callback?: (mutations: MutationRecord[]) => void,
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    const extensionMutations = mutations.filter((mutation) => {
      if (mutation.type === 'attributes') {
        const attrName = mutation.attributeName;
        return attrName && KNOWN_EXTENSION_ATTRIBUTES.includes(attrName);
      }
      return false;
    });

    if (extensionMutations.length > 0 && callback) {
      callback(extensionMutations);
    }
  });

  observer.observe(target, {
    attributes: true,
    attributeFilter: KNOWN_EXTENSION_ATTRIBUTES,
    subtree: true,
  });

  return observer;
}

/**
 * ตรวจสอบว่าเป็น client-side rendering หรือไม่
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * ตรวจสอบว่า hydration เสร็จสิ้นแล้วหรือไม่
 */
export function isHydrated(): boolean {
  if (!isClientSide()) return false;

  // ตรวจสอบจาก React DevTools หรือ React root element
  return (
    document.querySelector('[data-reactroot]') !== null ||
    document.querySelector('#__next') !== null ||
    document.querySelector('#root') !== null
  );
}

/**
 * สร้าง warning แบบปลอดภัยสำหรับ hydration issues
 */
export function logHydrationWarning(message: string, element?: Element): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Hydration Warning] ${message}`, element);
  }
}

/**
 * Wrapper function สำหรับจัดการ hydration mismatch อย่างปลอดภัย
 */
export function withHydrationFallback<T>(clientValue: () => T, serverValue: T, fallback?: T): T {
  if (!isClientSide()) {
    return serverValue;
  }

  try {
    return clientValue();
  } catch (error) {
    logHydrationWarning('Error during client-side calculation', error as any);
    return fallback ?? serverValue;
  }
}

/**
 * Hook สำหรับ suppress hydration warnings แบบมีเงื่อนไข
 */
export function shouldSuppressHydrationWarning(element?: Element): boolean {
  if (!element) return false;

  // Suppress ถ้าเป็น body element ที่มี extension attributes
  if (element.tagName?.toLowerCase() === 'body') {
    return hasExtensionAttributes(element);
  }

  return false;
}
