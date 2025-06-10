import DOMPurify from 'dompurify';

/**
 * Security-focused content sanitization utilities
 * Uses DOMPurify to prevent XSS attacks and ensure safe content handling
 */

// Configuration for input sanitization (strips all HTML)
const INPUT_SANITIZE_CONFIG = {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Keep text content, just remove tags
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe', 'style'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'style']
};

// Configuration for display sanitization (allows safe HTML for syntax highlighting)
const DISPLAY_SANITIZE_CONFIG = {
    ALLOWED_TAGS: ['span', 'div', 'code', 'pre', 'br'], // Allow basic formatting for syntax highlighting
    ALLOWED_ATTR: ['class'], // Allow classes for highlighting, but not style attributes
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe', 'style', 'link'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'style', 'href', 'src']
};

/**
 * Sanitize user input content (strips all HTML but preserves JSON-safe text)
 * Use this for sanitizing content before storage or API calls
 * @param {string} content - The content to sanitize
 * @returns {string} - Sanitized content with all HTML stripped
 */
export const sanitizeInput = (content) => {
    if (typeof content !== 'string') return '';
    
    // First, sanitize with DOMPurify to remove dangerous content
    const sanitized = DOMPurify.sanitize(content, INPUT_SANITIZE_CONFIG);
    
    // Return the sanitized content (DOMPurify handles text extraction safely)
    return sanitized;
};

/**
 * Sanitize content for safe display (allows limited HTML for syntax highlighting)
 * Use this for sanitizing highlighted code before rendering
 * @param {string} content - The content to sanitize
 * @returns {string} - Sanitized content safe for display
 */
export const sanitizeForDisplay = (content) => {
    if (typeof content !== 'string') return '';
    return DOMPurify.sanitize(content, DISPLAY_SANITIZE_CONFIG);
};

/**
 * Sanitize plain text content (ultra-strict, text only)
 * Use this for content that should never contain any markup
 * @param {string} content - The content to sanitize
 * @returns {string} - Plain text only
 */
export const sanitizePlainText = (content) => {
    if (typeof content !== 'string') return '';
    return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
        FORBID_SCRIPT: true,
        FORBID_TAGS: [],
        FORBID_ATTR: []
    });
};

/**
 * Validate and sanitize paste ID
 * @param {string} id - The paste ID to validate
 * @returns {string|null} - Sanitized ID or null if invalid
 */
export const sanitizePasteId = (id) => {
    if (typeof id !== 'string') return null;
    const sanitized = DOMPurify.sanitize(id, INPUT_SANITIZE_CONFIG);
    // Additional validation for paste ID format
    return /^[a-zA-Z0-9_-]{1,50}$/.test(sanitized) ? sanitized : null;
};

/**
 * Configure DOMPurify hooks for additional security
 */
DOMPurify.addHook('beforeSanitizeElements', (node) => {
    // Remove any script-like content
    if (node.tagName && node.tagName.toLowerCase() === 'script') {
        node.remove();
    }
});

DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
    // Remove any attributes that start with 'on' (event handlers)
    if (node.attributes && node.attributes.length > 0) {
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
            if (attr.name.toLowerCase().startsWith('on')) {
                node.removeAttribute(attr.name);
            }
        });
    }
});

const sanitizerUtils = {
    sanitizeInput,
    sanitizeForDisplay,
    sanitizePlainText,
    sanitizePasteId
};

export default sanitizerUtils;
