'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus as Plus, FaPencil as Pencil, FaTrash as Trash2, FaXmark as X, FaSpinner as Loader2, FaStar as Star, FaEye as Eye, FaEyeSlash as EyeOff, FaImage as ImageIcon } from 'react-icons/fa6';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';

interface Project {
  id: string; title: string; slug: string; url: string; date: string;
  description: string; tags: string[]; categories: string[];
  imageUrl: string | null; imageId: string | null;
  liveUrl: string | null; githubUrl: string | null;
  featured: boolean; published: boolean; order: number;
}

const EMPTY: Omit<Project, 'id' | 'slug'> = {
  title: '', url: '', date: '', description: '', tags: [], categories: [],
  imageUrl: null, imageId: null, liveUrl: null, githubUrl: null,
  featured: false, published: true, order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [catInput, setCatInput] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data.data ?? []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setTagsInput('');
    setCatInput('');
    setModal(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({ ...p });
    setTagsInput(p.tags.join(', '));
    setCatInput(p.categories.join(', '));
    setModal(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      categories: catInput.split(',').map(c => c.trim()).filter(Boolean),
    };
    try {
      const url = editing ? `/api/projects/${editing.id}` : '/api/projects';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to save'); return; }
      toast.success(editing ? 'Project updated!' : 'Project created!');
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); }
    else toast.error('Failed to delete');
  }

  async function toggle(p: Project, field: 'published' | 'featured') {
    await fetch(`/api/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !p[field] }),
    });
    load();
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-[#555] text-sm mt-1">{projects.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="h-36 bg-[#0D0D0D] relative">
                {p.imageUrl
                  ? <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-[#333]"><ImageIcon size={36} aria-label="No project image" /></div>
                }
                <div className="absolute top-2 right-2 flex gap-1">
                  {p.featured && <span className="px-2 py-0.5 rounded-full bg-[#F97316] text-black text-[10px] font-bold">FEATURED</span>}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.published ? 'bg-green-500/20 text-green-400' : 'bg-[#333] text-[#666]'}`}>
                    {p.published ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-0.5">{p.title}</h3>
                <p className="text-xs text-[#555] mb-3">{p.date}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.tags.slice(0, 3).map(t => <span key={t} className="tag-pill text-[10px]">{t}</span>)}
                  {p.tags.length > 3 && <span className="tag-pill text-[10px]">+{p.tags.length - 3}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1A1A1A] text-[#888] text-xs hover:text-white transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => toggle(p, 'featured')} className={`p-2 rounded-lg transition-colors ${p.featured ? 'bg-[#F97316]/10 text-[#F97316]' : 'bg-[#1A1A1A] text-[#555] hover:text-[#F97316]'}`} title="Toggle featured">
                    <Star size={14} />
                  </button>
                  <button onClick={() => toggle(p, 'published')} className={`p-2 rounded-lg transition-colors ${p.published ? 'bg-green-500/10 text-green-400' : 'bg-[#1A1A1A] text-[#555]'}`} title="Toggle published">
                    {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => del(p.id)} className="p-2 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="fixed inset-4 md:inset-auto md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50 flex flex-col overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A] shrink-0">
                <h2 className="font-bold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <ImageUpload
                  value={form.imageUrl ?? undefined}
                  publicId={form.imageId ?? undefined}
                  folder="projects"
                  label="Project Screenshot"
                  aspectRatio="16/9"
                  onUpload={(url, id) => setForm({ ...form, imageUrl: url, imageId: id })}
                  onRemove={() => setForm({ ...form, imageUrl: null, imageId: null })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Title *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Date</label>
                    <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 2026"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="Project description..."
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
                    <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="PHP, Laravel, MySQL"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Categories (comma-separated)</label>
                    <input value={catInput} onChange={e => setCatInput(e.target.value)} placeholder="Fullstack, Backend"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Live URL</label>
                    <input value={form.liveUrl ?? ''} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..."
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">GitHub URL</label>
                    <input value={form.githubUrl ?? ''} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..."
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-[#F97316]" />
                    <span className="text-sm text-[#888]">Featured on homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#F97316]" />
                    <span className="text-sm text-[#888]">Published</span>
                  </label>
                </div>
              </div>

              {/* Modal footer */}
              <div className="shrink-0 flex gap-3 p-6 border-t border-[#1A1A1A]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-[#888] text-sm hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={save} disabled={saving || !form.title || !form.description}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] disabled:opacity-50 transition-all">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
