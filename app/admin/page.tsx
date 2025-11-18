'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Types
interface HeroSection {
  id: string;
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
}

interface Tour {
  id: string;
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
  packageName?: string | null;
  packagePrice?: string | null;
  packageDuration?: string | null;
  packageIncludes?: string[];
}

interface ToursSection {
  id: string;
  sectionTitle: string;
  sectionDescription: string;
}

interface FooterSettings {
  id: string;
  brandTitle: string;
  brandDescription: string;
  copyrightText: string;
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterPlaceholder: string;
}

interface SiteSettings {
  id: string;
  logoText: string;
  companyName: string;
  metaTitle: string;
  metaDescription: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
}

interface Content {
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  siteSettings: SiteSettings;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/cms/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchContent();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-gray-200 border-t-cyan-600 rounded-full"
        />
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50"
      >
        <div className="max-w-[1800px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black text-white">J&P</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Gestión de Contenido</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm text-gray-700 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Ver Sitio
            </a>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="px-5 py-2.5 text-sm text-white font-medium bg-gray-900 hover:bg-gray-800 rounded-xl transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-8 py-12">

        {/* Hero Section Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sección Hero</h2>
              <p className="text-gray-500 mt-1">Banner principal de la página de inicio</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal('hero')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 hover:shadow-xl transition-all"
            >
              Editar Hero
            </motion.button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preview */}
              <div className="space-y-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                  {content.heroSection.tagline}
                </div>
                <h3 className="text-5xl font-black text-gray-900 leading-tight">
                  {content.heroSection.titleLine1}<br />
                  <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{content.heroSection.titleLine2}</span>
                </h3>
                <p className="text-lg text-gray-600">{content.heroSection.description}</p>

                {/* Social Media Box - 2x2 Grid Preview */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-slate-900/10 shadow-lg mt-4">
                  <div className="grid grid-cols-2 grid-rows-2">
                    {/* WhatsApp - Top Left */}
                    <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-emerald-400/20 via-white to-white border-r border-b border-slate-900/5">
                      <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-emerald-500" />
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-[9px] font-black text-slate-700">WhatsApp</span>
                    </div>

                    {/* Facebook - Top Right */}
                    {content.heroSection.facebookUrl ? (
                      <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-bl from-blue-400/20 via-white to-white border-b border-slate-900/5">
                        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-blue-600" />
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-[9px] font-black text-slate-700">Facebook</span>
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-bl from-slate-50 via-white to-white border-b border-slate-900/5 opacity-40">
                        <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-[9px] font-black text-slate-400">Facebook</span>
                      </div>
                    )}

                    {/* Instagram - Bottom Left */}
                    {content.heroSection.instagramUrl ? (
                      <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-tr from-pink-400/20 via-white to-white border-r border-slate-900/5">
                        <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-pink-600" />
                        <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                        <span className="text-[9px] font-black text-slate-700">Instagram</span>
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-tr from-slate-50 via-white to-white border-r border-slate-900/5 opacity-40">
                        <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                        <span className="text-[9px] font-black text-slate-400">Instagram</span>
                      </div>
                    )}

                    {/* Email - Bottom Right */}
                    <div className="relative flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-tl from-cyan-400/20 via-white to-white">
                      <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-cyan-600" />
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[9px] font-black text-slate-700">Correo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image
                  src={content.heroSection.heroImage}
                  alt={content.heroSection.heroImageAlt}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30">
                  <p className="text-white text-sm font-bold">{content.heroSection.heroBadgeText}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tours Section Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tours</h2>
              <p className="text-gray-500 mt-1">Gestiona las rutas y experiencias</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal('tours-section')}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Editar Sección
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTour(null);
                  setActiveModal('tour');
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 hover:shadow-xl transition-all"
              >
                + Agregar Tour
              </motion.button>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.tours.map((tour) => (
              <motion.div
                key={tour.id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedTour(tour);
                  setActiveModal('tour');
                }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="relative h-64">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  {tour.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-black text-white mb-2">{tour.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer & Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Footer Settings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Footer</h2>
                <p className="text-gray-500 mt-1">Pie de página</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal('footer')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25"
              >
                Editar
              </motion.button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">{content.footerSettings.brandDescription}</p>
              <p className="text-xs text-gray-400">{content.footerSettings.copyrightText}</p>
            </div>
          </div>

          {/* Site Settings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Configuración</h2>
                <p className="text-gray-500 mt-1">Datos generales del sitio</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal('settings')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25"
              >
                Editar
              </motion.button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 space-y-3">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Empresa</span>
                <p className="text-sm font-bold text-gray-900">{content.siteSettings.companyName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Email</span>
                <p className="text-sm font-bold text-gray-900">{content.siteSettings.email ?? 'No configurado'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Teléfono</span>
                <p className="text-sm font-bold text-gray-900">{content.siteSettings.phone ?? 'No configurado'}</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'hero' && (
          <HeroModal
            content={content.heroSection}
            onClose={() => setActiveModal(null)}
            onSave={(data) => {
              setContent({ ...content, heroSection: data });
              setActiveModal(null);
            }}
          />
        )}
        {activeModal === 'tour' && (
          <TourModal
            tour={selectedTour}
            onClose={() => {
              setActiveModal(null);
              setSelectedTour(null);
            }}
            onSave={(tour) => {
              if (selectedTour) {
                setContent({
                  ...content,
                  tours: content.tours.map((t) => (t.id === tour.id ? tour : t)),
                });
              } else {
                setContent({ ...content, tours: [...content.tours, tour] });
              }
              setActiveModal(null);
              setSelectedTour(null);
            }}
          />
        )}
        {activeModal === 'tours-section' && (
          <ToursSectionModal
            content={content.toursSection}
            onClose={() => setActiveModal(null)}
            onSave={(data) => {
              setContent({ ...content, toursSection: data });
              setActiveModal(null);
            }}
          />
        )}
        {activeModal === 'footer' && (
          <FooterModal
            content={content.footerSettings}
            onClose={() => setActiveModal(null)}
            onSave={(data) => {
              setContent({ ...content, footerSettings: data });
              setActiveModal(null);
            }}
          />
        )}
        {activeModal === 'settings' && (
          <SettingsModal
            content={content.siteSettings}
            onClose={() => setActiveModal(null)}
            onSave={(data) => {
              setContent({ ...content, siteSettings: data });
              setActiveModal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Components (simplified - full implementation continues below)
function HeroModal({
  content,
  onClose,
  onSave,
}: {
  content: HeroSection;
  onClose: () => void;
  onSave: (data: HeroSection) => void;
}) {
  const [formData, setFormData] = useState(content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Editar Hero Section" onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Tagline"
          value={formData.tagline}
          onChange={(value) => setFormData({ ...formData, tagline: value })}
        />
        <InputField
          label="Título Línea 1"
          value={formData.titleLine1}
          onChange={(value) => setFormData({ ...formData, titleLine1: value })}
        />
        <InputField
          label="Título Línea 2"
          value={formData.titleLine2}
          onChange={(value) => setFormData({ ...formData, titleLine2: value })}
        />
        <TextAreaField
          label="Descripción"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Redes Sociales y Contacto</h3>
          <div className="space-y-4">
            <InputField
              label="WhatsApp (número con código de país, ej: 56912345678)"
              value={formData.whatsappNumber}
              onChange={(value) => setFormData({ ...formData, whatsappNumber: value })}
              placeholder="56912345678"
            />
            <InputField
              label="Facebook URL (opcional)"
              value={formData.facebookUrl || ''}
              onChange={(value) => setFormData({ ...formData, facebookUrl: value || null })}
              placeholder="https://facebook.com/jypturismo"
            />
            <InputField
              label="Instagram URL (opcional)"
              value={formData.instagramUrl || ''}
              onChange={(value) => setFormData({ ...formData, instagramUrl: value || null })}
              placeholder="https://instagram.com/jypturismo"
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="contacto@jypturismo.cl"
            />
          </div>
        </div>
        <ImageUpload
          label="Imagen Hero"
          value={formData.heroImage}
          onChange={(value) => setFormData({ ...formData, heroImage: value })}
        />
        <InputField
          label="Badge Text"
          value={formData.heroBadgeText}
          onChange={(value) => setFormData({ ...formData, heroBadgeText: value })}
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

function TourModal({
  tour,
  onClose,
  onSave,
}: {
  tour: Tour | null;
  onClose: () => void;
  onSave: (data: Tour) => void;
}) {
  const [formData, setFormData] = useState<Tour>(
    tour || {
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
      packagePrice: null,
      packageDuration: null,
      packageIncludes: [],
    }
  );
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [packageIncludeInput, setPackageIncludeInput] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = tour ? `/api/cms/tours/${tour.id}` : '/api/cms/tours';
      const method = tour ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error('Error saving tour:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addPackageInclude = () => {
    if (packageIncludeInput.trim()) {
      setFormData({
        ...formData,
        packageIncludes: [...(formData.packageIncludes || []), packageIncludeInput.trim()]
      });
      setPackageIncludeInput('');
    }
  };

  const removePackageInclude = (index: number) => {
    setFormData({
      ...formData,
      packageIncludes: (formData.packageIncludes || []).filter((_, i) => i !== index)
    });
  };

  return (
    <Modal title={tour ? 'Editar Tour' : 'Crear Tour'} onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Título"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
        />
        <TextAreaField
          label="Descripción (opcional)"
          value={formData.description ?? ''}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Agregar tag..."
              className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-teal-700"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-sm font-bold flex items-center gap-2"
              >
                {tag}
                <button onClick={() => removeTag(i)} className="text-cyan-600 hover:text-cyan-800">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <ImageUpload
          label="Imagen"
          value={formData.image}
          onChange={(value) => setFormData({ ...formData, image: value })}
        />

        {/* Package Information Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Información de Paquete (Opcional)</h3>
          <div className="space-y-4">
            <InputField
              label="Nombre del Paquete"
              value={formData.packageName || ''}
              onChange={(value) => setFormData({ ...formData, packageName: value || null })}
              placeholder="Ej: Paquete Aventura"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Precio"
                value={formData.packagePrice || ''}
                onChange={(value) => setFormData({ ...formData, packagePrice: value || null })}
                placeholder="Ej: $150.000"
              />
              <InputField
                label="Duración"
                value={formData.packageDuration || ''}
                onChange={(value) => setFormData({ ...formData, packageDuration: value || null })}
                placeholder="Ej: 3 días / 2 noches"
              />
            </div>

            {/* Package Includes */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Incluye
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={packageIncludeInput}
                  onChange={(e) => setPackageIncludeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPackageInclude())}
                  placeholder="Ej: Transporte incluido"
                  className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600"
                />
                <button
                  onClick={addPackageInclude}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-teal-700"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.packageIncludes || []).map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-sm font-bold flex items-center gap-2"
                  >
                    {item}
                    <button onClick={() => removePackageInclude(i)} className="text-cyan-600 hover:text-cyan-800">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
              Featured
            </label>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-6 h-6 rounded"
            />
          </div>
          <InputField
            label="Orden"
            type="number"
            value={formData.order.toString()}
            onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 0 })}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

function ToursSectionModal({
  content,
  onClose,
  onSave,
}: {
  content: ToursSection;
  onClose: () => void;
  onSave: (data: ToursSection) => void;
}) {
  const [formData, setFormData] = useState(content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms/tours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Editar Sección de Tours" onClose={onClose}>
      <div className="space-y-6">
        <InputField
          label="Título de la Sección"
          value={formData.sectionTitle}
          onChange={(value) => setFormData({ ...formData, sectionTitle: value })}
        />
        <TextAreaField
          label="Descripción"
          value={formData.sectionDescription}
          onChange={(value) => setFormData({ ...formData, sectionDescription: value })}
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

function FooterModal({
  content,
  onClose,
  onSave,
}: {
  content: FooterSettings;
  onClose: () => void;
  onSave: (data: FooterSettings) => void;
}) {
  const [formData, setFormData] = useState(content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Editar Footer" onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Título de Marca"
          value={formData.brandTitle}
          onChange={(value) => setFormData({ ...formData, brandTitle: value })}
        />
        <TextAreaField
          label="Descripción"
          value={formData.brandDescription}
          onChange={(value) => setFormData({ ...formData, brandDescription: value })}
        />
        <InputField
          label="Texto Copyright"
          value={formData.copyrightText}
          onChange={(value) => setFormData({ ...formData, copyrightText: value })}
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

function SettingsModal({
  content,
  onClose,
  onSave,
}: {
  content: SiteSettings;
  onClose: () => void;
  onSave: (data: SiteSettings) => void;
}) {
  const [formData, setFormData] = useState(content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Configuración del Sitio" onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Nombre de Empresa"
          value={formData.companyName}
          onChange={(value) => setFormData({ ...formData, companyName: value })}
        />
        <InputField
          label="Email"
          type="email"
          value={formData.email ?? ''}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        <InputField
          label="Teléfono"
          value={formData.phone ?? ''}
          onChange={(value) => setFormData({ ...formData, phone: value })}
        />
        <InputField
          label="WhatsApp"
          value={formData.whatsappNumber ?? ''}
          onChange={(value) => setFormData({ ...formData, whatsappNumber: value })}
        />
        <InputField
          label="Meta Title"
          value={formData.metaTitle}
          onChange={(value) => setFormData({ ...formData, metaTitle: value })}
        />
        <TextAreaField
          label="Meta Description"
          value={formData.metaDescription}
          onChange={(value) => setFormData({ ...formData, metaDescription: value })}
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

// Utility Components
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
      />
    </div>
  );
}

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      {value && (
        <div className="relative h-48 mb-3 rounded-xl overflow-hidden">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-700"
      />
      {uploading && <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>}
    </div>
  );
}
