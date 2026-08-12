'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import { usePosts, useFeaturedPosts, useSearchPosts, useAllTags } from '@/hooks/usePosts';
import type { Post, PostSection } from '@/types';
import {
  FaMagnifyingGlass as Search, FaXmark as X, FaClock as Clock, FaEye as Eye, FaArrowUpRightFromSquare as ExternalLink, FaWandMagicSparkles as Sparkles,
  FaBolt as Zap, FaCode as Code2, FaBrain as Brain, FaBookOpen as BookOpen, FaFire as Flame, FaArrowRight as ArrowRight,
  FaCalendar as Calendar, FaGlobe as Globe, FaGithub as Github, FaStar as Star, FaArrowTrendUp as TrendingUp, FaHashtag as Hash, FaRocket,
} from 'react-icons/fa6';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';

const SECTIONS = [
  { label: 'all',                icon: Flame,      color: '#F97316', desc: 'Everything' },
  { label: 'Latest Thoughts',    icon: Zap,        color: '#FBBF24', desc: 'Short takes' },
  { label: 'Building In Public', icon: TrendingUp, color: '#34D399', desc: 'Ship logs' },
  { label: 'Engineering Notes',  icon: Code2,      color: '#60A5FA', desc: 'Deep dives' },
  { label: 'AI Experiments',     icon: Brain,      color: '#C084FC', desc: 'ML & AI' },
  { label: "What I'm Learning",  icon: BookOpen,   color: '#F472B6', desc: 'Growth' },
] as const;

function FeaturedCard({ post, index }: { post: Post; index: number }) {
  const sec = SECTIONS.find(s => s.label === post.section) ?? SECTIONS[1];
  const Ic = sec.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#F97316]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#F97316]/5"
    >
      {post.cover_image
        ? <div className="h-44 overflow-hidden"><img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
        : <div className="h-44 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${sec.color}10, transparent)` }}><Ic size={48} style={{ color: sec.color, opacity: 0.2 }} /></div>
      }
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: sec.color }}><Ic size={10} />{post.section}</span>
          <span className="flex items-center gap-1 text-[10px] bg-[#F97316] text-black px-2 py-0.5 rounded-full font-bold"><Star size={8} />FEATURED</span>
        </div>
        <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-[#F97316] transition-colors line-clamp-2">{post.title}</h3>
        {post.excerpt && <p className="text-[#555] text-xs leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>}
        {post.ai_summary && (
          <div className="flex items-start gap-1.5 bg-[#130F1A] border border-[#A855F7]/10 rounded-xl px-3 py-2 mb-3">
            <Sparkles size={10} className="text-[#A855F7] mt-0.5 shrink-0" />
            <p className="text-[10px] text-[#666] leading-relaxed line-clamp-2">{post.ai_summary}</p>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 text-[#444] text-[10px]">
            <span className="flex items-center gap-1"><Clock size={9} />{post.reading_time}m</span>
            <span className="flex items-center gap-1"><Eye size={9} />{post.views}</span>
            <span className="flex items-center gap-1"><Calendar size={9} />{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-[10px] text-[#F97316] font-semibold hover:gap-2 transition-all">Read <ArrowRight size={10} /></Link>
        </div>
      </div>
    </motion.article>
  );
}

function FeedCard({ post, index }: { post: Post; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const sec = SECTIONS.find(s => s.label === post.section) ?? SECTIONS[1];
  const Ic = sec.icon;
  return (
    <motion.article ref={ref}
      initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
      className="group bg-[#0D0D0D] border border-[#161616] rounded-2xl overflow-hidden hover:border-[#1E1E1E] hover:shadow-lg hover:shadow-black/50 transition-all duration-300"
    >
      <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: sec.color }} />
      {post.cover_image && (
        <div className="h-36 overflow-hidden"><img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" loading="lazy" /></div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: sec.color }}><Ic size={9} />{post.section}</span>
          {post.external_url && <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="text-[#333] hover:text-[#F97316] transition-colors"><ExternalLink size={10} /></a>}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-[#ccc] text-sm leading-snug mb-2 group-hover:text-white transition-colors line-clamp-3">{post.title}</h3>
        </Link>
        {post.excerpt && <p className="text-[#444] text-[11px] leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>}
        {post.ai_summary && (
          <div className="flex items-start gap-1.5 bg-[#130F1A] border border-[#A855F7]/10 rounded-lg px-2.5 py-1.5 mb-3">
            <Sparkles size={9} className="text-[#A855F7] mt-0.5 shrink-0" />
            <p className="text-[9px] text-[#666] leading-relaxed line-clamp-2">{post.ai_summary}</p>
          </div>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-[#111] border border-[#1A1A1A] rounded text-[#444]"><Hash size={7} />{t}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-[#333] text-[9px] pt-2.5 border-t border-[#111]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5"><Clock size={8} />{post.reading_time}m</span>
            <span className="flex items-center gap-0.5"><Eye size={8} />{post.views}</span>
          </div>
          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </motion.article>
  );
}

function TimelineItem({ post, isLast }: { post: Post; isLast: boolean }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const sec = SECTIONS.find(s => s.label === post.section) ?? SECTIONS[1];
  const Ic = sec.icon;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4 }} className="flex gap-4 group">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
          style={{ borderColor: sec.color, background: `${sec.color}15` }}>
          <Ic size={13} style={{ color: sec.color }} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-[#1A1A1A] to-transparent mt-2 min-h-8" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-[#2A2A2A]">{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
          <span className="text-[10px] font-semibold" style={{ color: sec.color }}>{post.section}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h4 className="font-semibold text-[#bbb] text-sm leading-snug mb-1.5 hover:text-white transition-colors">{post.title}</h4>
        </Link>
        {post.excerpt && <p className="text-[11px] text-[#3A3A3A] leading-relaxed mb-2 line-clamp-2">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-[#2A2A2A] text-[10px]">
          <span className="flex items-center gap-0.5"><Clock size={9} />{post.reading_time}m</span>
          <span className="flex items-center gap-0.5"><Eye size={9} />{post.views}</span>
          {post.tags[0] && <span className="flex items-center gap-0.5 text-[#F97316]/50"><Hash size={8} />{post.tags[0]}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-4 animate-pulse">
      <div className="h-36 bg-[#1A1A1A] rounded-xl mb-4" />
      <div className="h-2.5 bg-[#1A1A1A] rounded w-1/3 mb-3" />
      <div className="h-4 bg-[#1A1A1A] rounded w-4/5 mb-2" />
      <div className="h-3 bg-[#1A1A1A] rounded w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="h-2.5 bg-[#1A1A1A] rounded w-12" />
        <div className="h-2.5 bg-[#1A1A1A] rounded w-16" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [activeTag, setActiveTag] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { posts, loading, loadingMore, hasMore, total, loadMore, updateParams } = usePosts();
  const { posts: featured, loading: featuredLoading } = useFeaturedPosts(3);
  const { tags } = useAllTags();
  const { query, setQuery, results, searching } = useSearchPosts();

  const { ref: sentinelRef, inView: sentinelInView } = useInView({ threshold: 0.1 });
  useEffect(() => { if (sentinelInView && hasMore && !loadingMore) loadMore(); }, [sentinelInView, hasMore, loadingMore]);
  useEffect(() => { if (showSearch) setTimeout(() => searchRef.current?.focus(), 100); }, [showSearch]);

  function handleSection(sec: string) {
    setActiveSection(sec);
    setActiveTag('');
    updateParams({ section: sec as any, tag: '' });
  }

  function handleTag(tag: string) {
    const next = activeTag === tag ? '' : tag;
    setActiveTag(next);
    updateParams({ tag: next });
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">

        {/* HERO */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-[#1E1E1E] text-xs text-[#555] mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live engineering journal · {total} entries
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  Engineering<br /><span className="text-[#F97316]">Journal</span>
                </h1>
                <p className="text-[#555] text-base max-w-lg">Thoughts, experiments, and learnings from building in public.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowSearch(!showSearch)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${showSearch ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]' : 'bg-[#111] border-[#1E1E1E] text-[#666] hover:text-white'}`}>
                  <Search size={14} /><span className="hidden sm:block">Search</span>
                </button>
                <button onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl border transition-all ${viewMode === 'grid' ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]' : 'bg-[#111] border-[#1E1E1E] text-[#555]'}`}>
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">{[0,1,2,3].map(i=><div key={i} className="rounded-[1px] bg-current"/>)}</div>
                </button>
                <button onClick={() => setViewMode('timeline')}
                  className={`p-2.5 rounded-xl border transition-all ${viewMode === 'timeline' ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]' : 'bg-[#111] border-[#1E1E1E] text-[#555]'}`}>
                  <div className="flex flex-col gap-0.5 w-3 h-3 justify-center">{[0,1,2].map(i=><div key={i} className="h-px bg-current"/>)}</div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* SEARCH */}
          <AnimatePresence>
            {showSearch && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden">
                <div className="relative">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                  <input ref={searchRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search posts, tags, topics..."
                    className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl pl-11 pr-10 py-3.5 text-white text-sm placeholder-[#2A2A2A] focus:outline-none focus:border-[#F97316]/40 transition-all" />
                  {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white"><X size={14} /></button>}
                </div>
                <AnimatePresence>
                  {(results.length > 0 || searching) && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-2 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl shadow-black">
                      {searching && (
                        <div className="px-4 py-3 flex items-center gap-2 text-[#444] text-sm">
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />Searching...
                        </div>
                      )}
                      {results.map(r => {
                        const s = SECTIONS.find(x => x.label === r.section) ?? SECTIONS[1];
                        const I = s.icon;
                        return (
                          <Link key={r.id} href={`/blog/${r.slug}`} onClick={() => { setQuery(''); setShowSearch(false); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#111] border-b border-[#0A0A0A] last:border-0 transition-colors">
                            <I size={12} style={{ color: s.color }} />
                            <div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{r.title}</p><p className="text-[#333] text-xs">{r.section} · {r.reading_time}m</p></div>
                            <ArrowRight size={11} className="text-[#222] shrink-0" />
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* SECTION TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            {SECTIONS.map(({ label, icon: Ic, color }) => (
              <button key={label} onClick={() => handleSection(label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all shrink-0 ${activeSection === label ? 'text-white' : 'bg-[#0D0D0D] border-[#1A1A1A] text-[#444] hover:text-white hover:border-[#222]'}`}
                style={activeSection === label ? { background: `${color}12`, borderColor: `${color}35`, color } : {}}>
                <Ic size={12} />
                {label === 'all' ? 'All' : label}
              </button>
            ))}
          </div>

          {/* FEATURED */}
          {activeSection === 'all' && !featuredLoading && featured.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Star size={13} className="text-[#F97316]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Featured</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((p, i) => <FeaturedCard key={p.id} post={p} index={i} />)}
              </div>
            </div>
          )}

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-7">
              {tags.slice(0, 24).map(tag => (
                <button key={tag} onClick={() => handleTag(tag)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${activeTag === tag ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]' : 'bg-[#0D0D0D] border-[#161616] text-[#3A3A3A] hover:text-[#888] hover:border-[#1E1E1E]'}`}>
                  <Hash size={9} />{tag}
                </button>
              ))}
              {activeTag && (
                <button onClick={() => handleTag('')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-red-500/8 border border-red-500/15 text-red-400">
                  <X size={9} /> Clear
                </button>
              )}
            </div>
          )}

          {/* COUNT */}
          {!loading && <p className="text-[#333] text-xs mb-6">{total} {total === 1 ? 'post' : 'posts'}{activeTag ? <> tagged <span className="text-[#F97316]">#{activeTag}</span></> : ''}</p>}

          {/* GRID */}
          {viewMode === 'grid' && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : posts.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <FaRocket className="mx-auto mb-4 text-[#F97316]" size={44} aria-label="No posts" />
                  <p className="text-white font-semibold text-lg mb-2">Nothing here yet</p>
                  <p className="text-[#333] text-sm">No posts match your filters.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {posts.map((p, i) => <FeedCard key={p.id} post={p} index={i} />)}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {/* TIMELINE */}
          {viewMode === 'timeline' && (
            <div className="max-w-2xl">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-[#1A1A1A] rounded w-1/4" />
                        <div className="h-4 bg-[#1A1A1A] rounded w-3/4" />
                        <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                posts.map((p, i) => <TimelineItem key={p.id} post={p} isLast={i === posts.length - 1} />)
              )}
            </div>
          )}

          {/* SENTINEL */}
          <div ref={sentinelRef} className="h-8" />
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-[#444] text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />
                Loading more...
              </div>
            </div>
          )}
          {!loading && !hasMore && posts.length > 0 && (
            <div className="text-center py-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D0D0D] border border-[#1A1A1A] text-xs text-[#333]">
                You&apos;ve reached the end <Sparkles className="text-[#F97316]" size={12} aria-hidden="true" />
              </span>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
