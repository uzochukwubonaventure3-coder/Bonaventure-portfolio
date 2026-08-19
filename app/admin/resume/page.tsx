'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

export default function AdminResume() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/stats');
    const d = await r.json();
    const data = d.data ?? {};
    setSettings(data);
    setManualUrl(data.resume_url ?? '');
    setLoading(false);
  }

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please upload a PDF file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'misc');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Upload failed'); return; }
      const url = data.data?.url ?? data.url;
      await saveResumeUrl(url);
      setManualUrl(url);
      toast.success('Resume uploaded successfully!');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: uploading,
  });

  async function saveResumeUrl(url: string) {
    setSaving(true);
    try {
      await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_url: url }),
      });
      setSettings(prev => ({ ...prev, resume_url: url }));
    } finally { setSaving(false); }
  }

  async function saveManual() {
    await saveResumeUrl(manualUrl);
    toast.success('Resume URL saved!');
  }

  async function removeResume() {
    if (!confirm('Remove resume link?')) return;
    await saveResumeUrl('');
    setManualUrl('');
    toast.success('Resume removed');
  }

  const currentUrl = settings.resume_url || '';

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Resume</h1>
        <p className="text-[#555] text-sm mt-1">Upload your resume PDF or link to an external one</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="space-y-6">
          {/* Current resume status */}
          <div className={`rounded-2xl p-5 border ${currentUrl ? 'bg-green-500/5 border-green-500/15' : 'bg-[#111] border-[#1A1A1A]'}`}>
            <div className="flex items-center gap-3">
              {currentUrl ? (
                <CheckCircle size={20} className="text-green-400 shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-[#555] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${currentUrl ? 'text-white' : 'text-[#666]'}`}>
                  {currentUrl ? 'Resume is live' : 'No resume uploaded yet'}
                </p>
                {currentUrl && (
                  <p className="text-[#555] text-xs mt-0.5 truncate">{currentUrl}</p>
                )}
              </div>
              {currentUrl && (
                <div className="flex gap-2 shrink-0">
                  <a href={currentUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={removeResume} className="p-2 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload PDF */}
          <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Upload size={15} className="text-[#F97316]" />
              Upload PDF Resume
            </h3>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-[#F97316] bg-[#F97316]/5' : 'border-[#222] hover:border-[#F97316]/40 hover:bg-[#F97316]/3'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={28} className="text-[#F97316] animate-spin" />
                  <p className="text-sm text-[#888]">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                    <FileText size={22} className="text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                    </p>
                    <p className="text-[#555] text-xs mt-1">or click to browse · PDF only · max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OR — manual URL */}
          <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <ExternalLink size={15} className="text-[#F97316]" />
              Or Paste External URL
            </h3>
            <p className="text-[#555] text-xs mb-4">Google Drive, Dropbox, Notion, etc.</p>
            <div className="flex gap-2">
              <input
                value={manualUrl}
                onChange={e => setManualUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="flex-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40"
              />
              <button onClick={saveManual} disabled={saving || !manualUrl}
                className="px-5 py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] disabled:opacity-50 transition-all shrink-0">
                {saving ? <Loader2 size={15} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>

          <div className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-4">
            <p className="text-xs text-[#555] leading-relaxed">
              💡 <strong className="text-[#888]">Tip:</strong> For Google Drive, set sharing to "Anyone with the link can view", then paste the link here. The "Download Resume" button on your homepage will use this URL.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
