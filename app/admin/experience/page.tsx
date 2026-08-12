'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus as Plus, FaPencil as Pencil, FaTrash as Trash2, FaXmark as X, FaSpinner as Loader2, FaGripVertical as GripVertical } from 'react-icons/fa6';
import toast from 'react-hot-toast';

interface Exp { id: string; title: string; company: string; type: string; period: string; badge: string | null; initials: string; color: string; tags: string[]; bullets: string[]; order: number; current: boolean; }
const EMPTY: Omit<Exp, 'id'> = { title: '', company: '', type: '', period: '', badge: '', initials: '', color: '#F97316', tags: [], bullets: [], order: 0, current: false };

export default function AdminExperience() {
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Exp | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [bulletsInput, setBulletsInput] = useState('');

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); const r = await fetch('/api/experience'); const d = await r.json(); setItems(d.data ?? []); setLoading(false); }

  function openNew() { setEditing(null); setForm(EMPTY); setTagsInput(''); setBulletsInput(''); setModal(true); }
  function openEdit(e: Exp) {
    setEditing(e);
    setForm({ ...e });
    setTagsInput(e.tags.join(', '));
    setBulletsInput(e.bullets.join('\n'));
    setModal(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      bullets: bulletsInput.split('\n').map(b => b.trim()).filter(Boolean),
    };
    try {
      const url = editing ? `/api/experience/${editing.id}` : '/api/experience';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false); load();
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this experience?')) return;
    const r = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    if (r.ok) { toast.success('Deleted'); load(); } else toast.error('Failed');
  }

  const COLORS = ['#F97316', '#E63946', '#6366F1', '#22C55E', '#3B82F6', '#A855F7', '#EAB308'];

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Experience</h1>
          <p className="text-[#555] text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div> : (
        <div className="space-y-3">
          {items.map(exp => (
            <motion.div key={exp.id} layout className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-5 flex items-start gap-4">
              <GripVertical size={16} className="text-[#333] mt-1 shrink-0 cursor-grab" />
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${exp.color}20`, border: `1.5px solid ${exp.color}40`, color: exp.color }}>
                {exp.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-white text-sm">{exp.title}</h3>
                  {exp.current && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">CURRENT</span>}
                </div>
                <p className="text-xs text-[#555]">{exp.company} · {exp.type}</p>
                <p className="text-xs text-[#444] mt-1">{exp.period}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.tags.slice(0, 4).map(t => <span key={t} className="tag-pill text-[9px]">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(exp)} className="p-2 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"><Pencil size={14} /></button>
                <button onClick={() => del(exp.id)} className="p-2 rounded-lg bg-[#1A1A1A] text-[#555] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed inset-4 md:inset-auto md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A] shrink-0">
                <h2 className="font-bold text-white">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
                <button onClick={() => setModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Job Title *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Senior Developer"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Company *</label>
                    <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company Name"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Work Type</label>
                    <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Remote (Full-stack)"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Period</label>
                    <input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="Jan 2025 – Present"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Initials</label>
                    <input value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} placeholder="BC" maxLength={3}
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Badge label</label>
                    <input value={form.badge ?? ''} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Current"
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Order</label>
                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                      className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-2 uppercase tracking-wider">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm({ ...form, color: c })}
                        className="w-7 h-7 rounded-full transition-transform hover:scale-110" style={{ background: c, outline: form.color === c ? `2px solid ${c}` : undefined, outlineOffset: '2px' }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Tags (comma separated)</label>
                  <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Laravel, PHP, MySQL"
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Bullet Points (one per line)</label>
                  <textarea value={bulletsInput} onChange={e => setBulletsInput(e.target.value)} rows={5}
                    placeholder="Led development of X feature...&#10;Improved performance by Y%...&#10;Mentored Z junior developers..."
                    className="w-full bg-[#111] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40 resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked })} className="accent-[#F97316]" />
                  <span className="text-sm text-[#888]">Current position</span>
                </label>
              </div>
              <div className="shrink-0 flex gap-3 p-6 border-t border-[#1A1A1A]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-[#888] text-sm">Cancel</button>
                <button onClick={save} disabled={saving || !form.title || !form.company}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold disabled:opacity-50">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Experience'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
