// API Configuration and Security
import { sanitizeInput as sanitizeInputUtil, sanitizeForDisplay as sanitizeForDisplayUtil } from '../utils/sanitizer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const MAX_CONTENT_LENGTH = 1048576; // 1MB
const API_TIMEOUT = 30000; // 30 seconds

// Security headers for requests
const getSecureHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache'
});

// Input sanitization with centralized utility
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    // First trim and limit length
    const trimmed = input.trim().substring(0, MAX_CONTENT_LENGTH);
    // Then sanitize with centralized utility
    return sanitizeInputUtil(trimmed);
};

// Sanitize content for display (allows safe HTML for syntax highlighting)
export const sanitizeForDisplay = (content) => {
    if (typeof content !== 'string') return '';
    return sanitizeForDisplayUtil(content);
};

// Validate paste ID format
export const isValidPasteId = (id) => {
    return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,50}$/.test(id);
};

// API request wrapper with timeout and error handling
const apiRequest = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...getSecureHeaders(),
                ...options.headers
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }
        throw error;
    }
};

// API functions
export const createPaste = async (content, language, password, expiration) => {
    const sanitizedContent = sanitizeInput(content);
    
    if (!sanitizedContent) {
        throw new Error('Content cannot be empty');
    }

    if (sanitizedContent.length > MAX_CONTENT_LENGTH) {
        throw new Error('Content too large (max 1MB)');
    }

    return await apiRequest('/api/pastes', {
        method: 'POST',
        body: JSON.stringify({
            content: sanitizedContent,
            language: language || 'plaintext',
            password: password || null,
            expiration: expiration === 'never' ? null : expiration
        })
    });
};

export const getPaste = async (id) => {
    if (!isValidPasteId(id)) {
        throw new Error('Invalid paste ID format');
    }

    return await apiRequest(`/api/pastes/${id}`);
};

export const verifyPaste = async (id, password) => {
    if (!isValidPasteId(id)) {
        throw new Error('Invalid paste ID format');
    }

    if (!password || password.length > 128) {
        throw new Error('Invalid password');
    }

    return await apiRequest(`/api/pastes/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ password })
    });
};

export const deletePaste = async (id, deleteToken) => {
    if (!isValidPasteId(id)) {
        throw new Error('Invalid paste ID format');
    }

    if (!deleteToken) {
        throw new Error('Delete token required');
    }

    return await apiRequest(`/api/pastes/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ deleteToken })
    });
};

export const checkHealth = async () => {
    return await apiRequest('/api/health');
};
