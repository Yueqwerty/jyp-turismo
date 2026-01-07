'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

// Types
import type { CMSContent, AdminSection, ModalType, Tour } from '@/types/cms';

// Components
import { Sidebar } from '@/components/admin/sidebar';
import { Spinner } from '@/components/icons';

// Sections
import {
  DashboardSection,
  HeroSection,
  ToursSection,
  FooterSection,
  SettingsSection,
  ToolsSection,
} from '@/components/admin/sections';

// Modals
import {
  HeroModal,
  TourModal,
  FooterModal,
  SettingsModal,
  ToursSectionModal,
  ToursPageModal,
} from '@/components/admin/modals';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Fetch content
  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch('/api/cms/content');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth check and data loading
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchContent();
  }, [session, status, router, fetchContent]);

  // ===========================================
  // Modal Handlers
  // ===========================================

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => {
    setActiveModal(null);
    setSelectedTour(null);
  };

  const handleEditTour = (tour: Tour) => {
    setSelectedTour(tour);
    setActiveModal('tour');
  };

  const handleNewTour = () => {
    setSelectedTour(null);
    setActiveModal('tour');
  };

  // ===========================================
  // Save Handlers
  // ===========================================

  const handleHeroSave = (data: CMSContent['heroSection']) => {
    setContent((prev) => (prev ? { ...prev, heroSection: data } : null));
  };

  const handleTourSave = (data: Tour) => {
    setContent((prev) => {
      if (!prev) return null;
      const existingIndex = prev.tours.findIndex((t) => t.id === data.id);
      if (existingIndex >= 0) {
        const tours = [...prev.tours];
        tours[existingIndex] = data;
        return { ...prev, tours };
      }
      return { ...prev, tours: [...prev.tours, data] };
    });
  };

  const handleToursSectionSave = (data: CMSContent['toursSection']) => {
    setContent((prev) => (prev ? { ...prev, toursSection: data } : null));
  };

  const handleToursPageSave = (data: CMSContent['toursPage']) => {
    setContent((prev) => (prev ? { ...prev, toursPage: data } : null));
  };

  const handleFooterSave = (data: CMSContent['footerSettings']) => {
    setContent((prev) => (prev ? { ...prev, footerSettings: data } : null));
  };

  const handleSettingsSave = (data: CMSContent['siteSettings']) => {
    setContent((prev) => (prev ? { ...prev, siteSettings: data } : null));
  };

  // ===========================================
  // Delete Handler
  // ===========================================

  const handleDeleteTour = async (tourId: string) => {
    try {
      const response = await fetch(`/api/cms/tours/${tourId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      setContent((prev) =>
        prev ? { ...prev, tours: prev.tours.filter((t) => t.id !== tourId) } : null
      );
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  // ===========================================
  // Tools Handlers
  // ===========================================

  const handleContactUpdate = async () => {
    const response = await fetch('/api/admin/update-contact', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to update');
    await fetchContent();
  };

  const handleToursSync = async () => {
    const response = await fetch('/api/admin/sync-tours', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to sync');
    await fetchContent();
  };

  // ===========================================
  // Render
  // ===========================================

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4 text-cyan-600" />
          <p className="text-gray-600 font-medium">Cargando panel de administracion...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Error al cargar contenido</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            content={content}
            onEditHero={() => openModal('hero')}
            onEditTours={() => setActiveSection('tours')}
            onEditTools={() => setActiveSection('tools')}
          />
        );
      case 'hero':
        return <HeroSection content={content} onEdit={() => openModal('hero')} />;
      case 'tours':
        return (
          <ToursSection
            content={content}
            onNewTour={handleNewTour}
            onEditTour={handleEditTour}
            onDeleteTour={handleDeleteTour}
            onEditSection={() => openModal('tours-section')}
            onEditToursPage={() => openModal('tours-page')}
          />
        );
      case 'footer':
        return <FooterSection content={content} onEdit={() => openModal('footer')} />;
      case 'settings':
        return <SettingsSection content={content} onEdit={() => openModal('settings')} />;
      case 'tools':
        return (
          <ToolsSection onContactUpdate={handleContactUpdate} onToursSync={handleToursSync} />
        );
      default:
        return null;
    }
  };

  const sectionTitles: Record<AdminSection, string> = {
    dashboard: 'Dashboard',
    hero: 'Hero Section',
    tours: 'Gestion de Tours',
    footer: 'Footer',
    settings: 'Configuracion',
    tools: 'Herramientas',
    media: 'Media',
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        logoText={content.siteSettings.logoText}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionTitles[activeSection]}
          </h1>
          {renderSection()}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
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
        {activeModal === 'tours-page' && (
          <ToursPageModal
            content={content.toursPage}
            onClose={closeModal}
            onSave={handleToursPageSave}
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
