'use client';

import { MapIcon, Star, Phone, Globe, ExternalLink, Edit, Plus, Wrench } from '@/components/icons';
import type { CMSContent } from '@/types/cms';

interface DashboardSectionProps {
  content: CMSContent;
  onEditHero: () => void;
  onEditTours: () => void;
  onEditTools: () => void;
}

export function DashboardSection({
  content,
  onEditHero,
  onEditTours,
  onEditTools,
}: DashboardSectionProps) {
  const featuredToursCount = content.tours.filter((t) => t.featured).length;
  const socialCount = [content.siteSettings.facebookUrl, content.siteSettings.instagramUrl].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tours"
          value={content.tours.length}
          description="Tours activos en el sitio"
          icon={<MapIcon className="w-6 h-6 text-cyan-600" />}
        />
        <StatCard
          title="Tours Destacados"
          value={featuredToursCount}
          description="Marcados como destacados"
          icon={<Star className="w-6 h-6 text-yellow-500" />}
        />
        <StatCard
          title="Contacto WhatsApp"
          value={content.siteSettings.phone || 'No configurado'}
          description="Numero de contacto"
          icon={<Phone className="w-6 h-6 text-green-600" />}
          isText
        />
        <StatCard
          title="Redes Sociales"
          value={`${socialCount}/2`}
          description="Configuradas"
          icon={<Globe className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rapidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/"
            icon={<ExternalLink className="w-5 h-5 text-blue-600" />}
            title="Ver Sitio Web"
            subtitle="Abrir en nueva pestana"
            variant="blue"
          />
          <QuickAction
            onClick={onEditHero}
            icon={<Edit className="w-5 h-5 text-green-600" />}
            title="Editar Hero"
            subtitle="Seccion principal"
            variant="green"
          />
          <QuickAction
            onClick={onEditTours}
            icon={<Plus className="w-5 h-5 text-purple-600" />}
            title="Gestionar Tours"
            subtitle="Ver todos los tours"
            variant="purple"
          />
          <QuickAction
            onClick={onEditTools}
            icon={<Wrench className="w-5 h-5 text-orange-600" />}
            title="Herramientas"
            subtitle="Sincronizacion"
            variant="orange"
          />
        </div>
      </div>

      {/* Recent Tours */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tours Recientes</h3>
        <div className="space-y-3">
          {content.tours.slice(0, 5).map((tour) => (
            <div
              key={tour.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tour.gradient} flex items-center justify-center text-white font-bold`}
              >
                {tour.title[0]}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{tour.title}</h4>
                <p className="text-xs text-gray-500">{tour.tags.join(' - ')}</p>
              </div>
              {tour.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Destacado
                </span>
              )}
            </div>
          ))}
          {content.tours.length === 0 && (
            <p className="text-center text-gray-500 py-4">No hay tours creados</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Sub-components
// ===========================================

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  isText?: boolean;
}

function StatCard({ title, value, description, icon, isText }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <p className={`font-bold text-gray-900 ${isText ? 'text-lg' : 'text-3xl'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
}

interface QuickActionProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  variant: 'blue' | 'green' | 'purple' | 'orange';
}

const variantClasses = {
  blue: 'bg-blue-50 hover:bg-blue-100 text-blue-900',
  green: 'bg-green-50 hover:bg-green-100 text-green-900',
  purple: 'bg-purple-50 hover:bg-purple-100 text-purple-900',
  orange: 'bg-orange-50 hover:bg-orange-100 text-orange-900',
};

const subtitleVariantClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
};

function QuickAction({ href, onClick, icon, title, subtitle, variant }: QuickActionProps) {
  const className = `flex items-center gap-3 p-4 rounded-lg transition-colors cursor-pointer ${variantClasses[variant]}`;

  const content = (
    <>
      {icon}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className={`text-xs ${subtitleVariantClasses[variant]}`}>{subtitle}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
