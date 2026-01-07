'use client';

import Image from 'next/image';
import { Edit } from '@/components/icons';
import type { CMSContent } from '@/types/cms';

interface HeroSectionProps {
  content: CMSContent;
  onEdit: () => void;
}

export function HeroSection({ content, onEdit }: HeroSectionProps) {
  const { heroSection } = content;

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
        {/* Hero Image Preview */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src={heroSection.heroImage}
            alt={heroSection.heroImageAlt}
            fill
            className="object-cover"
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Tagline" value={heroSection.tagline} />
          <InfoField label="Badge" value={heroSection.heroBadgeText} />
        </div>

        <div>
          <InfoField
            label="Titulo"
            value={`${heroSection.titleLine1} ${heroSection.titleLine2}`}
            isTitle
          />
        </div>

        <InfoField label="Descripcion" value={heroSection.description} />

        <div className="grid grid-cols-2 gap-4">
          <InfoField label="WhatsApp" value={heroSection.whatsappNumber} />
          <InfoField label="Email" value={heroSection.email} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Facebook" value={heroSection.facebookUrl || 'No configurado'} />
          <InfoField label="Instagram" value={heroSection.instagramUrl || 'No configurado'} />
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Info Field Component
// ===========================================

interface InfoFieldProps {
  label: string;
  value: string;
  isTitle?: boolean;
}

function InfoField({ label, value, isTitle }: InfoFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <p className={`text-gray-900 ${isTitle ? 'text-lg font-bold' : 'text-sm'}`}>{value}</p>
    </div>
  );
}
