'use client';

import { Edit } from '@/components/icons';
import type { CMSContent } from '@/types/cms';

interface FooterSectionProps {
  content: CMSContent;
  onEdit: () => void;
}

export function FooterSection({ content, onEdit }: FooterSectionProps) {
  const { footerSettings } = content;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Footer</h3>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      <div className="space-y-4">
        <InfoField label="Titulo de Marca" value={footerSettings.brandTitle} />
        <InfoField label="Descripcion" value={footerSettings.brandDescription} />
        <InfoField label="Copyright" value={footerSettings.copyrightText} />

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Newsletter</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  footerSettings.newsletterEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {footerSettings.newsletterEnabled ? 'Habilitado' : 'Deshabilitado'}
              </span>
            </div>
            <InfoField label="Titulo" value={footerSettings.newsletterTitle} />
            <InfoField label="Placeholder" value={footerSettings.newsletterPlaceholder} />
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
      <p className="text-sm text-gray-900 whitespace-pre-line">{value}</p>
    </div>
  );
}
