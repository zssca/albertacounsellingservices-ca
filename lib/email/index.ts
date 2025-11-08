/**
 * Email Module
 *
 * Centralized email functionality for contact forms
 * All email-related code is in lib/email/ for easy management
 */

export { emailConfig } from './config';
export { sendContactFormEmail, isValidEmail, sanitizeInput } from './resend';
export { generateContactEmail, generateContactEmailText } from './templates';
