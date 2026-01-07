'use client';

import { useState } from 'react';
import { Database, RefreshCw, Spinner, AlertCircle, Check } from '@/components/icons';
import type { MessageState } from '@/types/cms';

interface ToolsSectionProps {
  onContactUpdate: () => Promise<void>;
  onToursSync: () => Promise<void>;
}

export function ToolsSection({ onContactUpdate, onToursSync }: ToolsSectionProps) {
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [isSyncingTours, setIsSyncingTours] = useState(false);
  const [updateContactMessage, setUpdateContactMessage] = useState<MessageState | null>(null);
  const [syncToursMessage, setSyncToursMessage] = useState<MessageState | null>(null);

  const handleContactUpdate = async () => {
    setIsUpdatingContact(true);
    setUpdateContactMessage(null);
    try {
      await onContactUpdate();
      setUpdateContactMessage({ type: 'success', text: 'Contacto actualizado correctamente' });
    } catch {
      setUpdateContactMessage({ type: 'error', text: 'Error al actualizar contacto' });
    } finally {
      setIsUpdatingContact(false);
    }
  };

  const handleToursSync = async () => {
    setIsSyncingTours(true);
    setSyncToursMessage(null);
    try {
      await onToursSync();
      setSyncToursMessage({ type: 'success', text: 'Tours sincronizados correctamente' });
    } catch {
      setSyncToursMessage({ type: 'error', text: 'Error al sincronizar tours' });
    } finally {
      setIsSyncingTours(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Herramientas de Sincronizacion</h3>
        <p className="text-sm text-gray-600 mb-6">
          Utiliza estas herramientas para mantener los datos sincronizados entre las diferentes
          secciones del sitio.
        </p>

        <div className="space-y-4">
          {/* Sync Contact */}
          <ToolCard
            icon={<Database className="w-6 h-6 text-blue-600" />}
            title="Sincronizar Contacto"
            description="Copia la informacion de contacto de Site Settings a Hero Section"
            buttonText="Actualizar Contacto"
            loading={isUpdatingContact}
            message={updateContactMessage}
            onClick={handleContactUpdate}
          />

          {/* Sync Tours */}
          <ToolCard
            icon={<RefreshCw className="w-6 h-6 text-green-600" />}
            title="Sincronizar Tours"
            description="Sincroniza el orden de los tours basado en el campo 'order'"
            buttonText="Sincronizar Tours"
            loading={isSyncingTours}
            message={syncToursMessage}
            onClick={handleToursSync}
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Tool Card
// ===========================================

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  loading: boolean;
  message: MessageState | null;
  onClick: () => void;
}

function ToolCard({
  icon,
  title,
  description,
  buttonText,
  loading,
  message,
  onClick,
}: ToolCardProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg border border-gray-200">{icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <button
            onClick={onClick}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4" />
                Procesando...
              </>
            ) : (
              buttonText
            )}
          </button>
          {message && (
            <div
              className={`mt-3 p-2 rounded-lg text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
