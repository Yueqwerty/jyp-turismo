'use client';

import { useEffect } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField, TextAreaField, CheckboxField } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import type { FooterSettings } from '@/types/cms';

interface FooterModalProps {
  content: FooterSettings;
  onClose: () => void;
  onSave: (data: FooterSettings) => void;
}

export function FooterModal({ content, onClose, onSave }: FooterModalProps) {
  const { formData, updateField, setFormData, saving, error, save } = useFormModal<FooterSettings>({
    initialData: content,
    endpoint: '/api/cms/footer',
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
    <Modal title="Editar Footer" onClose={onClose}>
      <ModalContent>
        <InputField
          label="Titulo de Marca"
          value={formData.brandTitle}
          onChange={(v) => updateField('brandTitle', v)}
        />
        <TextAreaField
          label="Descripcion"
          value={formData.brandDescription}
          onChange={(v) => updateField('brandDescription', v)}
          rows={4}
        />
        <InputField
          label="Texto de Copyright"
          value={formData.copyrightText}
          onChange={(v) => updateField('copyrightText', v)}
        />
        <CheckboxField
          label="Habilitar Newsletter"
          description="Muestra el formulario de newsletter en el footer"
          checked={formData.newsletterEnabled}
          onChange={(v) => updateField('newsletterEnabled', v)}
        />
        {formData.newsletterEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Titulo Newsletter"
              value={formData.newsletterTitle}
              onChange={(v) => updateField('newsletterTitle', v)}
            />
            <InputField
              label="Placeholder Newsletter"
              value={formData.newsletterPlaceholder}
              onChange={(v) => updateField('newsletterPlaceholder', v)}
            />
          </div>
        )}
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
