import { z } from 'zod';

// ===========================================
// Base Schemas
// ===========================================

const urlSchema = z.string().url().nullable().optional();
const phoneSchema = z.string().min(1).max(20).nullable().optional();
const emailSchema = z.string().email().nullable().optional();

// ===========================================
// Hero Section
// ===========================================

export const heroSectionSchema = z.object({
  id: z.string().optional(),
  tagline: z.string().min(1, 'Tagline es requerido').max(200),
  titleLine1: z.string().min(1, 'Titulo linea 1 es requerido').max(100),
  titleLine2: z.string().min(1, 'Titulo linea 2 es requerido').max(100),
  description: z.string().min(1, 'Descripcion es requerida').max(500),
  whatsappNumber: z.string().min(1, 'WhatsApp es requerido').max(20),
  facebookUrl: urlSchema,
  instagramUrl: urlSchema,
  email: z.string().email('Email invalido'),
  heroImage: z.string().min(1, 'Imagen es requerida'),
  heroImageAlt: z.string().min(1).max(200),
  heroBadgeText: z.string().min(1).max(100),
  ctaWhatsappText: z.string().min(1).max(50),
  ctaPhoneText: z.string().min(1).max(50),
});

export type HeroSectionInput = z.infer<typeof heroSectionSchema>;

// ===========================================
// Tour
// ===========================================

export const tourSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Titulo es requerido').max(200),
  description: z.string().max(1000).nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  image: z.string().min(1, 'Imagen es requerida'),
  gradient: z.string().min(1).default('from-cyan-600 to-teal-600'),
  colSpan: z.number().int().min(1).max(12).default(4),
  rowSpan: z.number().int().min(1).max(4).default(1),
  minHeight: z.string().default('320px'),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  // Package info
  packageName: z.string().max(200).nullable().optional(),
  packageDescription: z.string().max(2000).nullable().optional(),
  packagePrice: z.string().max(50).nullable().optional(),
  packageDuration: z.string().max(100).nullable().optional(),
  packageIncludes: z.array(z.string().min(1).max(200)).max(20).default([]),
});

export type TourInput = z.infer<typeof tourSchema>;

// ===========================================
// Tours Section
// ===========================================

export const toursSectionSchema = z.object({
  id: z.string().optional(),
  sectionTitle: z.string().min(1, 'Titulo es requerido').max(200),
  sectionDescription: z.string().min(1, 'Descripcion es requerida').max(500),
});

export type ToursSectionInput = z.infer<typeof toursSectionSchema>;

// ===========================================
// Tours Page
// ===========================================

export const toursPageSchema = z.object({
  id: z.string().optional(),
  heroTitle: z.string().min(1, 'Titulo es requerido').max(200),
  heroSubtitle: z.string().min(1, 'Subtitulo es requerido').max(300),
});

export type ToursPageInput = z.infer<typeof toursPageSchema>;

// ===========================================
// Footer Settings
// ===========================================

export const footerSettingsSchema = z.object({
  id: z.string().optional(),
  brandTitle: z.string().min(1, 'Titulo es requerido').max(200),
  brandDescription: z.string().min(1, 'Descripcion es requerida').max(1000),
  copyrightText: z.string().min(1).max(300),
  newsletterEnabled: z.boolean().default(true),
  newsletterTitle: z.string().max(100).default('Newsletter'),
  newsletterPlaceholder: z.string().max(100).default('Tu email'),
});

export type FooterSettingsInput = z.infer<typeof footerSettingsSchema>;

// ===========================================
// Site Settings
// ===========================================

export const siteSettingsSchema = z.object({
  id: z.string().optional(),
  logoText: z.string().min(1, 'Logo es requerido').max(10),
  companyName: z.string().min(1, 'Nombre es requerido').max(200),
  metaTitle: z.string().min(1).max(200),
  metaDescription: z.string().min(1).max(500),
  phone: phoneSchema,
  whatsappNumber: phoneSchema,
  email: emailSchema,
  facebookUrl: urlSchema,
  instagramUrl: urlSchema,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ===========================================
// File Upload
// ===========================================

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const fileUploadSchema = z.object({
  file: z.custom<File>((val) => val instanceof File, 'Archivo invalido')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no puede superar 5MB')
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type as any),
      'Solo se permiten imagenes JPG, PNG o WebP'
    ),
});

// ===========================================
// Validation Helper
// ===========================================

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return { success: false, error: errors };
  }

  return { success: true, data: result.data };
}
