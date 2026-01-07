'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, AlertCircle, X, Plus } from '@/components/icons';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/validations/cms';

// ===========================================
// Input Field
// ===========================================
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ===========================================
// TextArea Field
// ===========================================
interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  error?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  error,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 resize-none ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ===========================================
// Tag Input
// ===========================================
interface TagInputProps {
  label?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  label,
  tags,
  onTagsChange,
  placeholder = 'Agregar tag...',
}: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-lg text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-cyan-600 hover:text-cyan-900 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================
// Image Upload
// ===========================================
interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      return 'Solo se permiten imagenes JPG, PNG o WebP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La imagen no puede superar 5MB';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Error al subir imagen');
      }

      const data = await response.json();
      onChange(data.url);

      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
        {label}
      </label>

      {value && (
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden border-2 border-gray-200 group">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white rounded-lg font-bold text-sm text-gray-900 hover:bg-gray-100"
            >
              Cambiar imagen
            </button>
          </div>
        </div>
      )}

      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-600 bg-cyan-50'
              : 'border-gray-300 hover:border-cyan-600 hover:bg-gray-50'
          } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-cyan-600' : 'text-gray-400'}`} />
          <p className="text-sm font-bold text-gray-700 mb-1">
            {isDragging ? 'Suelta la imagen aqui' : 'Arrastra una imagen o haz clic'}
          </p>
          <p className="text-xs text-gray-500">JPG, PNG o WebP hasta 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
        disabled={uploading}
        className="hidden"
      />

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-cyan-600">Subiendo...</span>
            <span className="text-sm font-bold text-cyan-600">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-teal-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

// ===========================================
// Checkbox Field
// ===========================================
interface CheckboxFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, description, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 mt-0.5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
      />
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </label>
  );
}
