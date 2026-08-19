'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe, Home, User, Mail, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const SECTIONS = [
  {
    key: 'hero',
    label: 'Hero Section',
    icon: Home,
    color: '#F97316',
    desc: 'Name, bio, tagline and location shown on homepage',
    fields: [
      { key: 'hero_name', label: 'Your Full Name', placeholder: 'Bonaventure Chidalu' },
      { key: 'hero_tagline', label: 'Tagline / Role', placeholder: 'Fullstack Developer & SEO Specialist' },
      { key: 'hero_bio', label: 'Short Bio', placeholder: 'Full-stack software engineer with experience in...', multiline: true },
      { key: 'hero_location', label: 'Location', placeholder: 'FCT Abuja, Nigeria' },
    ],
  },
  {
    key: 'stats',
    label: 'Hero Stats',
    icon: FileText,
    color: '#22C55E',
    desc: 'The 3 big numbers shown below your hero section',
    fields: [
      { key: 'stat_years', label: 'Years of Experience', placeholder: '4.8+' },
      { key: 'stat_projects', label: 'Projects Delivered', placeholder: '25+' },
      { key: 'stat_users', label: 'Users Impacted', placeholder: '55k+' },
    ],
  },
  {
    key: 'me_page',
    label: '/me Now Page',
    icon: User,
    color: '#3B82F6',
    desc: 'What you are currently doing, reading, listening to',
    fields: [
      { key: 'me_location', label: 'Current Location', placeholder: 'FCT Abuja, Nigeria 🇳🇬' },
      { key: 'me_building', label: 'Currently Building', placeholder: 'Client projects + this portfolio' },
      { key: 'me_building_sub', label: 'Building Sub-text', placeholder: 'Next.js, Laravel, Supabase stack' },
      { key: 'me_reading', label: 'Currently Reading', placeholder: 'The Pragmatic Programmer' },
      { key: 'me_reading_sub', label: 'Book Author', placeholder: 'By Andrew Hunt & David Thomas' },
      { key: 'me_listening', label: 'Currently Listening', placeholder: 'Lo-fi beats & Afrobeats' },
      { key: 'me_available', label: 'Open For', placeholder: 'Freelance, Remote roles, Consulting' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Page',
    icon: Mail,
    color: '#A855F7',
    desc: 'Email, WhatsApp and availability message on contact page',
    fields: [
      { key: 'contact_email', label: 'Email Address', placeholder: 'bonaventurechidalu@gmail.com' },
      { key: 'contact_whatsapp', label: 'WhatsApp (with country code)', placeholder: '2349064779856' },
      { key: 'contact_availability', label: 'Availability Message', placeholder: 'Open to freelance, remote roles and full-time opportunities.', multiline: true },
      { key: 'contact_response_time', label: 'Response Time', placeholder: 'I typically respond within 24 hours.' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO & Meta',
    icon: Globe,
    color: '#EAB308',
    desc: 'Site title, meta description and keywords for search engines',
    fields: [
      { key: 'seo_title', label: 'Site Title', placeholder: 'Bonaventure Chidalu | Fullstack Developer' },
      { key: 'seo_description', label: 'Meta Description (max 155 chars)', placeholder: 'Fullstack software engineer based in FCT Abuja...', multiline: true },
      { key: 'seo_keywords', label: 'Keywords (comma-separated)', placeholder: 'fullstack developer, PHP, Laravel, Nigeria...' },
      { key: 'seo_og_image', label: 'OG Image URL', placeholder: 'https://res.cloudinary.com/...' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    icon: FileText,
    color: '#F472B6',
    desc: 'Footer tagline and feedback message displayed at the bottom',
    fields: [
      { key: 'footer_tagline', label: 'Footer Tagline', placeholder: "Building fast, scalable, and SEO-optimized web applications." },
      { key: 'footer_feedback', label: 'Feedback Prompt', placeholder: "Found a bug? Let me know." },
    ],
  },
];

export default function AdminPages() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeKey, setActiveKey] = useState('hero');
  const [dirty, setDirty] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/stats');
    const d = await r.json();
    setSettings(d.data ?? {});
    setLoading(false);
  }

  function set(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) { toast.success('Saved!'); setDirty(false); }
      else toast.error('Save failed');
    } finally { setSaving(false); }
  }

  const activeSection = SECTIONS.find(s => s.key === activeKey);

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Page Content</h1>
          <p className="text-[#555] text-sm mt-1">Edit text content that appears across your portfolio</p>
        </div>
        <button onClick={save} disabled={saving || !dirty}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            dirty ? 'bg-[#F97316] text-white hover:bg-[#EA6C0A]' : 'bg-[#111] border border-[#1A1A1A] text-[#444]'
          } disabled:opacity-60`}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving...' : dirty ? 'Save Changes' : 'All Saved'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-56 shrink-0">
            <div className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-2 space-y-1 sticky top-8">
              {SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <button key={section.key} onClick={() => setActiveKey(section.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                      activeKey === section.key
                        ? 'bg-[#1A1A1A] text-white'
                        : 'text-[#555] hover:text-white hover:bg-[#111]'
                    }`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${section.color}15`, border: `1px solid ${section.color}20` }}>
                      <Icon size={13} style={{ color: activeKey === section.key ? section.color : '#555' }} />
                    </div>
                    <span className="font-medium text-xs">{section.label}</span>
                    {activeKey === section.key && <ChevronRight size={12} className="ml-auto" style={{ color: section.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor panel */}
          {activeSection && (
            <motion.div key={activeKey} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }} className="flex-1 min-w-0">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl overflow-hidden">
                {/* Panel header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]"
                  style={{ background: `${activeSection.color}06` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${activeSection.color}15`, border: `1px solid ${activeSection.color}25` }}>
                      {<activeSection.icon size={16} style={{ color: activeSection.color }} />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{activeSection.label}</p>
                      <p className="text-[#555] text-xs">{activeSection.desc}</p>
                    </div>
                  </div>
                  <a href="/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#444] hover:text-[#F97316] transition-colors">
                    <Globe size={12} /> Preview site
                  </a>
                </div>

                {/* Fields */}
                <div className="p-6 space-y-5">
                  {activeSection.fields.map(({ key, label, placeholder, multiline }) => (
                    <div key={key}>
                      <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider font-medium">{label}</label>
                      {multiline ? (
                        <textarea value={settings[key] ?? ''} onChange={e => set(key, e.target.value)}
                          rows={3} placeholder={placeholder}
                          className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40 resize-none transition-colors" />
                      ) : (
                        <input value={settings[key] ?? ''} onChange={e => set(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40 transition-colors" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6 flex justify-end">
                  <button onClick={save} disabled={saving || !dirty}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      dirty ? 'bg-[#F97316] text-white hover:bg-[#EA6C0A]' : 'bg-[#1A1A1A] text-[#444]'
                    } disabled:opacity-60`}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
