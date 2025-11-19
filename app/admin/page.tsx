'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

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
  packageDescription?: string | null;
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
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

interface ToursPage {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface Content {
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  siteSettings: SiteSettings;
  toursPage: ToursPage;
}

type MenuItem = 'dashboard' | 'hero' | 'tours' | 'footer' | 'settings' | 'tools' | 'media';

const menuItems = [
  { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: '📊' },
  { id: 'hero' as MenuItem, label: 'Hero Section', icon: '🏔️' },
  { id: 'tours' as MenuItem, label: 'Tours', icon: '🗺️' },
  { id: 'footer' as MenuItem, label: 'Footer', icon: '📄' },
  { id: 'settings' as MenuItem, label: 'Configuración', icon: '⚙️' },
  { id: 'tools' as MenuItem, label: 'Herramientas', icon: '🔧' },
  { id: 'media' as MenuItem, label: 'Medios', icon: '🖼️' },
];

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<MenuItem>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [isSyncingTours, setIsSyncingTours] = useState(false);
  const [updateContactMessage, setUpdateContactMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncToursMessage, setSyncToursMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setActiveModal(null);
    await fetchContent();
  }, [fetchContent]);

  const handleTourSave = useCallback(async (tour: Tour) => {
    setActiveModal(null);
    setSelectedTour(null);
    await fetchContent();
  }, [fetchContent]);

  const handleToursSectionSave = useCallback(async (data: ToursSection) => {
    setActiveModal(null);
    await fetchContent();
  }, [fetchContent]);

  const handleFooterSave = useCallback(async (data: FooterSettings) => {
    setActiveModal(null);
    await fetchContent();
  }, [fetchContent]);

  const handleSettingsSave = useCallback(async (data: SiteSettings) => {
    setActiveModal(null);
    await fetchContent();
  }, [fetchContent]);

  const handleToursPageSave = useCallback(async (data: ToursPage) => {
    setActiveModal(null);
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
        await fetchContent();
      } else {
        alert('Error al eliminar el tour');
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
          text: '✅ Información de contacto actualizada'
        });
        await fetchContent();
      } else {
        setUpdateContactMessage({
          type: 'error',
          text: '❌ Error: ' + (data.error || 'Error desconocido')
        });
      }
    } catch (error) {
      setUpdateContactMessage({
        type: 'error',
        text: '❌ Error de conexión'
      });
    } finally {
      setIsUpdatingContact(false);
      setTimeout(() => setUpdateContactMessage(null), 5000);
    }
  }, [fetchContent]);

  const handleSyncTours = useCallback(async () => {
    setIsSyncingTours(true);
    setSyncToursMessage(null);

    try {
      const response = await fetch('/api/admin/sync-tours', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSyncToursMessage({
          type: 'success',
          text: `✅ ${data.message}`
        });
        await fetchContent();
      } else {
        setSyncToursMessage({
          type: 'error',
          text: '❌ Error: ' + (data.error || 'Error desconocido')
        });
      }
    } catch (error) {
      setSyncToursMessage({
        type: 'error',
        text: '❌ Error de conexión'
      });
    } finally {
      setIsSyncingTours(false);
      setTimeout(() => setSyncToursMessage(null), 5000);
    }
  }, [fetchContent]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {content.siteSettings.logoText}
                </div>
                <span className="font-bold text-lg">Admin Panel</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full flex justify-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                activeSection === item.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          >
            <span className="text-lg">🚪</span>
            {isSidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {content.siteSettings.companyName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Ver Sitio
            </a>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
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
          <ToursPageCard
            toursPage={content.toursPage}
            onEdit={() => setActiveModal('tours-page')}
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
        {activeModal === 'tours-page' && (
          <ToursPageModal
            content={content.toursPage}
            onClose={closeModal}
            onSave={handleToursPageSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Dashboard Section
function DashboardSection({ content }: { content: Content }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">Total Tours</h3>
          <span className="text-2xl">🗺️</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{content.tours.length}</p>
        <p className="text-xs text-gray-500 mt-2">Tours activos en el sitio</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">Tours Destacados</h3>
          <span className="text-2xl">⭐</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {content.tours.filter(t => t.featured).length}
        </p>
        <p className="text-xs text-gray-500 mt-2">Marcados como destacados</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">Contacto WhatsApp</h3>
          <span className="text-2xl">📱</span>
        </div>
        <p className="text-lg font-bold text-gray-900">{content.siteSettings.phone || 'No configurado'}</p>
        <p className="text-xs text-gray-500 mt-2">Número de contacto</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">Redes Sociales</h3>
          <span className="text-2xl">🌐</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {[content.siteSettings.facebookUrl, content.siteSettings.instagramUrl].filter(Boolean).length}/2
        </p>
        <p className="text-xs text-gray-500 mt-2">Configuradas</p>
      </div>

      {/* Quick Actions */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="/" target="_blank" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Ver Sitio Web</p>
              <p className="text-xs text-blue-600">Abrir en nueva pestaña</p>
            </div>
          </a>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-sm font-medium text-green-900">Editar Hero</p>
              <p className="text-xs text-green-600">Sección principal</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <span className="text-2xl">➕</span>
            <div>
              <p className="text-sm font-medium text-purple-900">Agregar Tour</p>
              <p className="text-xs text-purple-600">Nuevo destino</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="text-sm font-medium text-orange-900">Herramientas</p>
              <p className="text-xs text-orange-600">Sincronización</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Tours */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tours Recientes</h3>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <div className="space-y-3">
          {content.tours.slice(0, 3).map((tour) => (
            <div key={tour.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tour.gradient} flex items-center justify-center text-white font-bold`}>
                {tour.title[0]}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{tour.title}</h4>
                <p className="text-xs text-gray-500">{tour.tags.join(' • ')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${tour.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
                {tour.featured ? '⭐ Destacado' : 'Normal'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero Section (Placeholder)
function HeroSection({ content }: { content: Content }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Hero Section</h3>
      <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
          <input
            type="text"
            defaultValue={content.heroSection.tagline}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título Línea 1</label>
            <input
              type="text"
              defaultValue={content.heroSection.titleLine1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título Línea 2</label>
            <input
              type="text"
              defaultValue={content.heroSection.titleLine2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            defaultValue={content.heroSection.description}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

// Tours Section (Placeholder)
function ToursSection({ content }: { content: Content }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Gestión de Tours</h3>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
            + Agregar Tour
          </button>
        </div>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.tours.map((tour) => (
            <div key={tour.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={`w-full h-32 rounded-lg bg-gradient-to-r ${tour.gradient} mb-3`}></div>
              <h4 className="font-bold text-gray-900 mb-2">{tour.title}</h4>
              <p className="text-xs text-gray-600 mb-3">{tour.tags.join(' • ')}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors">
                  Editar
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Memoized ToursPage Card
const ToursPageCard = memo(function ToursPageCard({
  toursPage,
  onEdit
}: {
  toursPage: ToursPage;
  onEdit: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Página de Paquetes</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-1 hidden sm:block">Contenido de /tours</p>
        </div>
        <EditButton onClick={onEdit} label="Editar" compact />
      </div>
      <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg border border-gray-100 space-y-3">
        <SettingItem label="Título Hero" value={toursPage.heroTitle} />
        <SettingItem label="Subtítulo" value={toursPage.heroSubtitle} />
      </div>
    </motion.div>
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

// Footer Section (Placeholder)
function FooterSection({ content }: { content: Content }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Configuración del Footer</h3>
      <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título de Marca</label>
          <input
            type="text"
            defaultValue={content.footerSettings.brandTitle}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            defaultValue={content.footerSettings.brandDescription}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
          <input
            type="text"
            defaultValue={content.footerSettings.copyrightText}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
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
      packageDescription: null,
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

        {/* Tags con sugerencias */}
        <div>
          <TagInput
            tags={formData.tags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
          {/* Tags sugeridos */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Sugerencias:</p>
            <div className="flex flex-wrap gap-2">
              {['Día completo', 'Medio día', 'Multi-día', 'Navegación', 'Trekking', 'Glaciares', 'Carretera Austral', 'Puerto Tranquilo', 'Coyhaique', 'Todo incluido'].map((suggestion) => (
                !formData.tags.includes(suggestion) && (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFormData({ ...formData, tags: [...formData.tags, suggestion] })}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-cyan-100 text-gray-700 hover:text-cyan-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    + {suggestion}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Color del tour
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[
              { name: 'Cyan-Teal', value: 'from-cyan-600 to-teal-600' },
              { name: 'Azul', value: 'from-blue-600 to-blue-700' },
              { name: 'Gris Oscuro', value: 'from-gray-700 to-gray-800' },
              { name: 'Gris', value: 'from-gray-600 to-gray-700' },
              { name: 'Gris-Negro', value: 'from-gray-800 to-gray-900' },
              { name: 'Cyan-Teal 2', value: 'from-cyan-700 to-teal-700' },
              { name: 'Cyan-Teal 3', value: 'from-cyan-800 to-teal-800' },
              { name: 'Índigo', value: 'from-indigo-600 to-purple-600' },
            ].map((gradient) => (
              <button
                key={gradient.value}
                type="button"
                onClick={() => setFormData({ ...formData, gradient: gradient.value })}
                className={`relative h-16 rounded-xl bg-gradient-to-br ${gradient.value} transition-all duration-300 ${
                  formData.gradient === gradient.value
                    ? 'ring-4 ring-cyan-500 ring-offset-2 scale-105'
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
              >
                {formData.gradient === gradient.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Selecciona el color de fondo cuando no hay imagen</p>
        </div>

        {/* Card Size Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Tamaño de la tarjeta
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, colSpan: 4, rowSpan: 1, minHeight: '320px' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.colSpan === 4
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2" />
              <p className="text-xs font-bold text-gray-700">Pequeña</p>
              <p className="text-[10px] text-gray-500">1 columna</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, colSpan: 5, rowSpan: 1, minHeight: '290px' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.colSpan === 5
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-2" />
              <p className="text-xs font-bold text-gray-700">Mediana</p>
              <p className="text-[10px] text-gray-500">1 columna alta</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, colSpan: 7, rowSpan: 2, minHeight: '600px', featured: true })}
              className={`col-span-2 p-4 rounded-xl border-2 transition-all ${
                formData.colSpan >= 7
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg mb-2" />
              <p className="text-xs font-bold text-gray-700">Grande (Destacada)</p>
              <p className="text-[10px] text-gray-500">2 columnas, muy visible</p>
            </button>
          </div>
        </div>

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
            <TextAreaField
              label="Descripción del Paquete"
              value={formData.packageDescription || ''}
              onChange={(value) => setFormData({ ...formData, packageDescription: value || null })}
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

        {/* Orden */}
        <InputField
          label="Orden de aparición"
          type="number"
          value={formData.order.toString()}
          onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 0 })}
          placeholder="1, 2, 3..."
        />
      </div>
    </div>
  );
}

function ToursPageModal({
  content,
  onClose,
  onSave,
}: {
  content: ToursPage;
  onClose: () => void;
  onSave: (data: ToursPage) => void;
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
      const response = await fetch('/api/cms/tours-page', {
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
    <Modal title="Página de Paquetes Turísticos" onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Título Hero"
          value={formData.heroTitle}
          onChange={(value) => setFormData({ ...formData, heroTitle: value })}
        />
        <InputField
          label="Subtítulo Hero"
          value={formData.heroSubtitle}
          onChange={(value) => setFormData({ ...formData, heroSubtitle: value })}
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
  onUpdateContact: () => void;
  onSyncTours: () => void;
  isUpdatingContact: boolean;
  isSyncingTours: boolean;
  updateContactMessage: { type: 'success' | 'error'; text: string } | null;
  syncToursMessage: { type: 'success' | 'error'; text: string } | null;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Herramientas del Sistema</h3>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

        {/* Update Contact */}
        <div className="mb-6">
          <h4 className="text-md font-bold text-gray-900 mb-2">Actualizar Información de Contacto</h4>
          <p className="text-sm text-gray-600 mb-4">
            Sincroniza WhatsApp, Facebook, Instagram y Email con los datos reales de J&P Turismo.
          </p>
          <button
            onClick={onUpdateContact}
            disabled={isUpdatingContact}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {isUpdatingContact ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Actualizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar Contactos
              </>
            )}
          </button>
          {updateContactMessage && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              updateContactMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {updateContactMessage.text}
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-gray-200 my-6"></div>

        {/* Sync Tours */}
        <div>
          <h4 className="text-md font-bold text-gray-900 mb-2">Sincronizar Tours</h4>
          <p className="text-sm text-gray-600 mb-4">
            Agrega todos los tours faltantes (de 3 a 7 tours completos) a la base de datos.
          </p>
          <button
            onClick={onSyncTours}
            disabled={isSyncingTours}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {isSyncingTours ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sincronizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Sincronizar Tours
              </>
            )}
          </button>
          {syncToursMessage && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              syncToursMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {syncToursMessage.text}
            </div>
          )}
        </div>
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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Por favor sube una imagen en formato JPG, PNG o WebP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La imagen no puede superar los 5MB';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simular progreso durante el upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      onChange(data.url);

      // Limpiar después de un momento
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen. Por favor intenta nuevamente.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative h-56 mb-4 rounded-2xl overflow-hidden border-2 border-gray-200 group">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={handleClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white rounded-lg font-bold text-sm text-gray-900 hover:bg-gray-100"
            >
              Cambiar imagen
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {!value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-cyan-600 bg-cyan-50'
              : 'border-gray-300 hover:border-cyan-600 hover:bg-gray-50'
          } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <svg
            className={`mx-auto h-12 w-12 mb-4 transition-colors ${
              isDragging ? 'text-cyan-600' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm font-bold text-gray-700 mb-1">
            {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">JPG, PNG o WebP hasta 5MB</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-cyan-600">Subiendo imagen...</span>
            <span className="text-sm font-bold text-cyan-600">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-teal-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
