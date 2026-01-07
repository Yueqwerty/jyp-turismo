'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField, TextAreaField, ImageUpload, TagInput, CheckboxField } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import { Check, Star } from '@/components/icons';
import type { Tour } from '@/types/cms';
import { DEFAULT_TOUR, GRADIENT_OPTIONS } from '@/types/cms';

interface TourModalProps {
  tour: Tour | null;
  onClose: () => void;
  onSave: (data: Tour) => void;
}

export function TourModal({ tour, onClose, onSave }: TourModalProps) {
  const isNew = !tour;
  const initialData = tour || DEFAULT_TOUR;

  const { formData, updateField, setFormData, saving, error, save } = useFormModal<Tour>({
    initialData: initialData as Tour,
    endpoint: isNew ? '/api/cms/tours' : `/api/cms/tours/${tour?.id}`,
    method: isNew ? 'POST' : 'PUT',
    onSuccess: (data) => {
      onSave(data);
      onClose();
    },
  });

  useEffect(() => {
    setFormData(tour || (DEFAULT_TOUR as Tour));
  }, [tour, setFormData]);

  return (
    <Modal title={isNew ? 'Crear Tour' : 'Editar Tour'} onClose={onClose}>
      <ModalContent>
        <InputField
          label="Titulo"
          value={formData.title}
          onChange={(v) => updateField('title', v)}
        />
        <TextAreaField
          label="Descripcion (opcional)"
          value={formData.description || ''}
          onChange={(v) => updateField('description', v || null)}
        />
        <TagInput
          label="Tags"
          tags={formData.tags}
          onTagsChange={(tags) => updateField('tags', tags)}
        />

        {/* Gradient Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Color del Tour
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {GRADIENT_OPTIONS.map((gradient) => (
              <button
                key={gradient.value}
                type="button"
                onClick={() => updateField('gradient', gradient.value)}
                className={`relative h-14 rounded-xl bg-gradient-to-br ${gradient.value} transition-all duration-300 ${
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

        <CheckboxField
          label="Tour Destacado"
          description="Aparecera mas grande en la grilla"
          checked={formData.featured}
          onChange={(v) => updateField('featured', v)}
        />

        <ImageUpload
          label="Imagen"
          value={formData.image}
          onChange={(v) => updateField('image', v)}
        />

        {/* Package Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            Informacion de Paquete (Opcional)
          </h3>
          <div className="space-y-4">
            <InputField
              label="Nombre del Paquete"
              value={formData.packageName || ''}
              onChange={(v) => updateField('packageName', v || null)}
              placeholder="Ej: Paquete Aventura"
            />
            <TextAreaField
              label="Descripcion del Paquete"
              value={formData.packageDescription || ''}
              onChange={(v) => updateField('packageDescription', v || null)}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Precio"
                value={formData.packagePrice || ''}
                onChange={(v) => updateField('packagePrice', v || null)}
                placeholder="Ej: $150.000"
              />
              <InputField
                label="Duracion"
                value={formData.packageDuration || ''}
                onChange={(v) => updateField('packageDuration', v || null)}
                placeholder="Ej: 3 dias / 2 noches"
              />
            </div>
            <TagInput
              label="Incluye"
              tags={formData.packageIncludes || []}
              onTagsChange={(tags) => updateField('packageIncludes', tags)}
              placeholder="Ej: Transporte incluido"
            />
          </div>
        </div>

        <InputField
          label="Orden de aparicion"
          type="number"
          value={formData.order.toString()}
          onChange={(v) => updateField('order', parseInt(v) || 0)}
          placeholder="1, 2, 3..."
        />
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
