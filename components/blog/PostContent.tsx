'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft as ArrowLeft, FaClock as Clock, FaEye as Eye, FaCalendar as Calendar, FaArrowUpRightFromSquare as ExternalLink, FaHashtag as Hash, FaWandMagicSparkles as Sparkles, FaShareNodes as Share2, FaBookOpen as BookOpen } from 'react-icons/fa6';
import { format } from 'date-fns';
import type { Post } from '@/types';

const SECTION_COLORS: Record<string, string> = {
  'Latest Thoughts':    '#FBBF24',
  'Building In Public': '#34D399',
  'Engineering Notes':  '#60A5FA',
  'AI Experiments':     '#C084FC',
  "What I'm Learning":  '#F472B6',
};

interface Props { post: Post; related: Post[] }

export default function PostContent({ post, related }: Props) {
  const color = SECTION_COLORS[post.section] ?? '#F97316';

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.slice(3)}</h2>;
        if (line.startsWith('# '))  return <h1 key={i} className="text-3xl font-bold text-white mt-12 mb-5">{line.slice(2)}</h1>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(4)}</h3>;
        if (line.startsWith('- '))  return <li key={i} className="text-[#888] leading-relaxed ml-4 list-disc">{line.slice(2)}</li>;
        if (line.startsWith('```')) return <div key={i} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 my-4 font-mono text-sm text-[#ccc] overflow-x-auto" />;
        if (line.trim() === '')    return <br key={i} />;
        return <p key={i} className="text-[#888] leading-relaxed mb-4">{line}</p>;
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Journal
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
        {/* Section */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
            {post.section}
          </span>
          {post.platform !== 'self' && (
            <span className="text-xs text-[#444] px-2 py-1 rounded-full bg-[#111] border border-[#1A1A1A]">{post.platform}</span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{post.title}</h1>
        {post.excerpt && <p className="text-[#666] text-lg leading-relaxed mb-6">{post.excerpt}</p>}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#444] mb-6">
          <span className="flex items-center gap-1.5"><Calendar size={13} />{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
          <span className="flex items-center gap-1.5"><Clock size={13} />{post.reading_time} min read</span>
          <span className="flex items-center gap-1.5"><Eye size={13} />{post.views} views</span>
          {post.external_url && (
            <a href={post.external_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F97316] hover:underline">
              <ExternalLink size={13} /> Read original
            </a>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#111] border border-[#1A1A1A] rounded-lg text-[#666] hover:text-[#F97316] hover:border-[#F97316]/30 transition-all">
                <Hash size={10} />{tag}
              </Link>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {post.ai_summary && (
          <div className="flex items-start gap-3 bg-[#130F1A] border border-[#A855F7]/15 rounded-2xl p-5 mb-8">
            <Sparkles size={16} className="text-[#A855F7] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-1.5">AI Summary</p>
              <p className="text-sm text-[#888] leading-relaxed">{post.ai_summary}</p>
            </div>
          </div>
        )}

        {/* Cover image */}
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-[#1A1A1A]">
            <img src={post.cover_image} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}
      </motion.header>

      {/* Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="prose prose-invert max-w-none mb-12">
        {renderContent(post.content)}
      </motion.div>

      {/* Share + actions */}
      <div className="flex items-center justify-between py-6 border-t border-[#1A1A1A] mb-12">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors">
          <BookOpen size={14} /> More posts
        </Link>
        <button onClick={share} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] border border-[#1A1A1A] text-sm text-[#666] hover:text-white hover:border-[#222] transition-all">
          <Share2 size={14} /> Share
        </button>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className="font-bold text-white text-lg mb-5">You might also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`}
                className="group bg-[#0D0D0D] border border-[#161616] rounded-2xl p-5 hover:border-[#1E1E1E] transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider mb-2 block"
                  style={{ color: SECTION_COLORS[r.section] ?? '#F97316' }}>{r.section}</span>
                <h4 className="font-semibold text-[#ccc] text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">{r.title}</h4>
                <p className="text-xs text-[#333] mt-2 flex items-center gap-1"><Clock size={9} />{r.reading_time}m read</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
