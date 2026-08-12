'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCodeCommit as GitCommit, FaGithub as Github, FaXTwitter as Twitter, FaLinkedin as Linkedin, FaGlobe as Globe, FaBolt as Zap,
  FaArrowsRotate as RefreshCw, FaArrowUpRightFromSquare as ExternalLink, FaCode as Code2, FaStar as Star, FaCodeFork as GitFork,
  FaTerminal as Terminal, FaWifi as Wifi, FaWifi as WifiOff, FaClock as Clock, FaHashtag as Hash, FaHeart, FaRetweet, FaBoxArchive,
} from 'react-icons/fa6';
import { formatDistanceToNow, format } from 'date-fns';

// ─── TYPES ─────────────────────────────────────────────────
interface Commit {
  sha: string; message: string; repo: string; repoUrl: string;
  branch: string; date: string; url: string;
}
interface Repo {
  name: string; description: string | null; url: string;
  stars: number; forks: number; language: string | null;
  updatedAt: string; topics: string[];
}
interface SocialPost {
  id: string; platform: string; content: string; external_url: string;
  ai_summary: string | null; ai_tags: string[]; ai_category: string | null;
  published_at: string; likes: number; reposts: number; media_urls: string[];
}

type FeedItem =
  | { kind: 'commit';  data: Commit;     ts: string }
  | { kind: 'tweet';   data: SocialPost; ts: string }
  | { kind: 'linkedin';data: SocialPost; ts: string }
  | { kind: 'repo';    data: Repo;       ts: string };

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', PHP: '#8892BF',
  Python: '#3776AB', Go: '#00ADD8', Rust: '#DEA584',
  CSS: '#563D7C', HTML: '#E34F26', Vue: '#42B883',
};

// ─── SKELETON ──────────────────────────────────────────────
function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="h-3 bg-[#1A1A1A] rounded w-2/3" />
            <div className="h-2.5 bg-[#111] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── COMMIT ITEM ───────────────────────────────────────────
function CommitItem({ commit }: { commit: Commit }) {
  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#F97316]/40 transition-colors">
        <GitCommit size={11} className="text-[#F97316]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <a href={commit.repoUrl} target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono text-[#F97316] hover:underline truncate max-w-[120px]">
            {commit.repo}
          </a>
          <span className="text-[#2A2A2A] text-[9px]">/{commit.branch}</span>
        </div>
        <a href={commit.url} target="_blank" rel="noopener noreferrer"
          className="text-[11px] text-[#888] hover:text-white transition-colors leading-snug line-clamp-2 block">
          {commit.message}
        </a>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-mono text-[#333]">{commit.sha}</span>
          <span className="text-[9px] text-[#2A2A2A]">{formatDistanceToNow(new Date(commit.date), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}

// ─── SOCIAL ITEM ───────────────────────────────────────────
function SocialItem({ post }: { post: SocialPost }) {
  const isTwitter = post.platform === 'twitter';
  const Icon = isTwitter ? Twitter : Linkedin;
  const color = isTwitter ? '#1D9BF0' : '#0A66C2';
  const label = isTwitter ? 'tweet' : 'post';

  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={11} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
          {post.ai_category && (
            <span className="text-[9px] text-[#333] px-1 py-0.5 bg-[#111] rounded">{post.ai_category}</span>
          )}
        </div>
        <p className="text-[11px] text-[#888] leading-snug line-clamp-2 mb-1">{post.content}</p>
        {post.ai_summary && (
          <p className="text-[10px] text-[#555] italic line-clamp-1">→ {post.ai_summary}</p>
        )}
        <div className="flex items-center gap-3 mt-1 text-[#2A2A2A] text-[9px]">
          <span className="flex items-center gap-1"><FaHeart size={9} aria-hidden="true" /> {post.likes}</span>
          <span className="flex items-center gap-1"><FaRetweet size={9} aria-hidden="true" /> {post.reposts}</span>
          <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
          <a href={post.external_url} target="_blank" rel="noopener noreferrer"
            className="hover:text-[#F97316] transition-colors ml-auto">
            <ExternalLink size={9} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── REPO CARD ─────────────────────────────────────────────
function RepoCard({ repo }: { repo: Repo }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#888') : '#555';
  return (
    <a href={repo.url} target="_blank" rel="noopener noreferrer"
      className="block bg-[#0A0A0A] border border-[#161616] rounded-xl p-3 hover:border-[#F97316]/20 transition-all group">
      <div className="flex items-center gap-2 mb-1.5">
        <Github size={11} className="text-[#555] group-hover:text-white transition-colors" />
        <span className="text-[11px] font-mono font-semibold text-[#ccc] group-hover:text-white transition-colors truncate">{repo.name}</span>
      </div>
      {repo.description && (
        <p className="text-[10px] text-[#444] leading-relaxed mb-2 line-clamp-1">{repo.description}</p>
      )}
      <div className="flex items-center gap-3 text-[9px] text-[#333]">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: langColor }} />
            <span style={{ color: langColor }}>{repo.language}</span>
          </span>
        )}
        <span className="flex items-center gap-0.5"><Star size={8} /> {repo.stars}</span>
        <span className="flex items-center gap-0.5"><GitFork size={8} /> {repo.forks}</span>
      </div>
    </a>
  );
}

// ─── TECH BADGE ────────────────────────────────────────────
function TechBadge({ tech, active }: { tech: string; active: boolean }) {
  const color = LANG_COLORS[tech] ?? '#F97316';
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all"
      style={active
        ? { color, borderColor: `${color}40`, background: `${color}10` }
        : { color: '#444', borderColor: '#1A1A1A', background: '#0D0D0D' }
      }
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? color : '#333' }} />
      {tech}
    </motion.span>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function ActivityFeed() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [techs, setTechs] = useState<string[]>([]);
  const [stats, setStats] = useState({ repos: 0, commits: 0, stars: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'repos'>('feed');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [ghRes, socialRes] = await Promise.allSettled([
        fetch('/api/github'),
        fetch('/api/social?limit=6'),
      ]);

      if (ghRes.status === 'fulfilled' && ghRes.value.ok) {
        const d = await ghRes.value.json();
        setCommits(d.data?.commits ?? []);
        setRepos(d.data?.repos ?? []);
        setTechs(d.data?.techs ?? []);
        setStats(d.data?.stats ?? { repos: 0, commits: 0, stars: 0 });
        setOnline(true);
      } else {
        setOnline(false);
      }

      if (socialRes.status === 'fulfilled' && socialRes.value.ok) {
        const d = await socialRes.value.json();
        setSocialPosts(d.data ?? []);
      }

      setLastUpdated(new Date());
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const t = setInterval(() => load(true), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  // Merge feed items
  const feedItems: FeedItem[] = [
    ...commits.slice(0, 5).map(c => ({ kind: 'commit' as const, data: c, ts: c.date })),
    ...socialPosts.filter(p => p.platform === 'twitter').slice(0, 3).map(p => ({ kind: 'tweet' as const, data: p, ts: p.published_at })),
    ...socialPosts.filter(p => p.platform === 'linkedin').slice(0, 2).map(p => ({ kind: 'linkedin' as const, data: p, ts: p.published_at })),
  ].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()).slice(0, 10);

  return (
    <section className="section max-w-7xl mx-auto px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={16} className="text-[#F97316]" />
            <h2 className="text-2xl font-bold text-white">What I&apos;m Building</h2>
          </div>
          <p className="text-[#555] text-sm">Live activity — GitHub · Twitter · LinkedIn</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Online indicator */}
          <div className="flex items-center gap-1.5 text-[10px]">
            {online
              ? <><Wifi size={11} className="text-green-400" /><span className="text-green-400">live</span></>
              : <><WifiOff size={11} className="text-[#444]" /><span className="text-[#444]">offline</span></>
            }
          </div>
          {lastUpdated && (
            <span className="text-[9px] text-[#333] hidden sm:block">
              {format(lastUpdated, 'HH:mm')}
            </span>
          )}
          <button onClick={() => load(true)} disabled={refreshing}
            className="p-2 rounded-xl bg-[#111] border border-[#1A1A1A] text-[#555] hover:text-white hover:border-[#222] transition-all disabled:opacity-40">
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Public Repos', value: stats.repos, icon: Github },
          { label: 'Recent Commits', value: stats.commits, icon: GitCommit },
          { label: 'Total Stars', value: stats.stars, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-4 text-center">
            <Icon size={14} className="text-[#F97316] mx-auto mb-2" />
            <p className="text-xl font-bold text-white font-mono">{value}</p>
            <p className="text-[10px] text-[#444] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Technologies */}
      {techs.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#333] mb-3">Currently Using</p>
          <div className="flex flex-wrap gap-2">
            {techs.map((t, i) => <TechBadge key={t} tech={t} active={i < 3} />)}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0D0D0D] border border-[#161616] rounded-xl p-1 w-fit">
        {(['feed', 'repos'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
              activeTab === tab ? 'bg-[#F97316] text-white' : 'text-[#555] hover:text-white'
            }`}>
            <span className="flex items-center gap-1.5">{tab === 'feed' ? <><Zap size={11} /> Activity Feed</> : <><FaBoxArchive size={11} /> Repos</>}</span>
          </button>
        ))}
      </div>

      {/* Feed */}
      {activeTab === 'feed' && (
        <div className="bg-[#080808] border border-[#111] rounded-2xl overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#111] bg-[#0A0A0A]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-[10px] font-mono text-[#333] ml-2">~/bonaventure — activity</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-mono text-[#333]">live</span>
            </div>
          </div>

          {/* Feed items */}
          <div className="p-4 space-y-5 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1A1A1A]">
            {loading ? (
              <ActivitySkeleton />
            ) : feedItems.length === 0 ? (
              <div className="text-center py-12 text-[#333]">
                <Terminal size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-mono">No activity yet.</p>
                <p className="text-xs mt-1 text-[#222]">Connect GitHub, Twitter and LinkedIn to see live updates.</p>
              </div>
            ) : (
              <AnimatePresence>
                {feedItems.map((item, i) => (
                  <motion.div key={`${item.kind}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    {item.kind === 'commit' && <CommitItem commit={item.data as Commit} />}
                    {(item.kind === 'tweet' || item.kind === 'linkedin') && <SocialItem post={item.data as SocialPost} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          {!loading && feedItems.length > 0 && (
            <div className="px-4 py-2 border-t border-[#0D0D0D] flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#222]">
                {feedItems.length} events · refreshes every 5min
              </span>
              <a href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'bonaventurechidalu'}`}
                target="_blank" rel="noopener noreferrer"
                className="text-[9px] font-mono text-[#333] hover:text-[#F97316] flex items-center gap-1 transition-colors">
                View GitHub <ExternalLink size={8} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Repos grid */}
      {activeTab === 'repos' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#0D0D0D] border border-[#161616] rounded-xl p-3 animate-pulse h-20" />
              ))}
            </div>
          ) : repos.length === 0 ? (
            <p className="text-center text-[#333] py-12 text-sm">No repos to display.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.map(r => <RepoCard key={r.name} repo={r} />)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
