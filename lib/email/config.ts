/**
 * Client Email Configuration
 *
 * Update these values for each client:
 * - recipientEmail: Where contact form emails are sent
 * - clientName: Client business name
 * - websiteDomain: Client website domain
 * - brandColor: Primary brand color for email styling
 */

export const emailConfig = {
  // Client Information
  recipientEmail: 'calgaryvpark@gmail.com',
  clientName: 'Victoria Park Nails & Spa',
  websiteDomain: 'vpnail.com',

  // Email Settings
  fromEmail: 'contact@zss.ca',
  fromName: 'Victoria Park Nails Contact',

  // Branding
  brandColor: '#d4a5a5', // Pink/Rose color

  // Optional: BCC yourself for monitoring
  bccEmail: 'info@zss.ca',
} as const;

// Export type for TypeScript
export type EmailConfig = typeof emailConfig;
