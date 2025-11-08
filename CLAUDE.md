# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## ⚠️ CRITICAL: PROJECT ARCHITECTURE

This document supports **TWO project types:**

### 🛑 OPTION 1: Pure SSG (100% Static, No Backend)
**All data comes from `.ts` files. NO database, NO API, NO server operations.**

```typescript
// CORRECT ARCHITECTURE FOR PURE SSG PROJECTS
export const dynamic = 'force-static'  // ✅ KEEP THIS
export const revalidate = false        // ✅ KEEP THIS
```

### 🔄 OPTION 2: SSG + Forms (Static + Minimal Server)
**Mostly static, with Server Actions ONLY for forms and email.**

```typescript
// Static pages still use:
export const dynamic = 'force-static'
export const revalidate = false

// Server Actions for forms ONLY
'use server'  // ✅ ONLY in features/[feature]/actions/*.action.ts
```

## 🎯 Project Type Benefits

Both types are optimized for:
- **Maximum Performance** (10-30ms load times for static content)
- **Perfect SEO** (Pre-rendered HTML)
- **Minimal Cost** ($0-5/month hosting for SSG, $5-20/month for SSG+Forms)
- **High Security** (Minimal attack surface)

## 📁 FILE ORGANIZATION PATTERN

### ✅ Feature Pattern (Pages)

```
features/
  [page-name]/
    sections/
      [section-name]/
        [section-name].tsx
        [section-name].data.ts
        [section-name].types.ts     ← section-specific types (optional)
        index.ts                    ← export component + data
    [page-name]-page.tsx
    [page-name].seo.ts              ← SEO metadata
    [page-name].types.ts            ← feature-wide types (optional)
    index.ts                        ← export page + sections
```

### ✅ Contact Form Feature Pattern (with Server Actions)

```
features/
  contact/
    sections/
      contact-form/
        contact-form.tsx            ← Form component with client interactivity
        contact-form.data.ts        ← Static form config (fields, labels, etc.)
        contact-form.types.ts       ← Form types
        index.ts
      contact-info/                 ← Optional: Display contact details
        contact-info.tsx
        contact-info.data.ts
        index.ts
    actions/
      send-email.action.ts          ← Server Action for form submission
    schemas/
      contact.schema.ts             ← Zod validation schema
    contact-page.tsx
    contact.seo.ts
    index.ts
```

### ✅ Global Config & Shared Data Pattern

```
lib/
  config/
    site.config.ts        ← Site-wide settings (name, URL, social links)
    nav.config.ts         ← Navigation structure
    seo.config.ts         ← Default SEO settings
    email.config.ts       ← Email templates config (if using Resend)
  constants/
    routes.ts             ← Route paths
    breakpoints.ts        ← Responsive breakpoints
    theme.ts              ← Theme constants (if not in CSS)
  types/
    global.types.ts       ← Truly global types used everywhere
  utils/
    helpers.ts            ← Utility functions
  validations/
    schemas.ts            ← Shared Zod schemas
```

### ✅ Shared Components Pattern

```
components/
  ui/                     ← shadcn/ui components (infrastructure)
    button.tsx
    input.tsx
    card.tsx
    form.tsx              ← Form primitives from shadcn
  layouts/                ← Layout components
    main-header.tsx
    main-footer.tsx
    page-wrapper.tsx
  shared/                 ← Reusable business components
    newsletter-form.tsx
    social-links.tsx
    logo.tsx
```

### ✅ Email Templates Pattern (Resend)

```
emails/
  templates/
    contact-confirmation.tsx       ← React Email template for user
    contact-notification.tsx       ← React Email template for admin
  styles/
    email-base.styles.ts          ← Shared email styles
  types/
    email.types.ts                ← Email-specific types
  index.ts                        ← Export all templates
```

### ✅ Server Actions Pattern

```
actions/
  email/
    send-contact-email.ts         ← Centralized email actions (if shared)
  forms/
    validate-submission.ts        ← Shared validation actions
  types/
    action-response.types.ts      ← Standard action response types
```

### ✅ Environment Variables Pattern

```
.env.local              ← Local development (not committed)
.env.example            ← Template for team (committed)

# .env.local structure:
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=admin@yourdomain.com
```

### Complete Examples

```
# Static Page Feature
features/home/
  sections/
    hero/
      hero.tsx
      hero.data.ts
      hero.types.ts       # Optional: types used only in hero section
      index.ts
  home-page.tsx
  home.seo.ts
  home.types.ts           # Optional: types shared across home feature
  index.ts

# Contact Form Feature (with Server Actions)
features/contact/
  sections/
    contact-form/
      contact-form.tsx
      contact-form.data.ts
      contact-form.types.ts
      index.ts
    contact-info/
      contact-info.tsx
      contact-info.data.ts
      index.ts
  actions/
    send-email.action.ts
  schemas/
    contact.schema.ts
  contact-page.tsx
  contact.seo.ts
  index.ts

# Email Templates
emails/
  templates/
    contact-confirmation.tsx
    contact-notification.tsx
  index.ts

# Global config/data
lib/
  config/
    site.config.ts        # { name: "My Site", url: "https://..." }
    nav.config.ts         # Navigation menu structure
    email.config.ts       # Email sender config
  constants/
    routes.ts             # { HOME: "/", ABOUT: "/about", CONTACT: "/contact" }
  types/
    global.types.ts       # Types used across multiple features
  validations/
    schemas.ts            # Shared Zod schemas

# Shared components
components/
  ui/
    button.tsx
    input.tsx
    form.tsx
  layouts/
    main-header.tsx
    main-footer.tsx
  shared/
    social-links.tsx
```

## 🎯 KEY PRINCIPLES

1. **Feature Folders**: Each page = one feature folder
2. **Sections Directory**: All sections under `sections/` folder
3. **Self-Contained**: Each section owns its component + data + types + exports
4. **Named Exports**: Section `index.ts` exports component AND data (types imported where needed)
5. **Page Naming**: `[page-name]-page.tsx` (e.g., `home-page.tsx`)
6. **SEO at Root**: `[page-name].seo.ts` at feature root (not in data folder)
7. **Types Co-located**:
   - Section types: `[section-name].types.ts` (section-specific only)
   - Feature types: `[page-name].types.ts` (shared across feature)
   - Global types: `lib/types/global.types.ts` (used everywhere)
8. **Config/Constants Centralized**: Site-wide config and constants in `lib/config/` and `lib/constants/`
9. **Barrel Exports**: Feature `index.ts` exports page + all sections
10. **Routes Render Features Only**: `app/page.tsx` should ONLY import and render the feature page component, nothing else
11. **Server Actions in Features**: When a feature needs server logic (forms), put actions in `[feature]/actions/`
12. **Email Templates Centralized**: All email templates in `emails/` (reusable across features)
13. **Validation Schemas Co-located**: Feature-specific schemas in feature folder, shared in `lib/validations/`

## 📝 IMPORT PATTERNS

### ✅ CORRECT

```typescript
// Section types (optional)
// features/home/sections/hero/hero.types.ts
export type HeroData = {
  title: string
  subtitle: string
  cta: { primary: string; secondary: string }
}

// Section data uses types
// features/home/sections/hero/hero.data.ts
import type { HeroData } from './hero.types'

export const heroData: HeroData = {
  title: "Welcome",
  subtitle: "To our site",
  cta: { primary: "Get Started", secondary: "Learn More" }
}

// Section exports component + data (NOT types)
// features/home/sections/hero/index.ts
export { HeroSection } from './hero'
export { heroData } from './hero.data'
// Note: Types are imported directly where needed, not re-exported

// Section component uses its own data and types
// features/home/sections/hero/hero.tsx
import { heroData } from './hero.data'
import type { HeroData } from './hero.types'

export function HeroSection() {
  return <div>{heroData.title}</div>
}

// Page composes sections
// features/home/home-page.tsx
import { HeroSection } from './sections/hero'
import { FeaturesSection } from './sections/features'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  )
}

// Route ONLY renders feature (minimal, clean)
// app/page.tsx
import { HomePage } from '@/features/home'
import { homeMetadata } from '@/features/home/home.seo'

export const metadata = homeMetadata
export default HomePage  // Just render the feature, nothing else

// Global config usage
// lib/config/site.config.ts
export const siteConfig = {
  name: "My Site",
  url: "https://mysite.com",
  description: "My awesome site",
  social: {
    twitter: "@mysite",
    github: "mysite"
  }
} as const

// Using global config in components
// components/layouts/main-header.tsx
import { siteConfig } from '@/lib/config/site.config'
import { ROUTES } from '@/lib/constants/routes'

export function MainHeader() {
  return (
    <header>
      <Link href={ROUTES.HOME}>{siteConfig.name}</Link>
    </header>
  )
}
```

### ❌ WRONG

```typescript
// ❌ App route doing too much (composing sections, adding logic)
// app/page.tsx
import { HeroSection, FeaturesSection } from '@/features/home'
export default function Page() {
  return (
    <>
      <HeroSection />  // ❌ Route should NOT compose sections
      <FeaturesSection />  // ❌ This belongs in feature page component
    </>
  )
}

// ❌ Sections at root level
features/home/hero/  // Should be: features/home/sections/hero/

// ❌ SEO in data folder
features/home/data/seo.data.ts  // Should be: features/home/home.seo.ts

// ❌ Section data centralized
features/home/data/hero.data.ts  // Should be: features/home/sections/hero/hero.data.ts

// ❌ Cross-section imports
import { heroData } from '../hero/hero.data'  // Each section uses only its own data

// ❌ Cross-feature imports
import { heroData } from '@/features/about/sections/hero/hero.data'

// ❌ Inline data
const heroData = { title: "..." }  // Should be in hero.data.ts

// ❌ Types in wrong location
features/home/types/hero.types.ts  // Should be: features/home/sections/hero/hero.types.ts

// ❌ Global types for section-specific data
lib/types/hero.types.ts  // Section types belong in section folder

// ❌ Config data in feature folders
features/home/config/site.config.ts  // Site config belongs in lib/config/

// ❌ Shared constants in section data
features/home/sections/hero/routes.ts  // Routes belong in lib/constants/

// ❌ Server Actions in centralized actions folder (when feature-specific)
actions/send-contact-email.ts  // Should be: features/contact/actions/send-email.action.ts

// ❌ Email templates in feature folders
features/contact/emails/confirmation.tsx  // Should be: emails/templates/contact-confirmation.tsx
```

## 📧 CONTACT FORM & RESEND INTEGRATION PATTERNS

### ✅ Contact Form Schema (Zod Validation)

```typescript
// features/contact/schemas/contact.schema.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

### ✅ Contact Form Data (Static Config)

```typescript
// features/contact/sections/contact-form/contact-form.data.ts
import type { ContactFormConfig } from './contact-form.types'

export const contactFormData: ContactFormConfig = {
  title: "Get in Touch",
  subtitle: "We'd love to hear from you",
  fields: {
    name: {
      label: "Name",
      placeholder: "John Doe",
      required: true,
    },
    email: {
      label: "Email",
      placeholder: "john@example.com",
      required: true,
    },
    subject: {
      label: "Subject",
      placeholder: "How can we help?",
      required: true,
    },
    message: {
      label: "Message",
      placeholder: "Tell us more...",
      required: true,
      rows: 5,
    },
  },
  submitButton: "Send Message",
  successMessage: "Thank you! We'll get back to you soon.",
  errorMessage: "Something went wrong. Please try again.",
}
```

### ✅ Contact Form Component (with Client Interactivity)

```typescript
// features/contact/sections/contact-form/contact-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { contactFormData } from './contact-form.data'
import { contactFormSchema, type ContactFormData } from '@/features/contact/schemas/contact.schema'
import { sendContactEmail } from '@/features/contact/actions/send-email.action'

export function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const result = await sendContactEmail(data)

    setIsSubmitting(false)

    if (result.success) {
      setSubmitStatus('success')
      form.reset()
    } else {
      setSubmitStatus('error')
    }
  }

  return (
    <section>
      <h2>{contactFormData.title}</h2>
      <p>{contactFormData.subtitle}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactFormData.fields.name.label}</FormLabel>
                <FormControl>
                  <Input placeholder={contactFormData.fields.name.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactFormData.fields.email.label}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={contactFormData.fields.email.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactFormData.fields.subject.label}</FormLabel>
                <FormControl>
                  <Input placeholder={contactFormData.fields.subject.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contactFormData.fields.message.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={contactFormData.fields.message.placeholder}
                    rows={contactFormData.fields.message.rows}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : contactFormData.submitButton}
          </Button>

          {submitStatus === 'success' && (
            <p className="text-green-600">{contactFormData.successMessage}</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-600">{contactFormData.errorMessage}</p>
          )}
        </form>
      </Form>
    </section>
  )
}
```

### ✅ Server Action (Resend Integration)

```typescript
// features/contact/actions/send-email.action.ts
'use server'

import { Resend } from 'resend'
import { contactFormSchema, type ContactFormData } from '../schemas/contact.schema'
import { ContactNotificationEmail } from '@/emails/templates/contact-notification'
import { ContactConfirmationEmail } from '@/emails/templates/contact-confirmation'
import { siteConfig } from '@/lib/config/site.config'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validate data
    const validatedData = contactFormSchema.parse(data)

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      react: ContactNotificationEmail({ ...validatedData }),
    })

    // Send confirmation to user
    const userEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: validatedData.email,
      subject: `We received your message - ${siteConfig.name}`,
      react: ContactConfirmationEmail({ name: validatedData.name }),
    })

    if (adminEmail.error || userEmail.error) {
      console.error('Email send error:', adminEmail.error || userEmail.error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Invalid form data' }
  }
}
```

### ✅ Email Templates (React Email + Resend)

```typescript
// emails/templates/contact-notification.tsx
import { Html, Head, Body, Container, Heading, Text, Section } from '@react-email/components'
import type { ContactFormData } from '@/features/contact/schemas/contact.schema'

export function ContactNotificationEmail(props: ContactFormData) {
  const { name, email, subject, message } = props

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>New Contact Form Submission</Heading>

          <Section>
            <Text><strong>Name:</strong> {name}</Text>
            <Text><strong>Email:</strong> {email}</Text>
            <Text><strong>Subject:</strong> {subject}</Text>
          </Section>

          <Section>
            <Text><strong>Message:</strong></Text>
            <Text>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// emails/templates/contact-confirmation.tsx
export function ContactConfirmationEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>Thank You for Contacting Us!</Heading>

          <Text>Hi {name},</Text>

          <Text>
            We've received your message and will get back to you as soon as possible.
          </Text>

          <Text>
            Best regards,<br />
            The Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### ✅ Environment Variables Setup

```bash
# .env.local
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=admin@yourdomain.com

# .env.example (committed to repo)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

### ✅ Package Installation

```bash
# Install required packages
npm install resend react-email @react-email/components
npm install zod react-hook-form @hookform/resolvers/zod
```

## 📏 FILE SIZE LIMITS

| File Type | Maximum | Action if Exceeded |
|-----------|---------|-------------------|
| Components | 150 lines | Split into smaller components |
| Page Components | 200 lines | Extract sections |
| Hooks | 80 lines | Split logic |
| Data Files | 500 lines | Organize into modules |
| Type Files | 200 lines | Split into feature/section types |
| Config Files | 300 lines | Split by concern (site, nav, seo, etc.) |
| Constants Files | 200 lines | Split by category |
| UI Components | No limit | Infrastructure files exempt |
| globals.css | No limit | Main CSS file exempt |

## ❌ SSG ANTI-PATTERNS - DO NOT DO

### 1. NO Server-Side Features
```typescript
// ❌ NEVER in SSG
'use server'
export const revalidate = 3600
export const dynamic = 'force-dynamic'
async function fetchData() {}
const data = await fetch()
```

### 2. NO These Directories
```
❌ app/api/          # NO API routes
❌ app/actions/      # NO Server Actions
❌ lib/db/           # NO database
❌ lib/repositories/ # NO data layer
❌ tailwind.config.* # Using Tailwind v4 CSS config
```

### 3. NO Dynamic Features
```typescript
// ❌ WRONG for SSG
const data = await fetch('/api/...')
<Suspense fallback={...}>
cookies().get()
headers()
```

## ✅ CORRECT SSG PATTERNS

### Data Management
```typescript
// ✅ Direct imports from .ts files
import { heroData } from './hero.data'

export function HeroSection() {
  return <div>{heroData.title}</div>
}
```

### Page Structure
```typescript
// ✅ Simple, static composition
export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
```

## 🔄 COMMON WORKFLOWS

### Adding a New Static Page
1. Create `features/[page-name]/`
2. Add `[page-name]-page.tsx`
3. Add `[page-name].seo.ts`
4. Add `index.ts` (export page component and metadata)
5. Create `sections/` folder
6. Add sections: `sections/[name]/[name].tsx`, `[name].data.ts`, `index.ts`
7. Compose sections in page component
8. Create route in `app/[page-name]/page.tsx`
9. Add route constant to `lib/constants/routes.ts`
10. Update navigation in `lib/config/nav.config.ts`

### Adding a Contact/Form Page
1. Create `features/contact/`
2. Create `sections/contact-form/` with component + data + types
3. Create `schemas/contact.schema.ts` for Zod validation
4. Create `actions/send-email.action.ts` for server logic
5. Add page component and SEO
6. Create email templates in `emails/templates/`
7. Set up environment variables (.env.local)
8. Install dependencies (resend, react-email, zod, react-hook-form)
9. Create route in `app/contact/page.tsx`

### Adding a New Section
1. Create `features/[page]/sections/[section-name]/`
2. Add `[section-name].tsx` (component)
3. Add `[section-name].data.ts` (data)
4. Add `[section-name].types.ts` (types - optional, only if needed)
5. Add `index.ts` (exports component + data, NOT types)
6. Import in page component

### Adding Email Templates
1. Create template in `emails/templates/[template-name].tsx`
2. Use React Email components (@react-email/components)
3. Define props interface
4. Export from `emails/index.ts`
5. Import in server action
6. Test with `npm run email:dev` (if configured)

### Adding Global Configuration
1. Identify if truly global (used in 3+ features)
2. Create config file in `lib/config/[name].config.ts`
3. Export as `const` with `as const` assertion
4. Import where needed using `@/lib/config/[name].config`

### Updating Content
- Edit `.data.ts` files in `features/[page]/sections/[section]/`
- Edit SEO in `features/[page]/[page].seo.ts`
- Edit global config in `lib/config/`
- Hot reload in dev, rebuild for production

### Setting Up Resend for a New Project
1. Sign up at resend.com and get API key
2. Verify your domain or use resend.dev for testing
3. Install packages: `npm install resend react-email @react-email/components`
4. Create `.env.local` with RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL
5. Create `.env.example` template (without values)
6. Create email templates in `emails/templates/`
7. Create server actions that use Resend
8. Test emails in development

## 🚨 RED FLAGS - STOP IF YOU SEE

### For Pure SSG Projects (No Forms)
1. Writing `'use server'` anywhere
2. Creating `/api` routes
3. Adding `async` to page components
4. Using `fetch()` for data in components
5. Setting up databases or auth
6. Using `revalidate` or ISR
7. Creating `tailwind.config.*` files (use Tailwind v4 CSS config)

### For SSG + Forms Projects (Minimal Server)
1. Server Actions outside `features/[feature]/actions/` (keep co-located)
2. Creating `/api` routes (use Server Actions instead)
3. Setting up databases (unless truly needed)
4. Using `revalidate` or ISR (stay static where possible)
5. Server logic in components (use Server Actions)

### Universal Red Flags (Both Types)
1. Components over 150 lines (except UI library)
2. Data files over 500 lines
3. Cross-feature imports
4. Centralized data folders
5. Types in wrong locations
6. Config/constants in feature folders
7. Email templates in feature folders

## 🎯 GOLDEN RULES

### Architecture Rules
1. **Static First**: Default to SSG. Only add server features when absolutely necessary (forms, email)
2. **Server Actions for Forms Only**: Use `'use server'` only in feature actions folders for form submissions
3. **All Content is Static**: Display data comes from `.ts` files at build time
4. **No Databases**: Unless you have a very specific need, keep it file-based
5. **API Routes are Banned**: Use Server Actions instead for any server logic

### Organization Rules
6. **Keep Components Small**: Maximum 150 lines per component (split if larger)
7. **Each Section Owns Its Data**: No centralized data folders, no cross-section imports
8. **SEO at Feature Root**: `[page].seo.ts` at feature level, not in sections
9. **All Sections Under sections/**: No sections at feature root level
10. **App Routes ONLY Render Features**: No composition, no logic in route files

### File Structure Rules
11. **Co-locate Everything**: Each section has its own component, data, types in one folder
12. **Types Follow Scope**: Section types in section folder, feature types in feature folder, global types in lib
13. **Config/Constants Centralized**: Site-wide settings in `lib/config/`, shared constants in `lib/constants/`
14. **Email Templates Centralized**: All email templates in `emails/` (reusable across features)
15. **Validation in Feature**: Feature-specific Zod schemas in feature folder

### Code Quality Rules
16. **Maximum 500 Lines per Data File**: Split into modules if exceeded
17. **Named Exports for Data**: Section `index.ts` exports component + data (types imported directly)
18. **Barrel Exports for Features**: Feature `index.ts` exports everything needed by routes
19. **TypeScript Strict Mode**: Always use TypeScript, no `any` types
20. **Data Typing**: All data objects must have explicit types

## 💡 THE SSG MANTRA

> **"Build once, serve everywhere, load instantly"**

This is primarily a **STATIC SITE** optimized for performance and SEO. All content is generated at build time from `.ts` files.

**Server Actions are allowed ONLY for:**
- Form submissions (contact, newsletter, etc.)
- Email sending (via Resend)
- Other minimal user interactions

**Server Actions are NOT for:**
- Fetching display data (use `.data.ts` files instead)
- Database queries (keep it file-based)
- Complex backend logic (wrong project type)

---

**When in doubt:**
- For content → Use `.data.ts` files (build time)
- For forms → Use Server Actions (runtime)
- For everything else → You probably don't need it

## 📋 PROJECT TYPE DECISION TREE

### Is this a Pure SSG Project?
✅ YES if:
- Only displays static information
- No user input/forms needed
- Content doesn't change frequently
- Maximum performance is priority

**THEN:** Follow SSG-only patterns, no server features

### Is this SSG + Forms?
✅ YES if:
- Mostly static content
- Needs contact/newsletter forms
- Occasional email sending
- Still wants great performance

**THEN:** Follow SSG patterns + add Server Actions for forms only

### Is this NOT a fit?
❌ NO if:
- Needs real-time data
- Requires authentication
- Heavy database usage
- Complex server logic

**THEN:** Consider Next.js with SSR/ISR or a different framework

## 🎨 ADDITIONAL FEATURE PATTERNS

### ✅ Blog/Articles Feature (Static Content)

```
features/
  blog/
    sections/
      article-list/
        article-list.tsx
        article-list.data.ts       ← List of all articles
        article-list.types.ts
        index.ts
      featured-article/
        featured-article.tsx
        featured-article.data.ts
        index.ts
    data/
      articles/
        article-1.data.ts          ← Individual article data
        article-2.data.ts
        index.ts                   ← Export all articles
    blog-page.tsx
    blog.seo.ts
    index.ts
```

### ✅ Pricing Feature

```
features/
  pricing/
    sections/
      pricing-tiers/
        pricing-tiers.tsx
        pricing-tiers.data.ts      ← All pricing plans
        pricing-tiers.types.ts
        index.ts
      pricing-faq/
        pricing-faq.tsx
        pricing-faq.data.ts        ← Pricing FAQs
        index.ts
      pricing-comparison/
        pricing-comparison.tsx
        pricing-comparison.data.ts ← Feature comparison table
        index.ts
    pricing-page.tsx
    pricing.seo.ts
    index.ts
```

### ✅ Portfolio/Projects Feature

```
features/
  portfolio/
    sections/
      project-grid/
        project-grid.tsx
        project-grid.data.ts       ← All projects
        project-grid.types.ts
        index.ts
      project-filters/
        project-filters.tsx
        project-filters.data.ts    ← Filter categories
        index.ts
    data/
      projects/
        project-1.data.ts          ← Individual project details
        project-2.data.ts
        index.ts
    portfolio-page.tsx
    portfolio.seo.ts
    index.ts
```

### ✅ Newsletter Feature (with Server Action)

```
features/
  newsletter/
    sections/
      newsletter-signup/
        newsletter-signup.tsx      ← Client form component
        newsletter-signup.data.ts  ← Static labels, copy
        newsletter-signup.types.ts
        index.ts
    actions/
      subscribe.action.ts          ← Server Action (Resend)
    schemas/
      newsletter.schema.ts         ← Zod validation
    newsletter-page.tsx
    newsletter.seo.ts
    index.ts
```

### ✅ About/Team Feature

```
features/
  about/
    sections/
      company-story/
        company-story.tsx
        company-story.data.ts      ← Company history, mission
        index.ts
      team-members/
        team-members.tsx
        team-members.data.ts       ← Team member profiles
        team-members.types.ts
        index.ts
      company-values/
        company-values.tsx
        company-values.data.ts     ← Core values
        index.ts
    about-page.tsx
    about.seo.ts
    index.ts
```

## 📦 RESEND BEST PRACTICES

### ✅ Email Configuration

```typescript
// lib/config/email.config.ts
export const emailConfig = {
  from: {
    default: process.env.RESEND_FROM_EMAIL!,
    noReply: 'noreply@yourdomain.com',
    support: 'support@yourdomain.com',
  },
  to: {
    admin: process.env.RESEND_TO_EMAIL!,
    support: process.env.RESEND_SUPPORT_EMAIL!,
  },
  subjects: {
    contactForm: (subject: string) => `New Contact: ${subject}`,
    newsletter: 'Welcome to our newsletter',
    confirmation: (siteName: string) => `Thank you - ${siteName}`,
  },
} as const
```

### ✅ Reusable Email Action

```typescript
// lib/actions/send-email.ts
'use server'

import { Resend } from 'resend'
import type { ReactElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  from,
  subject,
  react,
}: {
  to: string | string[]
  from: string
  subject: string
  react: ReactElement
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
```

### ✅ Email Template Base Styles

```typescript
// emails/styles/email-base.styles.ts
export const emailStyles = {
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '16px 0',
    color: '#1a1a1a',
  },
  text: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#404040',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
  },
} as const
```

### ✅ Testing Emails

```typescript
// emails/test/preview-emails.tsx
// Run with: npm run email:dev

import { ContactNotificationEmail } from '../templates/contact-notification'
import { ContactConfirmationEmail } from '../templates/contact-confirmation'

// Mock data for testing
const mockContactData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for email preview.',
}

export const ContactNotification = () => (
  <ContactNotificationEmail {...mockContactData} />
)

export const ContactConfirmation = () => (
  <ContactConfirmationEmail name={mockContactData.name} />
)
```

## 🔐 ENVIRONMENT VARIABLES CHECKLIST

### Required for All Projects
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Required for Projects with Resend
```bash
# .env.local
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=admin@yourdomain.com
```

### Always Provide
```bash
# .env.example
# Copy to .env.local and fill in values

# Site Configuration
NODE_ENV=
NEXT_PUBLIC_SITE_URL=

# Email Configuration (if using Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

## 📚 RECOMMENDED PACKAGES FOR REUSABLE PROJECTS

### Core (Always)
```bash
npm install next react react-dom
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
```

### Forms & Validation
```bash
npm install zod react-hook-form @hookform/resolvers/zod
```

### Email (Resend)
```bash
npm install resend react-email @react-email/components
```

### UI Components (shadcn/ui)
```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea form card
```

### Icons
```bash
npm install lucide-react
```

### Utilities
```bash
npm install date-fns  # For date formatting
npm install slugify   # For URL-friendly slugs
```

## 🚀 QUICK REFERENCE GUIDE

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page Component | `[name]-page.tsx` | `home-page.tsx` |
| Section Component | `[name].tsx` | `hero.tsx` |
| Data File | `[name].data.ts` | `hero.data.ts` |
| Type File | `[name].types.ts` | `hero.types.ts` |
| SEO File | `[name].seo.ts` | `home.seo.ts` |
| Schema File | `[name].schema.ts` | `contact.schema.ts` |
| Action File | `[name].action.ts` | `send-email.action.ts` |
| Config File | `[name].config.ts` | `site.config.ts` |
| Email Template | `[name].tsx` | `contact-notification.tsx` |

### Where Does This File Go?

| File Type | Location | Example |
|-----------|----------|---------|
| Page component | `features/[page]/` | `features/home/home-page.tsx` |
| Section component | `features/[page]/sections/[section]/` | `features/home/sections/hero/hero.tsx` |
| Section data | Same as component | `features/home/sections/hero/hero.data.ts` |
| Section types | Same as component | `features/home/sections/hero/hero.types.ts` |
| SEO metadata | Feature root | `features/home/home.seo.ts` |
| Feature actions | `features/[page]/actions/` | `features/contact/actions/send-email.action.ts` |
| Feature schemas | `features/[page]/schemas/` | `features/contact/schemas/contact.schema.ts` |
| Email templates | `emails/templates/` | `emails/templates/contact-notification.tsx` |
| Global config | `lib/config/` | `lib/config/site.config.ts` |
| Global constants | `lib/constants/` | `lib/constants/routes.ts` |
| Global types | `lib/types/` | `lib/types/global.types.ts` |
| Shared utilities | `lib/utils/` | `lib/utils/helpers.ts` |
| Shared validations | `lib/validations/` | `lib/validations/schemas.ts` |
| UI components | `components/ui/` | `components/ui/button.tsx` |
| Layout components | `components/layouts/` | `components/layouts/main-header.tsx` |
| Shared components | `components/shared/` | `components/shared/social-links.tsx` |

### Common Import Patterns

```typescript
// ✅ Importing section data in same section
import { heroData } from './hero.data'

// ✅ Importing section types in same section
import type { HeroData } from './hero.types'

// ✅ Importing sections in page component
import { HeroSection } from './sections/hero'

// ✅ Importing global config
import { siteConfig } from '@/lib/config/site.config'

// ✅ Importing constants
import { ROUTES } from '@/lib/constants/routes'

// ✅ Importing UI components
import { Button } from '@/components/ui/button'

// ✅ Importing email templates in actions
import { ContactNotificationEmail } from '@/emails/templates/contact-notification'

// ❌ NEVER cross-section imports
import { heroData } from '../hero/hero.data'

// ❌ NEVER cross-feature imports
import { heroData } from '@/features/about/sections/hero/hero.data'
```

### Checklist: Before Starting a New Project

- [ ] Choose project type: Pure SSG or SSG + Forms
- [ ] Install core packages (Next.js, React, TypeScript, Tailwind)
- [ ] If using forms: Install zod, react-hook-form, resend, react-email
- [ ] If using shadcn/ui: Run `npx shadcn@latest init`
- [ ] Set up folder structure: `features/`, `lib/`, `components/`, `emails/` (if needed)
- [ ] Create global config files in `lib/config/`
- [ ] Create constants in `lib/constants/`
- [ ] Set up environment variables (`.env.local`, `.env.example`)
- [ ] If using Resend: Get API key, verify domain
- [ ] Create first feature following the pattern
- [ ] Set up git repository and commit initial structure

### Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Can't import section data" | Check if data file is in same folder and exported from `index.ts` |
| "Type errors in data file" | Create `.types.ts` file and import type in `.data.ts` |
| "SEO metadata not working" | Check if SEO file is at feature root, not in sections |
| "Server Action not working" | Ensure file has `'use server'` at top and is in `actions/` folder |
| "Email not sending" | Check environment variables, Resend API key, domain verification |
| "Component too large" | Split into smaller components, move logic to hooks |
| "Can't find routes" | Check `lib/constants/routes.ts` for route definitions |
| "Cross-feature import error" | Each feature should be self-contained, use global config instead |

---

## 📖 SUMMARY

This CLAUDE.md file provides a comprehensive, reusable architecture pattern for Next.js projects that can be either:
1. **Pure SSG**: 100% static with no server-side features
2. **SSG + Forms**: Mostly static with Server Actions for forms and email

**Key Principles:**
- Feature-based organization
- Section-based composition
- Co-located data, types, and components
- Minimal server logic (forms only)
- Maximum performance and SEO
- Reusable across projects

Copy this file to any new project and adapt the patterns to your specific needs!
