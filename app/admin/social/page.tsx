'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Eye, EyeOff, Trash2, RefreshCw, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface SocialPost {
  id: string; platform: string; content: string;
  external_url: string; media_urls: string[];
  ai_summary: string | null; ai_tags: string[]; ai_category: string | null;
  likes: number; reposts: number; replies: number; impressions: number;
  published_at: string; hidden: boolean; synced_at: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1D9BF0', linkedin: '#0A66C2',
};

export default function AdminSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('all');
  const [enrichingId, setEnrichingId] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const url = platform === 'all' ? '/api/social?limit=50' : `/api/social?platform=${platform}&limit=50`;
      const r = await fetch(url);
      const d = await r.json();
      setPosts(d.data ?? []);
    } catch { setPosts([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [platform]);

  async function toggleHide(post: SocialPost) {
    await fetch(`/api/social/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: !post.hidden }),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, hidden: !p.hidden } : p));
    toast.success(post.hidden ? 'Post visible' : 'Post hidden');
  }

  async function del(id: string) {
    if (!confirm('Delete this social post?')) return;
    await fetch(`/api/social/${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Deleted');
  }

  async function reEnrich(post: SocialPost) {
    setEnrichingId(post.id);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: post.id, resource_type: 'social_post', content: post.content }),
      });
      if (res.ok) toast.success('AI enrichment updated!');
      else toast.error('Enrichment failed');
      load();
    } finally { setEnrichingId(''); }
  }

  const twitterCount  = posts.filter(p => p.platform === 'twitter').length;
  const linkedinCount = posts.filter(p => p.platform === 'linkedin').length;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Social Posts</h1>
          <p className="text-[#555] text-sm mt-1">Auto-synced from Twitter/X and LinkedIn</p>
        </div>
        <button onClick={() => load()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] border border-[#1A1A1A] text-[#888] text-sm hover:text-white hover:border-[#222] transition-all">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: `All (${posts.length})`, color: '#888' },
          { key: 'twitter', label: `Twitter (${twitterCount})`, color: '#1D9BF0' },
          { key: 'linkedin', label: `LinkedIn (${linkedinCount})`, color: '#0A66C2' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setPlatform(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
              platform === tab.key ? 'text-white' : 'bg-[#0D0D0D] border-[#1A1A1A] text-[#555] hover:text-white'
            }`}
            style={platform === tab.key ? { background: `${tab.color}12`, borderColor: `${tab.color}35`, color: tab.color } : {}}>
            {tab.key === 'twitter' && <Twitter size={13} />}
            {tab.key === 'linkedin' && <Linkedin size={13} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Webhook setup info */}
      <div className="bg-[#F97316]/5 border border-[#F97316]/15 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Sparkles size={16} className="text-[#F97316] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-white font-semibold mb-1">Webhook Setup Required</p>
          <p className="text-xs text-[#777] leading-relaxed">
            To auto-sync posts, set up webhooks in your{' '}
            <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#1D9BF0] hover:underline">Twitter Developer Portal</a>
            {' '}and{' '}
            <a href="https://developer.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:underline">LinkedIn Developer Portal</a>
            {' '}pointing to: <code className="text-[#F97316] bg-[#111] px-1 py-0.5 rounded text-[10px]">/api/webhooks/twitter</code> and{' '}
            <code className="text-[#F97316] bg-[#111] px-1 py-0.5 rounded text-[10px]">/api/webhooks/linkedin</code>.
            Or import the <a href="/n8n-workflow.json" className="text-[#F97316] hover:underline">n8n workflow</a>.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F97316]" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-[#0D0D0D] border border-[#161616] rounded-2xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Twitter size={28} className="text-[#333]" />
            <Linkedin size={28} className="text-[#333]" />
          </div>
          <p className="text-white font-semibold mb-1">No synced posts yet</p>
          <p className="text-[#444] text-sm">Configure webhooks above to start auto-syncing posts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const color = PLATFORM_COLORS[post.platform] ?? '#888';
            const Icon = post.platform === 'twitter' ? Twitter : Linkedin;
            return (
              <motion.div key={post.id} layout
                className={`bg-[#111] border rounded-2xl p-5 transition-all ${post.hidden ? 'opacity-40 border-[#1A1A1A]' : 'border-[#1A1A1A] hover:border-[#222]'}`}>
                <div className="flex items-start gap-4">
                  {/* Platform icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={15} style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase" style={{ color }}>{post.platform}</span>
                      {post.ai_category && (
                        <span className="text-[9px] px-2 py-0.5 bg-[#1A1A1A] text-[#555] rounded-full">{post.ai_category}</span>
                      )}
                      {post.hidden && <span className="text-[9px] text-red-400">● hidden</span>}
                      <span className="text-[9px] text-[#333] ml-auto">
                        {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </span>
                    </div>

                    <p className="text-[#888] text-sm leading-relaxed mb-2 line-clamp-3">{post.content}</p>

                    {post.ai_summary && (
                      <div className="flex items-start gap-1.5 bg-[#0D0D0D] rounded-lg px-3 py-2 mb-2">
                        <Sparkles size={10} className="text-[#A855F7] mt-0.5 shrink-0" />
                        <p className="text-[10px] text-[#555] italic">{post.ai_summary}</p>
                      </div>
                    )}

                    {/* Media thumbnails */}
                    {post.media_urls?.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {post.media_urls.slice(0, 3).map((url, i) => (
                          <img key={i} src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-[#1A1A1A]" />
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {post.ai_tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.ai_tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[#111] border border-[#1A1A1A] rounded text-[#444]">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Engagement + actions */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 text-[9px] text-[#333]">
                      <span>♥ {post.likes}</span>
                      <span>↺ {post.reposts}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => reEnrich(post)} disabled={enrichingId === post.id}
                        className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#444] hover:text-[#A855F7] transition-colors"
                        title="Re-run AI enrichment">
                        <Sparkles size={12} className={enrichingId === post.id ? 'animate-pulse' : ''} />
                      </button>
                      <a href={post.external_url} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#444] hover:text-white transition-colors">
                        <ExternalLink size={12} />
                      </a>
                      <button onClick={() => toggleHide(post)}
                        className={`p-1.5 rounded-lg bg-[#1A1A1A] transition-colors ${post.hidden ? 'text-[#F97316]' : 'text-[#444] hover:text-white'}`}>
                        {post.hidden ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button onClick={() => del(post.id)}
                        className="p-1.5 rounded-lg bg-[#1A1A1A] text-[#444] hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
