# Email Configuration

## Overview

This folder contains all email-related functionality for contact forms.

## Files

- `config.ts` - Client-specific email settings (UPDATE THIS for each client)
- `templates.ts` - HTML email templates
- `resend.ts` - Resend API integration
- `index.ts` - Module exports

## Configuration

To update email settings for this client:

1. Edit `config.ts`
2. Update:
   - `recipientEmail` - Where emails are sent
   - `clientName` - Business name
   - `websiteDomain` - Website domain
   - `brandColor` - Primary brand color (hex)

## Current Configuration

- **Client:** Victoria Park Nails & Spa
- **Email:** calgaryvpark@gmail.com
- **Domain:** vpnail.com
- **Brand Color:** #d4a5a5 (Pink/Rose)

## Customizing Email Template

To customize the email template:

1. Edit `templates.ts`
2. Modify HTML structure in `generateContactEmail()`
3. Colors are controlled by `brandColor` in config

## Testing

Test contact form locally:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## Environment Variables

Required in `.env.local`:

```
RESEND_API_KEY=re_B92VwMgd_EuL15shpHfnMHGYXGWsYVhPW
```

## Resend Dashboard

View sent emails: https://resend.com/emails

Account: info@zss.ca
