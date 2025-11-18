'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [updateContactMessage, setUpdateContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch content
  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch('/api/cms/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContent();
    }
  }, [status, fetchContent]);

  const handleHeroSave = useCallback(async (data: HeroSection) => {
    setContent(prev => prev ? { ...prev, heroSection: data } : null);
    setActiveModal(null);
    // Refetch para asegurar sincronización
    await fetchContent();
  }, [fetchContent]);

  const handleTourSave = useCallback(async (tour: Tour) => {
    setContent(prev => {
      if (!prev) return null;
      if (selectedTour) {
        return {
          ...prev,
          tours: prev.tours.map(t => t.id === tour.id ? tour : t)
        };
      }
      return { ...prev, tours: [...prev.tours, tour] };
    });
    setActiveModal(null);
    setSelectedTour(null);
    // Refetch para asegurar sincronización
    await fetchContent();
  }, [selectedTour, fetchContent]);

  const handleToursSectionSave = useCallback(async (data: ToursSection) => {
    setContent(prev => prev ? { ...prev, toursSection: data } : null);
    setActiveModal(null);
    // Refetch para asegurar sincronización
    await fetchContent();
  }, [fetchContent]);

  const handleFooterSave = useCallback(async (data: FooterSettings) => {
    setContent(prev => prev ? { ...prev, footerSettings: data } : null);
    setActiveModal(null);
    // Refetch para asegurar sincronización
    await fetchContent();
  }, [fetchContent]);

  const handleSettingsSave = useCallback(async (data: SiteSettings) => {
    setContent(prev => prev ? { ...prev, siteSettings: data } : null);
    setActiveModal(null);
    // Refetch para asegurar sincronización
    await fetchContent();
  }, [fetchContent]);

  const handleTourClick = useCallback((tour: Tour) => {
    setSelectedTour(tour);
    setActiveModal('tour');
  }, []);

  const handleNewTour = useCallback(() => {
    setSelectedTour(null);
    setActiveModal('tour');
  }, []);

  const handleTourDelete = useCallback(async (tourId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tour?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tours: prev.tours.filter(t => t.id !== tourId)
          };
        });
        // Refetch para asegurar sincronización
        await fetchContent();
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    }
  }, [fetchContent]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedTour(null);
  }, []);

  const handleUpdateContact = useCallback(async () => {
    setIsUpdatingContact(true);
    setUpdateContactMessage(null);

    try {
      const response = await fetch('/api/admin/update-contact', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateContactMessage({
          type: 'success',
          text: '✅ Información de contacto actualizada exitosamente'
        });
        // Refetch content to show updated data
        await fetchContent();
      } else {
        setUpdateContactMessage({
          type: 'error',
          text: '❌ Error al actualizar: ' + (data.error || 'Error desconocido')
        });
      }
    } catch (error) {
      setUpdateContactMessage({
        type: 'error',
        text: '❌ Error de conexión al actualizar'
      });
      console.error('Error updating contact:', error);
    } finally {
      setIsUpdatingContact(false);
      // Clear message after 5 seconds
      setTimeout(() => setUpdateContactMessage(null), 5000);
    }
  }, [fetchContent]);

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
      <Header />

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8 lg:space-y-12">

        {/* Hero Section Card */}
        <HeroSectionCard
          heroSection={content.heroSection}
          onEdit={() => setActiveModal('hero')}
        />

        {/* Tours Section */}
        <ToursGrid
          tours={content.tours}
          onEditSection={() => setActiveModal('tours-section')}
          onAddTour={handleNewTour}
          onTourClick={handleTourClick}
          onTourDelete={handleTourDelete}
        />

        {/* System Utilities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-slate-900/5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Utilidades del Sistema</h2>
              <p className="text-sm text-gray-500 mt-1">Actualizaciones y configuraciones especiales</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpdateContact}
              disabled={isUpdatingContact}
              className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isUpdatingContact ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar Información de Contacto
                </>
              )}
            </button>

            {updateContactMessage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`px-6 py-4 rounded-2xl font-medium flex-1 ${
                  updateContactMessage.type === 'success'
                    ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-2 border-red-200 text-red-900'
                }`}
              >
                {updateContactMessage.text}
              </motion.div>
            )}
          </div>

          <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
            <p className="text-sm text-cyan-900 leading-relaxed">
              <strong>¿Qué hace este botón?</strong> Actualiza toda la información de contacto en la base de datos (WhatsApp: +56 9 9718 7142, Facebook, Instagram, Email) en todas las secciones del sitio.
            </p>
          </div>
        </motion.section>

        {/* Footer & Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <FooterCard
            footerSettings={content.footerSettings}
            onEdit={() => setActiveModal('footer')}
          />
          <SettingsCard
            siteSettings={content.siteSettings}
            onEdit={() => setActiveModal('settings')}
          />
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {activeModal === 'hero' && (
          <HeroModal
            content={content.heroSection}
            onClose={closeModal}
            onSave={handleHeroSave}
          />
        )}
        {activeModal === 'tour' && (
          <TourModal
            tour={selectedTour}
            onClose={closeModal}
            onSave={handleTourSave}
          />
        )}
        {activeModal === 'tours-section' && (
          <ToursSectionModal
            content={content.toursSection}
            onClose={closeModal}
            onSave={handleToursSectionSave}
          />
        )}
        {activeModal === 'footer' && (
          <FooterModal
            content={content.footerSettings}
            onClose={closeModal}
            onSave={handleFooterSave}
          />
        )}
        {activeModal === 'settings' && (
          <SettingsModal
            content={content.siteSettings}
            onClose={closeModal}
            onSave={handleSettingsSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Memoized Header Component
const Header = memo(function Header() {
  const router = useRouter();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50"
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg lg:text-xl font-black text-white">J&P</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight truncate">Panel de Administración</h1>
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Gestión de Contenido</p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm text-gray-700 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            Ver Sitio
          </a>
          <button
            onClick={() => router.push('/api/auth/signout')}
            className="px-3 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm text-white font-medium bg-gray-900 hover:bg-gray-800 rounded-xl transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </motion.header>
  );
});

// Memoized Hero Section Card
const HeroSectionCard = memo(function HeroSectionCard({
  heroSection,
  onEdit
}: {
  heroSection: HeroSection;
  onEdit: () => void;
}) {
  const socialIcons = useMemo(() => [
    { show: true, icon: 'whatsapp', color: 'green', label: 'WhatsApp' },
    { show: !!heroSection.facebookUrl, icon: 'facebook', color: 'blue', label: 'Facebook' },
    { show: !!heroSection.instagramUrl, icon: 'instagram', color: 'pink', label: 'Instagram' },
    { show: true, icon: 'email', color: 'cyan', label: 'Correo' }
  ].filter(item => item.show), [heroSection.facebookUrl, heroSection.instagramUrl]);

  return (
    <motion.section
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Sección Hero</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1 hidden sm:block">Banner principal de la página de inicio</p>
        </div>
        <EditButton onClick={onEdit} label="Editar Hero" />
      </div>

      <div className="bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
              {heroSection.tagline}
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              {heroSection.titleLine1}<br />
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                {heroSection.titleLine2}
              </span>
            </h3>
            <p className="text-base lg:text-lg text-gray-600">{heroSection.description}</p>
            <div className="grid grid-cols-4 gap-2 lg:gap-3 pt-4">
              {socialIcons.map((item, i) => (
                <SocialIconBadge key={i} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

// Memoized Social Icon Badge
const SocialIconBadge = memo(function SocialIconBadge({
  icon,
  color,
  label
}: {
  icon: string;
  color: string;
  label: string;
}) {
  const iconMap: Record<string, JSX.Element> = {
    whatsapp: (
      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
      </svg>
    ),
    email: (
      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  };

  return (
    <div className={`p-2 lg:p-3 bg-${color}-50 rounded-xl flex flex-col items-center gap-1 transition-transform hover:scale-105`}>
      {iconMap[icon]}
      <div className={`text-[10px] font-bold text-${color}-900`}>{label}</div>
    </div>
  );
});

// Memoized Tours Grid with Bento Layout
const ToursGrid = memo(function ToursGrid({
  tours,
  onEditSection,
  onAddTour,
  onTourClick,
  onTourDelete
}: {
  tours: Tour[];
  onEditSection: () => void;
  onAddTour: () => void;
  onTourClick: (tour: Tour) => void;
  onTourDelete: (tourId: string) => void;
}) {
  const sortedTours = useMemo(() =>
    [...tours].sort((a, b) => a.order - b.order),
    [tours]
  );

  return (
    <motion.section
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Tours</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1 hidden sm:block">Gestiona las rutas y experiencias</p>
        </div>
        <div className="flex gap-2 lg:gap-3 w-full sm:w-auto">
          <button
            onClick={onEditSection}
            className="flex-1 sm:flex-none px-4 lg:px-6 py-2 lg:py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Editar Sección
          </button>
          <button
            onClick={onAddTour}
            className="flex-1 sm:flex-none px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-cyan-600/25 hover:shadow-xl transition-all"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-4 lg:gap-6"
      >
        {sortedTours.map((tour, index) => (
          <TourCard
            key={tour.id}
            tour={tour}
            index={index}
            onClick={() => onTourClick(tour)}
            onDelete={() => onTourDelete(tour.id)}
          />
        ))}
      </motion.div>
    </motion.section>
  );
});

// Memoized Tour Card with dynamic sizing
const TourCard = memo(function TourCard({
  tour,
  index,
  onClick,
  onDelete
}: {
  tour: Tour;
  index: number;
  onClick: () => void;
  onDelete: () => void;
}) {
  // Create dynamic bento layout pattern
  const getBentoClass = (idx: number) => {
    const pattern = idx % 6;
    switch(pattern) {
      case 0: return 'col-span-1 sm:col-span-2 row-span-2'; // Large featured
      case 1: return 'col-span-1 row-span-1'; // Small
      case 2: return 'col-span-1 row-span-1'; // Small
      case 3: return 'col-span-1 sm:col-span-2 lg:col-span-1 row-span-1'; // Medium
      case 4: return 'col-span-1 row-span-2'; // Tall
      case 5: return 'col-span-1 row-span-1'; // Small
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={`group relative bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:shadow-2xl transition-all ${getBentoClass(index)}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 lg:top-4 left-3 lg:left-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          title="Eliminar tour"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {tour.featured && (
          <div className="absolute top-3 lg:top-4 right-3 lg:right-4 px-2 lg:px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full">
            Destacado
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <h3 className="text-xl lg:text-2xl font-black text-white mb-2 line-clamp-2">{tour.title}</h3>
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {tour.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 lg:py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Footer Card
const FooterCard = memo(function FooterCard({
  footerSettings,
  onEdit
}: {
  footerSettings: FooterSettings;
  onEdit: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Footer</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1 hidden sm:block">Pie de página</p>
        </div>
        <EditButton onClick={onEdit} label="Editar" compact />
      </div>
      <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">{footerSettings.brandDescription}</p>
        <p className="text-xs text-gray-400">{footerSettings.copyrightText}</p>
      </div>
    </motion.div>
  );
});

// Memoized Settings Card
const SettingsCard = memo(function SettingsCard({
  siteSettings,
  onEdit
}: {
  siteSettings: SiteSettings;
  onEdit: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Configuración</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1 hidden sm:block">Datos generales del sitio</p>
        </div>
        <EditButton onClick={onEdit} label="Editar" compact />
      </div>
      <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg border border-gray-100 space-y-3">
        <SettingItem label="Empresa" value={siteSettings.companyName} />
        <SettingItem label="Email" value={siteSettings.email ?? 'No configurado'} />
        <SettingItem label="Teléfono" value={siteSettings.phone ?? 'No configurado'} />
      </div>
    </motion.div>
  );
});

const SettingItem = memo(function SettingItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
    </div>
  );
});

// Reusable Edit Button
const EditButton = memo(function EditButton({
  onClick,
  label,
  compact = false
}: {
  onClick: () => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${compact ? 'px-4 lg:px-6 py-2 lg:py-3' : 'px-4 lg:px-6 py-2 lg:py-3'} bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-cyan-600/25 transition-all flex-shrink-0`}
    >
      {label}
    </motion.button>
  );
});

// Modal Components
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

  // Sincronizar formData cuando cambie content
  useEffect(() => {
    setFormData(content);
  }, [content]);

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

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Botones de Acción (CTAs)</h3>
          <div className="space-y-4">
            <InputField
              label="Texto del Botón WhatsApp"
              value={formData.ctaWhatsappText}
              onChange={(value) => setFormData({ ...formData, ctaWhatsappText: value })}
              placeholder="WhatsApp"
            />
            <InputField
              label="Texto del Botón Teléfono"
              value={formData.ctaPhoneText}
              onChange={(value) => setFormData({ ...formData, ctaPhoneText: value })}
              placeholder="+56 9 XXXX XXXX"
            />
          </div>
        </div>
      </div>
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
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

  // Sincronizar formData cuando cambie tour
  useEffect(() => {
    if (tour) {
      setFormData(tour);
    }
  }, [tour]);

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

  const addTag = useCallback(() => {
    if (tagInput.trim()) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  }, [tagInput]);

  const removeTag = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  }, []);

  const addPackageInclude = useCallback(() => {
    if (packageIncludeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        packageIncludes: [...(prev.packageIncludes || []), packageIncludeInput.trim()]
      }));
      setPackageIncludeInput('');
    }
  }, [packageIncludeInput]);

  const removePackageInclude = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      packageIncludes: (prev.packageIncludes || []).filter((_, i) => i !== index)
    }));
  }, []);

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
        <TagInput
          tags={formData.tags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

        <ImageUpload
          label="Imagen"
          value={formData.image}
          onChange={(value) => setFormData({ ...formData, image: value })}
        />

        {/* Package Information */}
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

            <TagInput
              label="Incluye"
              tags={formData.packageIncludes || []}
              tagInput={packageIncludeInput}
              onTagInputChange={setPackageIncludeInput}
              onAddTag={addPackageInclude}
              onRemoveTag={removePackageInclude}
              placeholder="Ej: Transporte incluido"
            />
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
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
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

  // Sincronizar formData cuando cambie content
  useEffect(() => {
    setFormData(content);
  }, [content]);

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
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
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

  // Sincronizar formData cuando cambie content
  useEffect(() => {
    setFormData(content);
  }, [content]);

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
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
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

  // Sincronizar formData cuando cambie content
  useEffect(() => {
    setFormData(content);
  }, [content]);

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
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-2xl p-6 lg:p-8 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

const ModalActions = memo(function ModalActions({
  onClose,
  onSave,
  saving
}: {
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onClose}
        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl lg:rounded-2xl transition-all"
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
});

const InputField = memo(function InputField({
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
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all"
      />
    </div>
  );
});

const TextAreaField = memo(function TextAreaField({
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
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all resize-none"
      />
    </div>
  );
});

const TagInput = memo(function TagInput({
  label = 'Tags',
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  placeholder = 'Agregar tag...'
}: {
  label?: string;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600"
        />
        <button
          onClick={onAddTag}
          type="button"
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-teal-700"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-sm font-bold flex items-center gap-2"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(i)}
              type="button"
              className="text-cyan-600 hover:text-cyan-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
});

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
          <Image src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white file:font-bold hover:file:bg-cyan-700"
      />
      {uploading && <p className="text-sm text-cyan-600 mt-2">Subiendo imagen...</p>}
    </div>
  );
}
