'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, GripVertical, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface TechItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  order: number;
}

const CATEGORIES = ['FRONTEND', 'BACKEND', 'MOBILE', 'DATABASE', 'DEVOPS', 'TOOLS'];
const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: '#3B82F6', BACKEND: '#F97316', MOBILE: '#22C55E',
  DATABASE: '#A855F7', DEVOPS: '#EAB308', TOOLS: '#F472B6',
};

const EMPTY = { name: '', icon: '⚡', category: 'FRONTEND', order: 0 };

// Default tech stack data (used when no DB data exists)
const DEFAULT_STACK: Omit<TechItem, 'id'>[] = [
  { name: 'Vue.js', icon: '🟢', category: 'FRONTEND', order: 1 },
  { name: 'Tailwind CSS', icon: '🎨', category: 'FRONTEND', order: 2 },
  { name: 'React', icon: '⚛️', category: 'FRONTEND', order: 3 },
  { name: 'Next.js', icon: '▲', category: 'FRONTEND', order: 4 },
  { name: 'TypeScript', icon: '🔷', category: 'FRONTEND', order: 5 },
  { name: 'Laravel', icon: '🔴', category: 'BACKEND', order: 1 },
  { name: 'PHP', icon: '🐘', category: 'BACKEND', order: 2 },
  { name: 'Node.js', icon: '🟩', category: 'BACKEND', order: 3 },
  { name: 'React Native', icon: '📱', category: 'MOBILE', order: 1 },
  { name: 'PostgreSQL', icon: '🐘', category: 'DATABASE', order: 1 },
  { name: 'MySQL', icon: '🐬', category: 'DATABASE', order: 2 },
  { name: 'Redis', icon: '🔴', category: 'DATABASE', order: 3 },
  { name: 'Docker', icon: '🐳', category: 'DEVOPS', order: 1 },
  { name: 'AWS', icon: '☁️', category: 'DEVOPS', order: 2 },
  { name: 'Git', icon: '🌿', category: 'DEVOPS', order: 3 },
];

export default function AdminTechStack() {
  const [items, setItems] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TechItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/tech-stack');
      const d = await r.json();
      if (d.data && d.data.length > 0) {
        setItems(d.data);
      } else {
        // Show defaults with temp IDs
        setItems(DEFAULT_STACK.map((t, i) => ({ ...t, id: `default-${i}` })));
      }
    } catch {
      setItems(DEFAULT_STACK.map((t, i) => ({ ...t, id: `default-${i}` })));
    }
    setLoading(false);
  }

  function openNew() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(t: TechItem) {
    setEditing(t);
    setForm({ name: t.name, icon: t.icon, category: t.category, order: t.order });
    setModal(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/tech-stack/${editing.id}` : '/api/tech-stack';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      toast.success(editing ? 'Updated!' : 'Added!');
      setModal(false);
      load();
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Remove this skill?')) return;
    await fetch(`/api/tech-stack/${id}`, { method: 'DELETE' });
    toast.success('Removed');
    load();
  }

  const displayed = activeCategory === 'ALL'
    ? items
    : items.filter(t => t.category === activeCategory);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(t => t.category === cat);
    return acc;
  }, {} as Record<string, TechItem[]>);

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tech Stack</h1>
          <p className="text-[#555] text-sm mt-1">{items.length} skills across {CATEGORIES.length} categories</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {['ALL', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all shrink-0 ${
              activeCategory === cat ? 'text-white' : 'bg-[#0D0D0D] border-[#1A1A1A] text-[#555] hover:text-white'
            }`}
            style={activeCategory === cat && cat !== 'ALL'
              ? { background: `${CATEGORY_COLORS[cat]}15`, borderColor: `${CATEGORY_COLORS[cat]}30`, color: CATEGORY_COLORS[cat] }
              : activeCategory === cat ? { background: '#1A1A1A', borderColor: '#2A2A2A', color: '#fff' } : {}}>
            {cat === 'ALL' ? `All (${items.length})` : `${cat} (${grouped[cat]?.length ?? 0})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : (
        <div className="space-y-8">
          {(activeCategory === 'ALL' ? CATEGORIES : [activeCategory]).map(cat => {
            const catItems = items.filter(t => t.category === cat);
            if (catItems.length === 0 && activeCategory !== cat) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: CATEGORY_COLORS[cat] ?? '#888' }}>
                    {cat}
                  </span>
                  <span className="text-[10px] text-[#333]">({catItems.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {catItems.map(item => (
                    <motion.div key={item.id} layout
                      className="group flex items-center gap-2.5 bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 hover:border-[#222] transition-all">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <span className="text-sm text-[#ccc] truncate flex-1">{item.name}</span>
                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button onClick={() => openEdit(item)} className="p-1 text-[#555] hover:text-white transition-colors">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => del(item.id)} className="p-1 text-[#555] hover:text-red-400 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {/* Add button for this category */}
                  <button onClick={() => { setForm({ ...EMPTY, category: cat }); setEditing(null); setModal(true); }}
                    className="flex items-center justify-center gap-2 bg-[#0D0D0D] border border-dashed border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[#333] hover:text-[#F97316] hover:border-[#F97316]/20 transition-all text-xs">
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl z-50">
              <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]">
                <h2 className="font-bold text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
                <button onClick={() => setModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. React" autoFocus
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Icon</label>
                    <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                      placeholder="⚡"
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm text-center focus:outline-none focus:border-[#F97316]/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316]/40">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#555] mb-1.5 uppercase tracking-wider">Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316]/40" />
                </div>

                {/* Preview */}
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 flex items-center gap-2">
                  <span className="text-xl">{form.icon || '⚡'}</span>
                  <span className="text-sm text-[#ccc]">{form.name || 'Skill Name'}</span>
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${CATEGORY_COLORS[form.category]}15`, color: CATEGORY_COLORS[form.category] }}>
                    {form.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-[#1A1A1A]">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-[#888] text-sm">Cancel</button>
                <button onClick={save} disabled={saving || !form.name}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Skill'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
