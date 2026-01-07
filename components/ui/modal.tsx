'use client';

import { motion } from 'framer-motion';
import { X, Spinner } from '@/components/icons';

// ===========================================
// Modal Base Component
// ===========================================
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

export function Modal({ title, children, onClose, maxWidth = '3xl' }: ModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ===========================================
// Modal Actions (Footer Buttons)
// ===========================================
interface ModalActionsProps {
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  saveText?: string;
  cancelText?: string;
  error?: string | null;
}

export function ModalActions({
  onClose,
  onSave,
  saving,
  saveText = 'Guardar Cambios',
  cancelText = 'Cancelar',
  error,
}: ModalActionsProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl font-bold transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/25 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <Spinner className="w-4 h-4" />
              Guardando...
            </>
          ) : (
            saveText
          )}
        </button>
      </div>
    </div>
  );
}

// ===========================================
// Modal Content Wrapper (for scrollable content)
// ===========================================
interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return (
    <div className={`max-h-[60vh] overflow-y-auto px-1 space-y-6 ${className}`}>
      {children}
    </div>
  );
}

// ===========================================
// Confirm Dialog
// ===========================================
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const variantClasses = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-amber-600 hover:bg-amber-700',
  info: 'bg-blue-600 hover:bg-blue-700',
};

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${variantClasses[variant]}`}
          >
            {loading && <Spinner className="w-4 h-4" />}
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
