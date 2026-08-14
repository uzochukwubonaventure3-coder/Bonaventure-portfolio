'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus as Plus, FaPencil as Pencil, FaTrash as Trash2, FaXmark as X, FaSpinner as Loader2, FaEye as Eye, FaEyeSlash as EyeOff, FaStar as Star, FaHashtag as Hash, FaFileLines } from 'react-icons/fa6';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import type { Post, PostSection, PostPlatform } from '@/types';

const SECTIONS: PostSection[] = [
  'Latest Thoughts','Building In Public','Engineering Notes','AI Experiments',"What I'm Learning",
];
const PLATFORMS: PostPlatform[] = ['self','twitter','linkedin','hashnode','devto','medium','github'];
const SECTION_COLORS: Record<string,string> = {
  'Latest Thoughts':'#FBBF24','Building In Public':'#34D399',
  'Engineering Notes':'#60A5FA','AI Experiments':'#C084FC',"What I'm Learning":'#F472B6',
};
const EMPTY = {
  title:'', slug:'', content:'', excerpt:'',
  cover_image: null as string|null, cover_image_id: null as string|null,
  section:'Latest Thoughts' as PostSection, platform:'self' as PostPlatform,
  tags:[] as string[], external_url: null as string|null,
  ai_summary: null as string|null, featured:false, published:false,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Post|null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(()=>{load();},[]);
  async function load(){
    setLoading(true);
    const r = await fetch('/api/posts?all=true&limit=100');
    const d = await r.json();
    setPosts(d.data??[]);
    setLoading(false);
  }
  function openNew(){setEditing(null);setForm(EMPTY);setTagsInput('');setModal(true);}
  function openEdit(p:Post){
    setEditing(p);
    setForm({title:p.title,slug:p.slug,content:p.content,excerpt:p.excerpt??'',
      cover_image:p.cover_image,cover_image_id:p.cover_image_id,
      section:p.section,platform:p.platform,tags:p.tags,
      external_url:p.external_url,ai_summary:p.ai_summary,
      featured:p.featured,published:p.published});
    setTagsInput(p.tags.join(', '));
    setModal(true);
  }
  async function save(){
    setSaving(true);
    try{
      const payload={...form,tags:tagsInput.split(',').map(t=>t.trim()).filter(Boolean),
        slug:form.slug||form.title.toLowerCase().replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,'-').trim()};
      const url=editing?`/api/posts/${editing.slug}`:'/api/posts';
      const method=editing?'PUT':'POST';
      const res=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json();
      if(!res.ok){toast.error(data.error??'Failed');return;}
      toast.success(editing?'Updated!':'Created!');
      setModal(false);load();
    }finally{setSaving(false);}
  }
  async function del(slug:string){
    if(!confirm('Delete this post?'))return;
    const r=await fetch(`/api/posts/${slug}`,{method:'DELETE'});
    if(r.ok){toast.success('Deleted');load();}else toast.error('Failed');
  }
  async function toggleField(p:Post,field:'published'|'featured'){
    await fetch(`/api/posts/${p.slug}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({[field]:!p[field]})});
    load();
  }
  const filtered=activeFilter==='all'?posts:posts.filter(p=>p.section===activeFilter);
  const stats={total:posts.length,published:posts.filter(p=>p.published).length,featured:posts.filter(p=>p.featured).length};

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Engineering Journal</h1>
          <p className="text-[#555] text-sm mt-1">{stats.total} posts · {stats.published} published · {stats.featured} featured</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
          <Plus size={16}/>New Post
        </button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {['all',...SECTIONS].map(s=>(
          <button key={s} onClick={()=>setActiveFilter(s)}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all shrink-0 ${activeFilter===s?'text-white':'bg-[#0D0D0D] border-[#1A1A1A] text-[#555] hover:text-white'}`}
            style={activeFilter===s&&s!=='all'?{background:`${SECTION_COLORS[s]}15`,borderColor:`${SECTION_COLORS[s]}30`,color:SECTION_COLORS[s]}:activeFilter===s?{background:'#1A1A1A',borderColor:'#2A2A2A',color:'#fff'}:{}}>
            {s==='all'?'All':s}
          </button>
        ))}
      </div>
      {loading?(<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]"/></div>):
      filtered.length===0?(<div className="text-center py-20 text-[#333]"><FaFileLines className="mx-auto mb-3" size={32} aria-label="No posts"/><p>No posts yet.</p></div>):(
        <div className="space-y-2">
          {filtered.map(p=>{
            const color=SECTION_COLORS[p.section]??'#F97316';
            return(
              <motion.div key={p.id} layout initial={{opacity:0}} animate={{opacity:1}}
                className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4 hover:border-[#222] transition-colors">
                {p.cover_image?<Image src={p.cover_image} alt="" width={56} height={56} className="w-14 h-14 rounded-xl object-cover shrink-0"/>:
                  <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center" style={{background:`${color}10`}}><FaFileLines size={19} style={{color}} aria-label="Post" /></div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold uppercase" style={{color}}>{p.section}</span>
                    {p.published&&<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15">LIVE</span>}
                    {!p.published&&<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#444] border border-[#222]">DRAFT</span>}
                    {p.featured&&<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"><Star size={9} aria-label="Featured" /></span>}
                  </div>
                  <p className="font-semibold text-white text-sm truncate">{p.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-[#444]">{p.reading_time}m · {p.views} views</span>
                    <span className="text-[10px] text-[#333]">{formatDistanceToNow(new Date(p.created_at),{addSuffix:true})}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={()=>toggleField(p,'featured')} className={`p-2 rounded-lg transition-colors ${p.featured?'bg-[#F97316]/10 text-[#F97316]':'bg-[#1A1A1A] text-[#444] hover:text-[#F97316]'}`}><Star size={13}/></button>
                  <button onClick={()=>toggleField(p,'published')} className={`p-2 rounded-lg transition-colors ${p.published?'bg-green-500/10 text-green-400':'bg-[#1A1A1A] text-[#444]'}`}>{p.published?<Eye size={13}/>:<EyeOff size={13}/>}</button>
                  <button onClick={()=>openEdit(p)} className="p-2 rounded-lg bg-[#1A1A1A] text-[#666] hover:text-white transition-colors"><Pencil size={13}/></button>
                  <button onClick={()=>del(p.slug)} className="p-2 rounded-lg bg-[#1A1A1A] text-[#444] hover:text-red-400 transition-colors"><Trash2 size={13}/></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {modal&&(
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50" onClick={()=>setModal(false)}/>
            <motion.div initial={{opacity:0,y:30,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}
              className="fixed inset-3 md:inset-auto md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:max-h-[92vh] bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] shrink-0">
                <h2 className="font-bold text-white">{editing?'Edit Post':'New Post'}</h2>
                <button onClick={()=>setModal(false)} className="text-[#444] hover:text-white"><X size={18}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <ImageUpload value={form.cover_image??undefined} publicId={form.cover_image_id??undefined}
                  folder="blog" label="Cover Image" aspectRatio="16/9"
                  onUpload={(url,id)=>setForm({...form,cover_image:url,cover_image_id:id})}
                  onRemove={()=>setForm({...form,cover_image:null,cover_image_id:null})}/>
                <div>
                  <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Title *</label>
                  <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What did you build / learn / think?"
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40"/>
                </div>
                <div>
                  <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Slug (auto if blank)</label>
                  <input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="my-post-slug"
                    className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Section</label>
                    <select value={form.section} onChange={e=>setForm({...form,section:e.target.value as PostSection})}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316]/40">
                      {SECTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Platform</label>
                    <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value as PostPlatform})}
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F97316]/40">
                      {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Excerpt</label>
                  <textarea value={form.excerpt??''} onChange={e=>setForm({...form,excerpt:e.target.value})} rows={2}
                    placeholder="Short description for the feed..." className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40 resize-none"/>
                </div>
                <div>
                  <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Content * (Markdown)</label>
                  <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={12}
                    placeholder={"## Introduction\n\nWrite your post here...\n\n## Section\n\nMore content..."}
                    className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-[#222] focus:outline-none focus:border-[#F97316]/40 resize-none leading-relaxed"/>
                </div>
                <div>
                  <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">AI Summary</label>
                  <textarea value={form.ai_summary??''} onChange={e=>setForm({...form,ai_summary:e.target.value})} rows={2}
                    placeholder="One-sentence AI summary of this post..." className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40 resize-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
                    <input value={tagsInput} onChange={e=>setTagsInput(e.target.value)} placeholder="Laravel, PHP, API"
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40"/>
                  </div>
                  <div>
                    <label className="block text-xs text-[#444] mb-1.5 uppercase tracking-wider">External URL</label>
                    <input value={form.external_url??''} onChange={e=>setForm({...form,external_url:e.target.value})} placeholder="https://..."
                      className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40"/>
                  </div>
                </div>
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} className="accent-[#F97316] w-4 h-4"/>
                    <span className="text-sm text-[#888]">Published</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="accent-[#F97316] w-4 h-4"/>
                    <span className="text-sm text-[#888]">Featured</span>
                  </label>
                </div>
              </div>
              <div className="shrink-0 flex gap-3 px-6 py-4 border-t border-[#1A1A1A]">
                <button onClick={()=>setModal(false)} className="flex-1 py-3 rounded-xl bg-[#1A1A1A] text-[#666] text-sm hover:text-white transition-colors">Cancel</button>
                <button onClick={save} disabled={saving||!form.title||!form.content}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] disabled:opacity-50 transition-all">
                  {saving&&<Loader2 size={15} className="animate-spin"/>}
                  {saving?'Saving...':editing?'Update Post':'Publish Post'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
