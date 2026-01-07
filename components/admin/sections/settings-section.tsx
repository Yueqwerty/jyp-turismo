'use client';

import { Edit, Globe, Phone } from '@/components/icons';
import type { CMSContent } from '@/types/cms';

interface SettingsSectionProps {
  content: CMSContent;
  onEdit: () => void;
}

export function SettingsSection({ content, onEdit }: SettingsSectionProps) {
  const { siteSettings } = content;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Configuracion del Sitio</h3>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="space-y-6">
          {/* Branding */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Marca
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Logo Text" value={siteSettings.logoText} />
              <InfoField label="Nombre de Compania" value={siteSettings.companyName} />
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3">SEO</h4>
            <div className="space-y-3">
              <InfoField label="Meta Titulo" value={siteSettings.metaTitle} />
              <InfoField label="Meta Descripcion" value={siteSettings.metaDescription} />
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contacto
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <InfoField label="Telefono" value={siteSettings.phone || 'No configurado'} />
              <InfoField label="WhatsApp" value={siteSettings.whatsappNumber || 'No configurado'} />
              <InfoField label="Email" value={siteSettings.email || 'No configurado'} />
            </div>
          </div>

          {/* Social */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Redes Sociales</h4>
            <div className="grid grid-cols-2 gap-4">
              <SocialLink label="Facebook" url={siteSettings.facebookUrl} />
              <SocialLink label="Instagram" url={siteSettings.instagramUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}

function SocialLink({ label, url }: { label: string; url?: string | null }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-600 hover:text-cyan-800 hover:underline truncate block"
        >
          {url}
        </a>
      ) : (
        <p className="text-sm text-gray-400">No configurado</p>
      )}
    </div>
  );
}
