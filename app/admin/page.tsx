'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

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
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

interface Content {
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  siteSettings: SiteSettings;
}

type MenuItem = 'dashboard' | 'hero' | 'tours' | 'footer' | 'settings' | 'tools' | 'media';

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

  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: '📊' },
    { id: 'hero' as MenuItem, label: 'Hero Section', icon: '🏔️' },
    { id: 'tours' as MenuItem, label: 'Tours', icon: '🗺️' },
    { id: 'footer' as MenuItem, label: 'Footer', icon: '📄' },
    { id: 'settings' as MenuItem, label: 'Configuración', icon: '⚙️' },
    { id: 'tools' as MenuItem, label: 'Herramientas', icon: '🔧' },
    { id: 'media' as MenuItem, label: 'Medios', icon: '🖼️' },
  ];

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
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'dashboard' && <DashboardSection content={content} />}
              {activeSection === 'hero' && <HeroSection content={content} />}
              {activeSection === 'tours' && <ToursSection content={content} />}
              {activeSection === 'footer' && <FooterSection content={content} />}
              {activeSection === 'settings' && <SettingsSection content={content} />}
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
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
}

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

// Settings Section (Placeholder)
function SettingsSection({ content }: { content: Content }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Configuración General</h3>
      <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
            <input
              type="text"
              defaultValue={content.siteSettings.logoText}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Empresa</label>
            <input
              type="text"
              defaultValue={content.siteSettings.companyName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Título</label>
          <input
            type="text"
            defaultValue={content.siteSettings.metaTitle}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Descripción</label>
          <textarea
            defaultValue={content.siteSettings.metaDescription}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <h4 className="text-md font-bold text-gray-900 mb-3">Información de Contacto</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="text"
              defaultValue={content.siteSettings.phone || ''}
              placeholder="+56 9 XXXX XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={content.siteSettings.email || ''}
              placeholder="contacto@empresa.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
        <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
          Guardar Configuración
        </button>
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
}

// Media Section (Placeholder)
function MediaSection() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Biblioteca de Medios</h3>
      <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🖼️</span>
        <h4 className="text-xl font-bold text-gray-900 mb-2">Gestión de Medios</h4>
        <p className="text-gray-600 mb-6">Próximamente: Subir y gestionar imágenes de tours</p>
        <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
          Subir Imagen
        </button>
      </div>
    </div>
  );
}
