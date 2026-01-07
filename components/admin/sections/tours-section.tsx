'use client';

import Image from 'next/image';
import { Edit, Plus, Trash, Star } from '@/components/icons';
import type { CMSContent, Tour } from '@/types/cms';

interface ToursSectionProps {
  content: CMSContent;
  onNewTour: () => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
  onEditSection: () => void;
  onEditToursPage: () => void;
}

export function ToursSection({
  content,
  onNewTour,
  onEditTour,
  onDeleteTour,
  onEditSection,
  onEditToursPage,
}: ToursSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Seccion de Tours (Homepage)</h3>
          <button
            onClick={onEditSection}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Seccion
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Titulo</label>
            <p className="text-sm text-gray-900">{content.toursSection.sectionTitle}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descripcion</label>
            <p className="text-sm text-gray-900">{content.toursSection.sectionDescription}</p>
          </div>
        </div>
      </div>

      {/* Tours Page Config */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Pagina de Paquetes (/tours)</h3>
          <button
            onClick={onEditToursPage}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Pagina
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Titulo Hero</label>
            <p className="text-sm text-gray-900">{content.toursPage.heroTitle}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subtitulo</label>
            <p className="text-sm text-gray-900">{content.toursPage.heroSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Gestion de Tours ({content.tours.length})</h3>
          <button
            onClick={onNewTour}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Tour
          </button>
        </div>
        {content.tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.tours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onEdit={() => onEditTour(tour)}
                onDelete={() => onDeleteTour(tour.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay tours creados</p>
            <button
              onClick={onNewTour}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear primer tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================
// Tour Card
// ===========================================

interface TourCardProps {
  tour: Tour;
  onEdit: () => void;
  onDelete: () => void;
}

function TourCard({ tour, onEdit, onDelete }: TourCardProps) {
  const handleDelete = () => {
    if (window.confirm('Estas seguro de que quieres eliminar este tour?')) {
      onDelete();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32">
        {tour.image ? (
          <Image src={tour.image} alt={tour.title} fill className="object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold text-gray-900 flex-1 line-clamp-1">{tour.title}</h4>
          {tour.featured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-600 mb-3 line-clamp-1">{tour.tags.join(' - ')}</p>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors flex items-center justify-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors flex items-center justify-center gap-1"
          >
            <Trash className="w-3 h-3" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
