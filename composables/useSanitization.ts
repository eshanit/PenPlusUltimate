/**
 * Input Sanitization Composable
 * Provides utilities for sanitizing user input to prevent XSS attacks
 */
import DOMPurify from 'dompurify'

// Default DOMPurify configuration for safe HTML
const defaultConfig: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'],
  ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
}

/**
 * Composable for sanitizing user input
 * @returns Object containing sanitization functions
 */
export const useSanitization = () => {
  /**
   * Sanitize a string to prevent XSS attacks
   * @param input - The input string to sanitize
   * @param config - Optional custom DOMPurify configuration
   * @returns Sanitized string safe for rendering
   */
  const sanitize = (input: string, config?: DOMPurify.Config): string => {
    if (!input || typeof input !== 'string') {
      return ''
    }
    const mergedConfig = { ...defaultConfig, ...config }
    return DOMPurify.sanitize(input, mergedConfig)
  }

  /**
   * Sanitize HTML for rich text content
   * @param html - The HTML string to sanitize
   * @returns Sanitized HTML string
   */
  const sanitizeHtml = (html: string): string => {
    return sanitize(html, {
      ...defaultConfig,
      KEEP_CONTENT: true,
    })
  }

  /**
   * Strip all HTML tags and return plain text
   * @param html - The HTML string to strip
   * @returns Plain text without HTML tags
   */
  const stripHtml = (html: string): string => {
    if (!html || typeof html !== 'string') {
      return ''
    }
    return DOMPurify.sanitize(html, { SAFE_FOR_JQUERY: true })
      .replace(/<[^>]*>/g, '')
      .trim()
  }

  /**
   * Validate that a string contains no dangerous content
   * @param input - The input string to validate
   * @returns True if the input is safe
   */
  const isSafe = (input: string): boolean => {
    if (!input || typeof input !== 'string') {
      return true
    }
    const dirty = DOMPurify.sanitize(input, { RETURN_DIRTY: true })
    return dirty === input
  }

  /**
   * Sanitize an object recursively (useful for form data)
   * @param obj - The object to sanitize
   * @param fields - Optional list of fields to sanitize (if not provided, sanitizes all string fields)
   * @returns Sanitized object
   */
  const sanitizeObject = <T extends Record<string, any>>(
    obj: T,
    fields?: (keyof T)[]
  ): T => {
    if (!obj || typeof obj !== 'object') {
      return obj
    }

    const result = { ...obj }

    for (const key of Object.keys(result) as (keyof T)[]) {
      const value = result[key]

      // If fields list provided, only sanitize those fields
      if (fields && !fields.includes(key)) {
        continue
      }

      if (typeof value === 'string') {
        (result as any)[key] = sanitize(value)
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        (result as any)[key] = sanitizeObject(value)
      }
    }

    return result
  }

  /**
   * Escape special characters for safe display in HTML attributes
   * @param input - The input string to escape
   * @returns Escaped string safe for HTML attributes
   */
  const escapeHtmlAttr = (input: string): string => {
    if (!input || typeof input !== 'string') {
      return ''
    }
    const map: Record<string, string> = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#x27;',
      '/': '&#x2F;',
    }
    return input.replace(/[&<>"'/]/g, (char) => map[char] || char)
  }

  return {
    sanitize,
    sanitizeHtml,
    stripHtml,
    isSafe,
    sanitizeObject,
    escapeHtmlAttr,
  }
}
