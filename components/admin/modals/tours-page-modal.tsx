'use client';

import { useEffect } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import type { ToursPage } from '@/types/cms';

interface ToursPageModalProps {
  content: ToursPage;
  onClose: () => void;
  onSave: (data: ToursPage) => void;
}

export function ToursPageModal({ content, onClose, onSave }: ToursPageModalProps) {
  const { formData, updateField, setFormData, saving, error, save } = useFormModal<ToursPage>({
    initialData: content,
    endpoint: '/api/cms/tours-page',
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
    <Modal title="Pagina de Paquetes Turisticos" onClose={onClose} maxWidth="lg">
      <ModalContent>
        <InputField
          label="Titulo Hero"
          value={formData.heroTitle}
          onChange={(v) => updateField('heroTitle', v)}
        />
        <InputField
          label="Subtitulo Hero"
          value={formData.heroSubtitle}
          onChange={(v) => updateField('heroSubtitle', v)}
        />
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
