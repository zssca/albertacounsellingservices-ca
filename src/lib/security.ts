/**
 * Advanced Security Utilities
 * Input sanitization, CSP management, and security headers
 */

import DOMPurify from 'isomorphic-dompurify';

// XSS Protection
type PurifyConfig = NonNullable<Parameters<typeof DOMPurify.sanitize>[1]>;

export function sanitizeHTML(html: string, options?: Partial<PurifyConfig>): string {
  const defaultConfig: Partial<PurifyConfig> = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  };

  const merged = { ...(defaultConfig as object), ...(options as object) } as PurifyConfig;

  return DOMPurify.sanitize(html, merged);
}

// Input validation schemas
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  alphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  noSpecialChars: (value: string): boolean => {
    return /^[a-zA-Z0-9\s\-\_]+$/.test(value);
  },
};

// SQL Injection prevention
export function escapeSQLString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

// CSRF Token management
class CSRFManager {
  private static instance: CSRFManager;
  private token: string | null = null;

  private constructor() {
    this.generateToken();
  }

  static getInstance(): CSRFManager {
    if (!CSRFManager.instance) {
      CSRFManager.instance = new CSRFManager();
    }
    return CSRFManager.instance;
  }

  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return this.token;
  }

  getToken(): string {
    if (!this.token) {
      this.generateToken();
    }
    return this.token!;
  }

  validateToken(token: string): boolean {
    return token === this.token;
  }

  refreshToken(): string {
    return this.generateToken();
  }
}

export const csrf = CSRFManager.getInstance();

// Content Security Policy builder
export class CSPBuilder {
  private directives: Map<string, Set<string>> = new Map();

  constructor() {
    // Default secure policy
    this.addDirective('default-src', "'self'");
    this.addDirective('script-src', "'self'", "'unsafe-inline'", "'unsafe-eval'");
    this.addDirective('style-src', "'self'", "'unsafe-inline'");
    this.addDirective('img-src', "'self'", 'data:', 'https:');
    this.addDirective('font-src', "'self'");
    this.addDirective('object-src', "'none'");
    this.addDirective('base-uri', "'self'");
    this.addDirective('form-action', "'self'");
    this.addDirective('frame-ancestors', "'none'");
    this.addDirective('upgrade-insecure-requests', '');
  }

  addDirective(directive: string, ...sources: string[]): this {
    if (!this.directives.has(directive)) {
      this.directives.set(directive, new Set());
    }
    sources.forEach(source => this.directives.get(directive)!.add(source));
    return this;
  }

  removeDirective(directive: string): this {
    this.directives.delete(directive);
    return this;
  }

  build(): string {
    return Array.from(this.directives.entries())
      .map(([directive, sources]) => {
        const sourceList = Array.from(sources).join(' ');
        return sourceList ? `${directive} ${sourceList}` : directive;
      })
      .join('; ');
  }

  toMetaTag(): string {
    return `<meta http-equiv="Content-Security-Policy" content="${this.build()}">`;
  }
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    // Cleanup old identifiers periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Secure headers configuration
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length < 8) feedback.push('Password should be at least 8 characters long');

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Common patterns to avoid
  if (/^[a-zA-Z]+$/.test(password)) feedback.push('Add numbers or special characters');
  if (/^[0-9]+$/.test(password)) feedback.push('Add letters and special characters');
  if (/(.)\1{2,}/.test(password)) feedback.push('Avoid repeating characters');
  if (/^(password|12345678|qwerty)/i.test(password)) {
    score = 0;
    feedback.push('This password is too common');
  }

  return { score: Math.min(score, 5), feedback };
}

// Export utilities
export const security = {
  sanitizeHTML,
  validators,
  escapeSQLString,
  csrf,
  CSPBuilder,
  RateLimiter,
  securityHeaders,
  checkPasswordStrength,
};