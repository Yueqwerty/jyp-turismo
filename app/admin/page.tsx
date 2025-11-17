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
  infoCard1Title: string;
  infoCard1Subtitle: string;
  infoCard2Title: string;
  infoCard2Subtitle: string;
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
  phone?: string;
  whatsappNumber?: string;
  email?: string;
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
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
                  <span className="text-blue-600">{content.heroSection.titleLine2}</span>
                </h3>
                <p className="text-lg text-gray-600">{content.heroSection.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-xl font-black text-blue-600">{content.heroSection.infoCard1Title}</div>
                    <div className="text-xs font-bold text-blue-900 uppercase">{content.heroSection.infoCard1Subtitle}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-black text-gray-900">{content.heroSection.infoCard2Title}</div>
                    <div className="text-xs font-bold text-gray-700 uppercase">{content.heroSection.infoCard2Subtitle}</div>
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg"
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg"
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
                <p className="text-sm font-bold text-gray-900">{content.siteSettings.email || 'No configurado'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Teléfono</span>
                <p className="text-sm font-bold text-gray-900">{content.siteSettings.phone || 'No configurado'}</p>
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
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Info Card 1 - Título"
            value={formData.infoCard1Title}
            onChange={(value) => setFormData({ ...formData, infoCard1Title: value })}
          />
          <InputField
            label="Info Card 1 - Subtítulo"
            value={formData.infoCard1Subtitle}
            onChange={(value) => setFormData({ ...formData, infoCard1Subtitle: value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Info Card 2 - Título"
            value={formData.infoCard2Title}
            onChange={(value) => setFormData({ ...formData, infoCard2Title: value })}
          />
          <InputField
            label="Info Card 2 - Subtítulo"
            value={formData.infoCard2Subtitle}
            onChange={(value) => setFormData({ ...formData, infoCard2Subtitle: value })}
          />
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
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
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
      gradient: 'from-blue-600 to-blue-700',
      colSpan: 4,
      rowSpan: 1,
      minHeight: '320px',
      featured: false,
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

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
              className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-bold flex items-center gap-2"
              >
                {tag}
                <button onClick={() => removeTag(i)} className="text-blue-600 hover:text-blue-800">
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
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
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
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
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
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
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
          value={formData.email || ''}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        <InputField
          label="Teléfono"
          value={formData.phone || ''}
          onChange={(value) => setFormData({ ...formData, phone: value })}
        />
        <InputField
          label="WhatsApp"
          value={formData.whatsappNumber || ''}
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
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
