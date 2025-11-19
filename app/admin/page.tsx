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
  { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'hero' as MenuItem, label: 'Hero Section', icon: 'Image' },
  { id: 'tours' as MenuItem, label: 'Tours', icon: 'Map' },
  { id: 'footer' as MenuItem, label: 'Footer', icon: 'AlignBottom' },
  { id: 'settings' as MenuItem, label: 'Configuración', icon: 'Settings' },
  { id: 'tools' as MenuItem, label: 'Herramientas', icon: 'Wrench' },
  { id: 'media' as MenuItem, label: 'Medios', icon: 'FolderImage' },
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
  const [activeModal, setActiveModal] = useState<'hero' | 'tour' | 'tours-section' | 'footer' | 'settings' | 'tours-page' | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

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
          text: 'Información de contacto actualizada correctamente'
        });
        await fetchContent();
      } else {
        setUpdateContactMessage({
          type: 'error',
          text: 'Error: ' + (data.error || 'Error desconocido')
        });
      }
    } catch (error) {
      setUpdateContactMessage({
        type: 'error',
        text: 'Error de conexión'
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
          text: data.message
        });
        await fetchContent();
      } else {
        setSyncToursMessage({
          type: 'error',
          text: 'Error: ' + (data.error || 'Error desconocido')
        });
      }
    } catch (error) {
      setSyncToursMessage({
        type: 'error',
        text: 'Error de conexión'
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
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full flex justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
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
              <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
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
            <LogOut className="w-5 h-5 flex-shrink-0" />
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
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeSection === 'dashboard' && <DashboardSection content={content} onEditHero={() => setActiveModal('hero')} onEditTours={() => setActiveSection('tours')} onEditTools={() => setActiveSection('tools')} />}
          {activeSection === 'hero' && <HeroSection content={content} onEdit={() => setActiveModal('hero')} />}
          {activeSection === 'tours' && <ToursSection content={content} onNewTour={handleNewTour} onEditTour={handleTourClick} onDeleteTour={handleTourDelete} onEditSection={() => setActiveModal('tours-section')} onEditToursPage={() => setActiveModal('tours-page')} />}
          {activeSection === 'footer' && <FooterSection content={content} onEdit={() => setActiveModal('footer')} />}
          {activeSection === 'settings' && <SettingsSection content={content} onEdit={() => setActiveModal('settings')} />}
          {activeSection === 'tools' && (
            <ToolsSection
              onUpdateContact={handleUpdateContact}
              onSyncTours={handleSyncTours}
              isUpdatingContact={isUpdatingContact}
              isSyncingTours={isSyncingTours}
              updateContactMessage={updateContactMessage}
              syncToursMessage={syncToursMessage}
            />
          )}
          {activeSection === 'media' && <MediaSection />}
        </main>
      </div>

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
function DashboardSection({ content, onEditHero, onEditTours, onEditTools }: { content: Content; onEditHero: () => void; onEditTours: () => void; onEditTools: () => void }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Total Tours</h3>
            <Map className="w-6 h-6 text-cyan-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{content.tours.length}</p>
          <p className="text-xs text-gray-500 mt-2">Tours activos en el sitio</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Tours Destacados</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {content.tours.filter(t => t.featured).length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Marcados como destacados</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Contacto WhatsApp</h3>
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-lg font-bold text-gray-900">{content.siteSettings.phone || 'No configurado'}</p>
          <p className="text-xs text-gray-500 mt-2">Número de contacto</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Redes Sociales</h3>
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {[content.siteSettings.facebookUrl, content.siteSettings.instagramUrl].filter(Boolean).length}/2
          </p>
          <p className="text-xs text-gray-500 mt-2">Configuradas</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Ver Sitio Web</p>
              <p className="text-xs text-blue-600">Abrir en nueva pestaña</p>
            </div>
          </a>
          <button
            onClick={onEditHero}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Editar Hero</p>
              <p className="text-xs text-green-600">Sección principal</p>
            </div>
          </button>
          <button
            onClick={onEditTours}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-900">Gestionar Tours</p>
              <p className="text-xs text-purple-600">Ver todos los tours</p>
            </div>
          </button>
          <button
            onClick={onEditTools}
            className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <Wrench className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-900">Herramientas</p>
              <p className="text-xs text-orange-600">Sincronización</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Tours */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tours Recientes</h3>
        <div className="space-y-3">
          {content.tours.slice(0, 5).map((tour) => (
            <div key={tour.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tour.gradient} flex items-center justify-center text-white font-bold`}>
                {tour.title[0]}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{tour.title}</h4>
                <p className="text-xs text-gray-500">{tour.tags.join(' • ')}</p>
              </div>
              {tour.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Destacado
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero Section
function HeroSection({ content, onEdit }: { content: Content; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Hero Section</h3>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src={content.heroSection.heroImage}
            alt={content.heroSection.heroImageAlt}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
            <p className="text-sm text-gray-900">{content.heroSection.tagline}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Badge</label>
            <p className="text-sm text-gray-900">{content.heroSection.heroBadgeText}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
          <p className="text-lg font-bold text-gray-900">
            {content.heroSection.titleLine1} {content.heroSection.titleLine2}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
          <p className="text-sm text-gray-900">{content.heroSection.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
            <p className="text-sm text-gray-900">{content.heroSection.whatsappNumber}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <p className="text-sm text-gray-900">{content.heroSection.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tours Section
function ToursSection({
  content,
  onNewTour,
  onEditTour,
  onDeleteTour,
  onEditSection,
  onEditToursPage
}: {
  content: Content;
  onNewTour: () => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
  onEditSection: () => void;
  onEditToursPage: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Sección de Tours (Homepage)</h3>
          <button
            onClick={onEditSection}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Sección
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
            <p className="text-sm text-gray-900">{content.toursSection.sectionTitle}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
            <p className="text-sm text-gray-900">{content.toursSection.sectionDescription}</p>
          </div>
        </div>
      </div>

      {/* Tours Page Config */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Página de Paquetes (/tours)</h3>
          <button
            onClick={onEditToursPage}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Página
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título Hero</label>
            <p className="text-sm text-gray-900">{content.toursPage.heroTitle}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo</label>
            <p className="text-sm text-gray-900">{content.toursPage.heroSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Gestión de Tours ({content.tours.length})</h3>
          <button
            onClick={onNewTour}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Tour
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.tours.map((tour) => (
            <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-32">
                <Image src={tour.image} alt={tour.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex-1">{tour.title}</h4>
                  {tour.featured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-600 mb-3">{tour.tags.join(' • ')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditTour(tour)}
                    className="flex-1 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteTour(tour.id)}
                    className="flex-1 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Footer Section
function FooterSection({ content, onEdit }: { content: Content; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Configuración del Footer</h3>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Título de Marca</label>
          <p className="text-sm text-gray-900">{content.footerSettings.brandTitle}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
          <p className="text-sm text-gray-900">{content.footerSettings.brandDescription}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Copyright</label>
          <p className="text-sm text-gray-900">{content.footerSettings.copyrightText}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Newsletter</label>
          <p className="text-sm text-gray-900">{content.footerSettings.newsletterEnabled ? 'Habilitado' : 'Deshabilitado'}</p>
        </div>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection({ content, onEdit }: { content: Content; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Configuración del Sitio</h3>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Logo Text</label>
          <p className="text-sm text-gray-900">{content.siteSettings.logoText}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la Compañía</label>
          <p className="text-sm text-gray-900">{content.siteSettings.companyName}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Meta Título</label>
          <p className="text-sm text-gray-900">{content.siteSettings.metaTitle}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Meta Descripción</label>
          <p className="text-sm text-gray-900">{content.siteSettings.metaDescription}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
          <p className="text-sm text-gray-900">{content.siteSettings.phone || 'No configurado'}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
          <p className="text-sm text-gray-900">{content.siteSettings.whatsappNumber || 'No configurado'}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <p className="text-sm text-gray-900">{content.siteSettings.email || 'No configurado'}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Facebook URL</label>
          <p className="text-sm text-gray-900">{content.siteSettings.facebookUrl || 'No configurado'}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Instagram URL</label>
          <p className="text-sm text-gray-900">{content.siteSettings.instagramUrl || 'No configurado'}</p>
        </div>
      </div>
    </div>
  );
}

// Media Section
function MediaSection() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Gestión de Medios</h3>
      <div className="text-center py-12">
        <FolderImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Gestión de medios próximamente...</p>
        <p className="text-sm text-gray-500 mt-2">Aquí podrás administrar todas tus imágenes y archivos multimedia</p>
      </div>
    </div>
  );
}

// Tools Section
function ToolsSection({
  onUpdateContact,
  onSyncTours,
  isUpdatingContact,
  isSyncingTours,
  updateContactMessage,
  syncToursMessage,
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
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Actualizar Información de Contacto
        </h3>
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
              <RefreshCw className="w-4 h-4" />
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

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Sincronizar Tours
        </h3>
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
              <Database className="w-4 h-4" />
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
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
          <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${isDragging ? 'text-cyan-600' : 'text-gray-400'}`} />
          <p className="text-sm font-bold text-gray-700 mb-1">
            {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">JPG, PNG o WebP hasta 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

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

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

// Helper Input Components
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
      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
      />
    </div>
  );
}

function TagInput({
  label,
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  placeholder,
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
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
          placeholder={placeholder || 'Agregar tag...'}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
        />
        <button
          type="button"
          onClick={onAddTag}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-lg text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="text-cyan-600 hover:text-cyan-900 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/25 inline-flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Guardando...
          </>
        ) : (
          'Guardar Cambios'
        )}
      </button>
    </div>
  );
}

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
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <TextAreaField
          label="Descripción"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <InputField
          label="WhatsApp"
          value={formData.whatsappNumber}
          onChange={(value) => setFormData({ ...formData, whatsappNumber: value })}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        <ImageUpload
          label="Imagen Hero"
          value={formData.heroImage}
          onChange={(value) => setFormData({ ...formData, heroImage: value })}
        />
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
      packageDescription: null,
      packagePrice: null,
      packageDuration: null,
      packageIncludes: [],
    }
  );
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [packageIncludeInput, setPackageIncludeInput] = useState('');

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

        <TagInput
          tags={formData.tags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

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
                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4" />
            Tour Destacado
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-700">Marcar como destacado (aparecerá más grande)</span>
          </label>
        </div>

        <ImageUpload
          label="Imagen"
          value={formData.image}
          onChange={(value) => setFormData({ ...formData, image: value })}
        />

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

        <InputField
          label="Orden de aparición"
          type="number"
          value={formData.order.toString()}
          onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 0 })}
          placeholder="1, 2, 3..."
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
          label="Copyright"
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
          label="Logo Text"
          value={formData.logoText}
          onChange={(value) => setFormData({ ...formData, logoText: value })}
        />
        <InputField
          label="Nombre de la Compañía"
          value={formData.companyName}
          onChange={(value) => setFormData({ ...formData, companyName: value })}
        />
        <InputField
          label="Meta Título"
          value={formData.metaTitle}
          onChange={(value) => setFormData({ ...formData, metaTitle: value })}
        />
        <TextAreaField
          label="Meta Descripción"
          value={formData.metaDescription}
          onChange={(value) => setFormData({ ...formData, metaDescription: value })}
        />
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

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms/tours-section', {
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
    <Modal title="Sección de Tours" onClose={onClose}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <InputField
          label="Título de Sección"
          value={formData.sectionTitle}
          onChange={(value) => setFormData({ ...formData, sectionTitle: value })}
        />
        <TextAreaField
          label="Descripción de Sección"
          value={formData.sectionDescription}
          onChange={(value) => setFormData({ ...formData, sectionDescription: value })}
        />
      </div>
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
    </Modal>
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

// Icon Components (SVG)
function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    LayoutDashboard: <LayoutDashboard className={className} />,
    Image: <ImageIcon className={className} />,
    Map: <Map className={className} />,
    AlignBottom: <AlignBottom className={className} />,
    Settings: <Settings className={className} />,
    Wrench: <Wrench className={className} />,
    FolderImage: <FolderImage className={className} />,
  };

  return icons[name] || null;
}

// Lucide-style icon components
function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function Map({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
      <path d="M8 2v16M16 6v16" />
    </svg>
  );
}

function AlignBottom({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 20h16M4 10h16M4 4h16" />
    </svg>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Wrench({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function FolderImage({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <circle cx="10" cy="13" r="2" />
      <path d="M20 17l-3-3" />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LogOut({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function Edit({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function Trash({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function Phone({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function Database({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}
