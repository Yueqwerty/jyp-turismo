'use client';

import { useEffect } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField, TextAreaField } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import type { ToursSection } from '@/types/cms';

interface ToursSectionModalProps {
  content: ToursSection;
  onClose: () => void;
  onSave: (data: ToursSection) => void;
}

export function ToursSectionModal({ content, onClose, onSave }: ToursSectionModalProps) {
  const { formData, updateField, setFormData, saving, error, save } = useFormModal<ToursSection>({
    initialData: content,
    endpoint: '/api/cms/tours',
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
    <Modal title="Seccion de Tours" onClose={onClose} maxWidth="lg">
      <ModalContent>
        <InputField
          label="Titulo de Seccion"
          value={formData.sectionTitle}
          onChange={(v) => updateField('sectionTitle', v)}
        />
        <TextAreaField
          label="Descripcion de Seccion"
          value={formData.sectionDescription}
          onChange={(v) => updateField('sectionDescription', v)}
          rows={4}
        />
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
