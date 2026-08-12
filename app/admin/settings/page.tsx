'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFloppyDisk as Save, FaSpinner as Loader2, FaEye as Eye, FaEyeSlash as EyeOff } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [newPass, setNewPass] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/stats');
    const d = await r.json();
    setSettings(d.data ?? {});
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if (res.ok) toast.success('Settings saved!');
      else toast.error('Failed to save');
    } finally { setSaving(false); }
  }

  function set(key: string, value: string) { setSettings(prev => ({ ...prev, [key]: value })); }

  if (loading) return <div className="flex justify-center py-20 pt-24"><Loader2 className="animate-spin text-[#F97316]" /></div>;

  const SECTIONS = [
    {
      title: 'Hero Section',
      fields: [
        { key: 'hero_name', label: 'Your Full Name', placeholder: 'Bonaventure Chidalu' },
        { key: 'hero_bio', label: 'Bio / Tagline', placeholder: 'Full-stack software engineer...', multiline: true },
        { key: 'hero_location', label: 'Location', placeholder: 'FCT Abuja, Nigeria' },
      ],
    },
    {
      title: 'Stats',
      fields: [
        { key: 'stat_years', label: 'Years of Experience', placeholder: '4.8+' },
        { key: 'stat_projects', label: 'Projects Delivered', placeholder: '25+' },
        { key: 'stat_users', label: 'Users Impacted', placeholder: '55k+' },
      ],
    },
    {
      title: 'Contact & Social',
      fields: [
        { key: 'email', label: 'Email', placeholder: 'you@email.com' },
        { key: 'whatsapp', label: 'WhatsApp Number (with country code)', placeholder: '2349064779856' },
        { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
        { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
        { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/...' },
        { key: 'resume_url', label: 'Resume URL (Google Drive / Dropbox)', placeholder: 'https://...' },
      ],
    },
  ];

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#555] text-sm mt-1">Manage your portfolio content</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="space-y-8">
        {SECTIONS.map(({ title, fields }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{title}</h2>
            <div className="space-y-4">
              {fields.map(({ key, label, placeholder, multiline }) => (
                <div key={key}>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">{label}</label>
                  {multiline ? (
                    <textarea value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} rows={3} placeholder={placeholder}
                      className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                  ) : (
                    <input value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                      className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Availability toggle */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Availability</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white text-sm font-medium">Available for work</p>
              <p className="text-[#555] text-xs mt-0.5">Shows the green dot on your hero section</p>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors ${settings.available_for_work === 'true' ? 'bg-[#F97316]' : 'bg-[#333]'}`}
              onClick={() => set('available_for_work', settings.available_for_work === 'true' ? 'false' : 'true')}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.available_for_work === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>

        {/* Save button bottom */}
        <button onClick={save} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] disabled:opacity-60 transition-all">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
