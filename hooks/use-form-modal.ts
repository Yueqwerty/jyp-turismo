'use client';

import { useState, useCallback } from 'react';

interface UseFormModalOptions<T> {
  initialData: T;
  endpoint: string;
  method?: 'POST' | 'PUT';
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseFormModalReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  saving: boolean;
  error: string | null;
  save: () => Promise<boolean>;
  reset: () => void;
}

export function useFormModal<T extends Record<string, any>>({
  initialData,
  endpoint,
  method = 'PUT',
  onSuccess,
  onError,
}: UseFormModalOptions<T>): UseFormModalReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Error al guardar';
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      }

      onSuccess?.(data);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexion';
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [endpoint, method, formData, onSuccess, onError]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setError(null);
  }, [initialData]);

  return {
    formData,
    setFormData,
    updateField,
    saving,
    error,
    save,
    reset,
  };
}

// ===========================================
// Generic API Hook
// ===========================================
interface UseApiOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useApi({ onSuccess, onError }: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
          ...options,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || 'Error en la peticion';
          setError(errorMessage);
          onError?.(errorMessage);
          return null;
        }

        onSuccess?.();
        return data as T;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error de conexion';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return { execute, loading, error };
}

// ===========================================
// Content Fetching Hook
// ===========================================
export function useContent<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await window.fetch(endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al cargar datos');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexion');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((endpoint: string) => {
    return fetch(endpoint);
  }, [fetch]);

  return { data, loading, error, fetch, refetch, setData };
}
