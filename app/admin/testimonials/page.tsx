'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Check, Star, ThumbsUp, ThumbsDown, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Testimonial {
  id: string; quote: string; name: string; title: string;
  avatarUrl?: string; avatarId?: string;
  initials: string; approved: boolean; featured: boolean;
  order: number; createdAt: string;
}

const EMPTY = {
  quote: '', name: '', title: '',
  avatarUrl: null as null | string, avatarId: null as null | string,
  initials: '', approved: true, featured: true, order: 0,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/testimonials?all=true');
    const d = await r.json();
    setItems(d.data ?? []);
    setLoading(false);
  }

  function openNew() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      quote: t.quote, name: t.name, title: t.title,
      avatarUrl: t.avatarUrl ?? null, avatarId: t.avatarId ?? null,
      initials: t.initials, approved: t.approved, featured: t.featured, order: t.order,
    });
    setModal(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/testimonials/${editing.id}` : '/api/testimonials';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false);
      load();
    } finally { setSaving(false); }
  }

  async function approve(t: Testimonial) {
    await fetch(`/api/testimonials/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true, featured: true }),
    });
    toast.success(`✅ "${t.name}'s" testimonial approved and published!`);
    load();
  }

  async function decline(t: Testimonial) {
    if (!confirm(`Decline and delete "${t.name}'s" testimonial?`)) return;
    await fetch(`/api/testimonials/${t.id}`, { method: 'DELETE' });
    toast.success('Testimonial declined and removed.');
    load();
  }

  async function toggleFeatured(t: Testimonial) {
    await fetch(`/api/testimonials/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !t.featured }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    load();
  }

  const pending  = items.filter(t => !t.approved);
  const approved = items.filter(t => t.approved);
  const displayed = activeTab === 'pending' ? pending : approved;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-[#555] text-sm mt-1">
            {pending.length} pending · {approved.length} approved
          </p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0D0D0D] border border-[#161616] rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'pending' ? 'bg-[#F97316] text-white' : 'text-[#555] hover:text-white'}`}>
          ⏳ Pending
          {pending.length > 0 && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}>
              {pending.length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'approved' ? 'bg-[#F97316] text-white' : 'text-[#555] hover:text-white'}`}>
          ✅ Approved ({approved.length})
        </button>
      </div>

      {/* Pending notice */}
      {activeTab === 'pending' && pending.length > 0 && (
        <div className="mb-5 flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl px-4 py-3">
          <span className="text-yellow-400 text-lg">⚠️</span>
          <p className="text-sm text-[#888]">
            These testimonials were submitted publicly via <strong className="text-white">/testify</strong>. Review each one and approve or decline before they appear on your portfolio.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-[#333]">
          <p className="text-4xl mb-3">{activeTab === 'pending' ? '🎉' : '⭐'}</p>
          <p className="text-sm">
            {activeTab === 'pending' ? 'No pending testimonials — you\'re all caught up!' : 'No approved testimonials yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {displayed.map(t => (
              <motion.div key={t.id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`rounded-2xl p-5 border transition-all ${
                  !t.approved
                    ? 'bg-[#0D0D0D] border-yellow-500/15 hover:border-yellow-500/25'
                    : 'bg-[#111] border-[#1A1A1A] hover:border-[#222]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-sm font-bold text-[#F97316] shrink-0">
                      {t.initials}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      {t.featured && t.approved && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">★ FEATURED</span>
                      )}
                    </div>
                    <p className="text-xs text-[#555] mb-2">{t.title}</p>
                    <p className="text-[#888] text-xs leading-relaxed line-clamp-2">"{t.quote}"</p>
                    <p className="text-[#333] text-[10px] mt-2">
                      Submitted {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!t.approved ? (
                      // Pending actions: Approve / Decline
                      <>
                        <button onClick={() => approve(t)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-all">
                          <ThumbsUp size={13} /> Approve
                        </button>
                        <button onClick={() => decline(t)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all">
                          <ThumbsDown size={13} /> Decline
                        </button>
                      </>
                    ) : (
                      // Approved actions: feature toggle, edit, delete
                      <>
                        <button onClick={() => toggleFeatured(t)}
                          className={`p-2 rounded-lg transition-colors ${t.featured ? 'bg-[#F97316]/10 text-[#F97316]' : 'bg-[#1A1A1A] text-[#444] hover:text-[#F97316]'}`}
                          title="Toggle featured">
                          <Star size={13} />
                        </button>
                        <button onClick={() => openEdit(t)}
                          className="p-2 rounded-lg bg-[#1A1A1A] text-[#666] hover:text-white transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => del(t.id)}
                          className="p-2 rounded-lg bg-[#1A1A1A] text-[#444] hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed inset-4 md:inset-auto md:top-10 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg md:max-h-[85vh] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A] shrink-0">
                <h2 className="font-bold text-white">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <ImageUpload
                  value={form.avatarUrl ?? undefined}
                  folder="testimonials"
                  label="Avatar (optional)"
                  aspectRatio="1/1"
                  onUpload={(url, id) => setForm({ ...form, avatarUrl: url, avatarId: id })}
                />
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Quote *</label>
                  <textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })}
                    rows={4} placeholder="What they said..."
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Initials</label>
                    <input value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })}
                      placeholder="JD" maxLength={2}
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Job Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="CEO, Company Name"
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
