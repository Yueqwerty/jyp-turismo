'use client';

import { useEffect } from 'react';
import { Modal, ModalActions, ModalContent } from '@/components/ui/modal';
import { InputField, TextAreaField } from '@/components/ui/form-fields';
import { useFormModal } from '@/hooks/use-form-modal';
import type { SiteSettings } from '@/types/cms';

interface SettingsModalProps {
  content: SiteSettings;
  onClose: () => void;
  onSave: (data: SiteSettings) => void;
}

export function SettingsModal({ content, onClose, onSave }: SettingsModalProps) {
  const { formData, updateField, setFormData, saving, error, save } = useFormModal<SiteSettings>({
    initialData: content,
    endpoint: '/api/cms/settings',
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
    <Modal title="Configuracion del Sitio" onClose={onClose}>
      <ModalContent>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Logo Text"
            value={formData.logoText}
            onChange={(v) => updateField('logoText', v)}
          />
          <InputField
            label="Nombre de la Compania"
            value={formData.companyName}
            onChange={(v) => updateField('companyName', v)}
          />
        </div>
        <InputField
          label="Meta Titulo"
          value={formData.metaTitle}
          onChange={(v) => updateField('metaTitle', v)}
        />
        <TextAreaField
          label="Meta Descripcion"
          value={formData.metaDescription}
          onChange={(v) => updateField('metaDescription', v)}
          rows={3}
        />
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            Informacion de Contacto
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Telefono"
              value={formData.phone || ''}
              onChange={(v) => updateField('phone', v || null)}
            />
            <InputField
              label="WhatsApp"
              value={formData.whatsappNumber || ''}
              onChange={(v) => updateField('whatsappNumber', v || null)}
            />
          </div>
          <InputField
            label="Email"
            value={formData.email || ''}
            onChange={(v) => updateField('email', v || null)}
          />
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            Redes Sociales
          </h3>
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
        </div>
      </ModalContent>
      <ModalActions onClose={onClose} onSave={save} saving={saving} error={error} />
    </Modal>
  );
}
