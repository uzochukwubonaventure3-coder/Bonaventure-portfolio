'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus as Plus, FaPencil as Pencil, FaTrash as Trash2, FaXmark as X, FaSpinner as Loader2, FaCheck as Check, FaStar as Star } from 'react-icons/fa6';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';

interface Testimonial { id: string; quote: string; name: string; title: string; avatarUrl: string | null; avatarId: string | null; initials: string; approved: boolean; featured: boolean; order: number; createdAt: string; }
const EMPTY = { quote: '', name: '', title: '', avatarUrl: null as null | string, avatarId: null as null | string, initials: '', approved: true, featured: true, order: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); const r = await fetch('/api/testimonials?all=true'); const d = await r.json(); setItems(d.data ?? []); setLoading(false); }
  function openNew() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(t: Testimonial) { setEditing(t); setForm({ ...t }); setModal(true); }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/testimonials/${editing.id}` : '/api/testimonials';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false); load();
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return;
    const r = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (r.ok) { toast.success('Deleted'); load(); }
  }

  async function toggleApprove(t: Testimonial) {
    await fetch(`/api/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: !t.approved }) });
    load();
  }

  const pending = items.filter(t => !t.approved);
  const approved = items.filter(t => t.approved);

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-[#555] text-sm mt-1">{pending.length} pending approval</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16} /> Add
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">⏳ Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map(t => (
              <div key={t.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-sm font-bold text-white shrink-0">{t.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#ccc] text-sm mb-2 line-clamp-2">&quot;{t.quote}&quot;</p>
                  <p className="text-white text-xs font-semibold">{t.name}</p>
                  <p className="text-[#555] text-xs">{t.title}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleApprove(t)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs border border-green-500/20 hover:bg-green-500/20 transition-colors">
                    <Check size={12} /> Approve
                  </button>
                  <button onClick={() => del(t.id)} className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div> : (
        <div>
          <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Approved ({approved.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map(t => (
              <motion.div key={t.id} layout className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-5">
                <p className="text-[#888] text-sm mb-4 line-clamp-3">&quot;{t.quote}&quot;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.avatarUrl ? <Image src={t.avatarUrl} alt={t.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" /> : (
                      <div className="w-8 h-8 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F97316]">{t.initials}</div>
                    )}
                    <div>
                      <p className="text-white text-xs font-semibold">{t.name}</p>
                      <p className="text-[#555] text-xs">{t.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white"><Pencil size={13} /></button>
                    <button onClick={() => del(t.id)} className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed inset-4 md:inset-auto md:top-10 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg md:max-h-[85vh] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A] shrink-0">
                <h2 className="font-bold text-white">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <ImageUpload value={form.avatarUrl ?? undefined} folder="testimonials" label="Avatar (optional)" aspectRatio="1/1"
                  onUpload={(url, id) => setForm({ ...form, avatarUrl: url, avatarId: id })} />
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Quote *</label>
                  <textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} rows={4} placeholder="What they said..."
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Initials</label>
                    <input value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} placeholder="JD" maxLength={2}
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Job Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="CEO, Company Name"
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.approved} onChange={e => setForm({ ...form, approved: e.target.checked })} className="accent-[#F97316]" />
                    <span className="text-sm text-[#888]">Approved</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-[#F97316]" />
                    <span className="text-sm text-[#888]">Featured</span>
                  </label>
                </div>
              </div>
              <div className="shrink-0 flex gap-3 p-5 border-t border-[#1A1A1A]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-[#888] text-sm">Cancel</button>
                <button onClick={save} disabled={saving || !form.quote || !form.name || !form.title}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold disabled:opacity-50">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
