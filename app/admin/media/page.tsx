'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2, Copy, Check, Loader2, ImageIcon, X, ExternalLink, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaItem {
  url: string;
  publicId: string;
  name: string;
  folder: string;
  uploadedAt: string;
}

const FOLDERS = [
  { value: 'projects', label: '📁 Projects' },
  { value: 'blog', label: '📝 Blog' },
  { value: 'testimonials', label: '⭐ Testimonials' },
  { value: 'avatar', label: '👤 Avatar' },
  { value: 'misc', label: '🗂️ Misc' },
];

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('misc');
  const [copiedId, setCopiedId] = useState('');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState('');

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true);
    const results: MediaItem[] = [];
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          results.push({
            url: data.data?.url ?? data.url,
            publicId: data.data?.publicId ?? data.publicId,
            name: file.name,
            folder,
            uploadedAt: new Date().toISOString(),
          });
        } else {
          toast.error(`Failed: ${file.name}`);
        }
      } catch {
        toast.error(`Error uploading ${file.name}`);
      }
    }
    if (results.length) {
      setItems(prev => [...results, ...prev]);
      toast.success(`${results.length} file${results.length > 1 ? 's' : ''} uploaded!`);
    }
    setUploading(false);
  }, [folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] },
    disabled: uploading,
  });

  async function deleteItem(item: MediaItem) {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: item.publicId }),
      });
      setItems(prev => prev.filter(i => i.publicId !== item.publicId));
      if (selected?.publicId === item.publicId) setSelected(null);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
    toast.success('URL copied!');
  }

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.folder.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-[#555] text-sm mt-1">Upload and manage images across your portfolio</p>
      </div>

      {/* Upload Zone */}
      <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6 mb-6">
        {/* Folder selector */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="text-xs text-[#555] uppercase tracking-wider">Upload to:</p>
          <div className="flex gap-2 flex-wrap">
            {FOLDERS.map(f => (
              <button key={f.value} onClick={() => setFolder(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                  folder === f.value
                    ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]'
                    : 'bg-[#0D0D0D] border-[#1A1A1A] text-[#555] hover:text-white'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-[#F97316] bg-[#F97316]/5' : 'border-[#1E1E1E] hover:border-[#F97316]/30'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-[#F97316] animate-spin" />
              <p className="text-sm text-[#888]">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                {isDragActive ? <Upload size={22} className="text-[#F97316]" /> : <ImageIcon size={22} className="text-[#555]" />}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{isDragActive ? 'Drop images here' : 'Drag & drop images'}</p>
                <p className="text-[#555] text-xs mt-1">or click to browse · JPG, PNG, WebP, GIF, SVG · max 10MB each</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search + grid */}
      {items.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or folder..."
                className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
            </div>
            <p className="text-[#444] text-xs">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div key={item.publicId} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-[#0D0D0D] border border-[#161616] rounded-xl overflow-hidden hover:border-[#222] transition-all cursor-pointer"
                  onClick={() => setSelected(item)}>
                  <div className="aspect-square overflow-hidden bg-[#111]">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-[#555] truncate">{item.name}</p>
                    <p className="text-[9px] text-[#333]">{item.folder}</p>
                  </div>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={e => { e.stopPropagation(); copyUrl(item.url, item.publicId); }}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-[#F97316] transition-colors">
                      {copiedId === item.publicId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteItem(item); }}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {items.length === 0 && !uploading && (
        <div className="text-center py-20 text-[#333]">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs mt-1">Upload images above to manage them here</p>
        </div>
      )}

      {/* Image detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50" onClick={() => setSelected(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
                <p className="font-bold text-white text-sm truncate pr-4">{selected.name}</p>
                <button onClick={() => setSelected(null)} className="text-[#555] hover:text-white shrink-0"><X size={16} /></button>
              </div>
              <img src={selected.url} alt={selected.name} className="w-full max-h-72 object-contain bg-[#111]" />
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">URL</p>
                  <div className="flex items-center gap-2 bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2">
                    <p className="text-xs text-[#888] flex-1 truncate font-mono">{selected.url}</p>
                    <button onClick={() => copyUrl(selected.url, selected.publicId)}
                      className="shrink-0 text-[#555] hover:text-[#F97316] transition-colors">
                      {copiedId === selected.publicId ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(selected.url, selected.publicId)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F97316] text-white text-xs font-semibold hover:bg-[#EA6C0A] transition-all">
                    <Copy size={13} /> Copy URL
                  </button>
                  <a href={selected.url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#1A1A1A] text-[#888] hover:text-white transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={() => { deleteItem(selected); setSelected(null); }}
                    className="p-2.5 rounded-xl bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
