'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImageIcon, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;       // current image URL
  publicId?: string;    // current cloudinary public_id
  folder?: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: string; // e.g. "16/9", "1/1"
}

export default function ImageUpload({
  value,
  publicId,
  folder = 'misc',
  onUpload,
  onRemove,
  label = 'Upload Image',
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError('');
    setSuccess(false);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (publicId) formData.append('oldPublicId', publicId);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? 'Upload failed'); return; }

      onUpload(data.data.url, data.data.publicId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Upload failed. Check your Cloudinary config.');
    } finally {
      setUploading(false);
    }
  }, [folder, publicId, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  });

  const displayImage = preview || value;

  return (
    <div className="space-y-2">
      {label && <p className="text-xs text-[#555] uppercase tracking-wider">{label}</p>}

      {displayImage ? (
        <div className="relative rounded-xl overflow-hidden bg-[#0D0D0D] border border-[#1E1E1E]" style={{ aspectRatio }}>
          <img src={displayImage} alt="Upload preview" className="w-full h-full object-cover" />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white text-xs hover:bg-[#F97316] transition-colors">
                <Upload size={13} /> Replace
              </button>
            </div>
            {onRemove && (
              <button
                onClick={onRemove}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white text-xs hover:bg-red-500 transition-colors"
              >
                <X size={13} /> Remove
              </button>
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 size={24} className="text-[#F97316] animate-spin" />
            </div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={18} className="text-white" />
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center
            ${isDragActive
              ? 'border-[#F97316] bg-[#F97316]/5'
              : 'border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#F97316]/40 hover:bg-[#F97316]/3'
            }`}
          style={{ aspectRatio, minHeight: '140px' }}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <Loader2 size={28} className="text-[#F97316] animate-spin mb-3" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center mb-3">
              {isDragActive ? <Upload size={20} className="text-[#F97316]" /> : <ImageIcon size={20} className="text-[#555]" />}
            </div>
          )}

          <p className="text-sm text-white font-medium mb-1">
            {uploading ? 'Uploading...' : isDragActive ? 'Drop image here' : 'Drop image or click to browse'}
          </p>
          <p className="text-xs text-[#555]">JPG, PNG, WebP — max 10MB</p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
