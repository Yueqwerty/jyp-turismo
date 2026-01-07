// ===========================================
// CMS Types - Single Source of Truth
// ===========================================

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ===========================================
// Site Settings
// ===========================================
export interface SiteSettings extends BaseEntity {
  logoText: string;
  companyName: string;
  metaTitle: string;
  metaDescription: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

// ===========================================
// Hero Section
// ===========================================
export interface HeroSection extends BaseEntity {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  whatsappNumber: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  email: string;
  heroImage: string;
  heroImageAlt: string;
  heroBadgeText: string;
  ctaWhatsappText: string;
  ctaPhoneText: string;
  isActive?: boolean;
}

// ===========================================
// Tours
// ===========================================
export interface Tour extends BaseEntity {
  title: string;
  description?: string | null;
  tags: string[];
  image: string;
  gradient: string;
  colSpan: number;
  rowSpan: number;
  minHeight: string;
  featured: boolean;
  order: number;
  toursSectionId?: string;
  isActive?: boolean;
  // Package information
  packageName?: string | null;
  packageDescription?: string | null;
  packagePrice?: string | null;
  packageDuration?: string | null;
  packageIncludes?: string[];
}

export interface ToursSection extends BaseEntity {
  sectionTitle: string;
  sectionDescription: string;
  isActive?: boolean;
}

export interface ToursPage extends BaseEntity {
  heroTitle: string;
  heroSubtitle: string;
  isActive?: boolean;
}

// ===========================================
// Footer
// ===========================================
export interface FooterSettings extends BaseEntity {
  brandTitle: string;
  brandDescription: string;
  copyrightText: string;
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterPlaceholder: string;
  termsUrl?: string | null;
  privacyUrl?: string | null;
  cookiesUrl?: string | null;
  isActive?: boolean;
}

// ===========================================
// Content Aggregate (API Response)
// ===========================================
export interface CMSContent {
  siteSettings: SiteSettings;
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  toursPage: ToursPage;
}

// ===========================================
// Form Types (for modals/editors)
// ===========================================
export type HeroSectionForm = Omit<HeroSection, 'createdAt' | 'updatedAt' | 'isActive'>;
export type TourForm = Omit<Tour, 'createdAt' | 'updatedAt' | 'isActive' | 'toursSectionId'>;
export type ToursSectionForm = Omit<ToursSection, 'createdAt' | 'updatedAt' | 'isActive'>;
export type FooterSettingsForm = Omit<FooterSettings, 'createdAt' | 'updatedAt' | 'isActive' | 'termsUrl' | 'privacyUrl' | 'cookiesUrl'>;
export type SiteSettingsForm = Omit<SiteSettings, 'createdAt' | 'updatedAt'>;
export type ToursPageForm = Omit<ToursPage, 'createdAt' | 'updatedAt' | 'isActive'>;

// ===========================================
// API Response Types
// ===========================================
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

// ===========================================
// UI State Types
// ===========================================
export type AdminSection = 'dashboard' | 'hero' | 'tours' | 'footer' | 'settings' | 'tools' | 'media';
export type ModalType = 'hero' | 'tour' | 'tours-section' | 'footer' | 'settings' | 'tours-page' | null;

export interface MenuItem {
  id: AdminSection;
  label: string;
  icon: string;
}

export interface MessageState {
  type: 'success' | 'error';
  text: string;
}

// ===========================================
// Default Values
// ===========================================
export const DEFAULT_TOUR: TourForm = {
  id: '',
  title: '',
  description: null,
  tags: [],
  image: '',
  gradient: 'from-cyan-600 to-teal-600',
  colSpan: 4,
  rowSpan: 1,
  minHeight: '320px',
  featured: false,
  order: 0,
  packageName: null,
  packageDescription: null,
  packagePrice: null,
  packageDuration: null,
  packageIncludes: [],
};

export const GRADIENT_OPTIONS = [
  { name: 'Cyan-Teal', value: 'from-cyan-600 to-teal-600' },
  { name: 'Azul', value: 'from-blue-600 to-blue-700' },
  { name: 'Gris Oscuro', value: 'from-gray-700 to-gray-800' },
  { name: 'Gris', value: 'from-gray-600 to-gray-700' },
  { name: 'Gris-Negro', value: 'from-gray-800 to-gray-900' },
  { name: 'Indigo', value: 'from-indigo-600 to-purple-600' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'hero', label: 'Hero Section', icon: 'Image' },
  { id: 'tours', label: 'Tours', icon: 'Map' },
  { id: 'footer', label: 'Footer', icon: 'AlignBottom' },
  { id: 'settings', label: 'Configuracion', icon: 'Settings' },
  { id: 'tools', label: 'Herramientas', icon: 'Wrench' },
];
