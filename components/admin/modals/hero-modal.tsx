'use client';

import { useEffect } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField, TextAreaField, ImageUpload } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import type { HeroSection } from '@/types/cms';

interface HeroModalProps {
  content: HeroSection;
  onClose: () => void;
  onSave: (data: HeroSection) => void;
}

export function HeroModal({ content, onClose, onSave }: HeroModalProps) {
  const { formData, updateField, setFormData, saving, error, save } = useFormModal<HeroSection>({
    initialData: content,
    endpoint: '/api/cms/hero',
    method: 'PUT',
    onSuccess: (data) => {
      onSave(data);
      onClose();
    },
  });

  useEffect(() => {
    setFormData(content);
  }, [content, setFormData]);

  return (
    <Modal title="Editar Hero Section" onClose={onClose}>
      <ModalContent>
        <InputField
          label="Tagline"
          value={formData.tagline}
          onChange={(v) => updateField('tagline', v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Titulo Linea 1"
            value={formData.titleLine1}
            onChange={(v) => updateField('titleLine1', v)}
          />
          <InputField
            label="Titulo Linea 2"
            value={formData.titleLine2}
            onChange={(v) => updateField('titleLine2', v)}
          />
        </div>
        <TextAreaField
          label="Descripcion"
          value={formData.description}
          onChange={(v) => updateField('description', v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="WhatsApp"
            value={formData.whatsappNumber}
            onChange={(v) => updateField('whatsappNumber', v)}
          />
          <InputField
            label="Email"
            value={formData.email}
            onChange={(v) => updateField('email', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Facebook URL"
            value={formData.facebookUrl || ''}
            onChange={(v) => updateField('facebookUrl', v || null)}
          />
          <InputField
            label="Instagram URL"
            value={formData.instagramUrl || ''}
            onChange={(v) => updateField('instagramUrl', v || null)}
          />
        </div>
        <ImageUpload
          label="Imagen Hero"
          value={formData.heroImage}
          onChange={(v) => updateField('heroImage', v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Alt de Imagen"
            value={formData.heroImageAlt}
            onChange={(v) => updateField('heroImageAlt', v)}
          />
          <InputField
            label="Badge Text"
            value={formData.heroBadgeText}
            onChange={(v) => updateField('heroBadgeText', v)}
          />
        </div>
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
