'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, FileText, Briefcase, Star, Mail, TrendingUp,
  Users, Bug, Image as ImageIcon, Share2, Code2, Eye,
  ArrowUpRight, Clock, CheckCircle, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [pendingTests, setPendingTests] = useState<any[]>([]);
  const [adminName, setAdminName] = useState('Bonaventure');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.success) setAdminName(d.data.name.split(' ')[0]);
    }).catch(() => {});
    loadData();
  }, []);

  async function loadData() {
    try {
      const [projects, posts, exp, tests, msgs, settings] = await Promise.all([
        fetch('/api/projects').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/posts?all=true&limit=100').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/experience').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/testimonials?all=true').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/contact').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/stats').then(r => r.json()).catch(() => ({ data: {} })),
      ]);
      const allMsgs = msgs.data ?? [];
      const allTests = tests.data ?? [];
      setStats({
        projects: (projects.data ?? []).length,
        posts: (posts.data ?? []).length,
        experience: (exp.data ?? []).length,
        testimonials: allTests.length,
        pendingTests: allTests.filter((t: any) => !t.approved).length,
        messages: allMsgs.length,
        unread: allMsgs.filter((m: any) => !m.read).length,
        bugs: allMsgs.filter((m: any) => m.budget === 'Bug Report' && !m.read).length,
        referrals: allMsgs.filter((m: any) => m.budget === 'Referral').length,
        statYears: settings.data?.stat_years ?? '—',
        statProjects: settings.data?.stat_projects ?? '—',
        statUsers: settings.data?.stat_users ?? '—',
      });
      setRecentMessages(allMsgs.slice(0, 4));
      setPendingTests(allTests.filter((t: any) => !t.approved).slice(0, 3));
    } catch {}
  }

  const STAT_CARDS = [
    { label: 'Projects', value: stats?.projects, icon: FolderOpen, href: '/admin/projects', color: '#F97316' },
    { label: 'Blog Posts', value: stats?.posts, icon: FileText, href: '/admin/blog', color: '#3B82F6' },
    { label: 'Experience', value: stats?.experience, icon: Briefcase, href: '/admin/experience', color: '#22C55E' },
    { label: 'Testimonials', value: stats?.testimonials, icon: Star, href: '/admin/testimonials', color: '#A855F7', badge: stats?.pendingTests },
    { label: 'Messages', value: stats?.messages, icon: Mail, href: '/admin/messages', color: '#EAB308', badge: stats?.unread },
    { label: 'Bug Reports', value: stats?.bugs ?? 0, icon: Bug, href: '/admin/bug-reports', color: '#EF4444', badge: stats?.bugs },
    { label: 'Referrals', value: stats?.referrals ?? 0, icon: Users, href: '/admin/referrals', color: '#34D399' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add Project', href: '/admin/projects', icon: FolderOpen, color: '#F97316' },
    { label: 'New Blog Post', href: '/admin/blog', icon: FileText, color: '#3B82F6' },
    { label: 'Add Experience', href: '/admin/experience', icon: Briefcase, color: '#22C55E' },
    { label: 'Upload Resume', href: '/admin/resume', icon: TrendingUp, color: '#A855F7' },
    { label: 'Manage Media', href: '/admin/media', icon: ImageIcon, color: '#F472B6' },
    { label: 'Edit Tech Stack', href: '/admin/tech-stack', icon: Code2, color: '#60A5FA' },
    { label: 'Page Content', href: '/admin/pages', icon: Eye, color: '#FBBF24' },
    { label: 'Site Settings', href: '/admin/settings', icon: TrendingUp, color: '#34D399' },
  ];

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 min-h-screen max-w-6xl">

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {adminName} 👋</h1>
            <p className="text-[#555] text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {stats?.unread > 0 && (
              <Link href="/admin/messages" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition-all">
                <AlertCircle size={13} /> {stats.unread} unread message{stats.unread > 1 ? 's' : ''}
              </Link>
            )}
            {stats?.pendingTests > 0 && (
              <Link href="/admin/testimonials" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/15 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/15 transition-all">
                <Clock size={13} /> {stats.pendingTests} pending testimonial{stats.pendingTests > 1 ? 's' : ''}
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hero stats from settings */}
      {stats && (
        <motion.div variants={fadeUp(0)} initial="hidden" animate="show" className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Years Experience', value: stats.statYears, color: '#F97316' },
            { label: 'Projects Delivered', value: stats.statProjects, color: '#22C55E' },
            { label: 'Users Impacted', value: stats.statUsers, color: '#3B82F6' },
          ].map(s => (
            <div key={s.label} className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-[#444] mt-1">{s.label}</p>
              <Link href="/admin/settings" className="text-[9px] text-[#333] hover:text-[#F97316] transition-colors mt-1 block">edit →</Link>
            </div>
          ))}
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color, badge }, i) => (
          <motion.div key={label} variants={fadeUp(i + 1)} initial="hidden" animate="show">
            <Link href={href} className="block bg-[#111] border border-[#1A1A1A] rounded-2xl p-4 hover:border-[#222] transition-all group relative">
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="text-xl font-bold text-white font-mono">
                {value !== undefined ? value : <span className="text-[#222] animate-pulse">—</span>}
              </p>
              <p className="text-[10px] text-[#444] mt-0.5">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <motion.div variants={fadeUp(8)} initial="hidden" animate="show" className="lg:col-span-2">
          <h2 className="text-xs font-bold text-[#555] uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
              <Link key={label} href={href}
                className="flex flex-col items-center gap-2 p-4 bg-[#0D0D0D] border border-[#161616] rounded-2xl hover:border-[#222] transition-all group text-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <span className="text-[10px] text-[#666] group-hover:text-white transition-colors leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Pending Testimonials */}
        <motion.div variants={fadeUp(9)} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[#555] uppercase tracking-wider">Pending Reviews</h2>
            <Link href="/admin/testimonials" className="text-[10px] text-[#F97316] hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {pendingTests.length === 0 ? (
              <div className="bg-[#0D0D0D] border border-[#161616] rounded-2xl p-4 text-center">
                <CheckCircle size={20} className="text-green-400 mx-auto mb-2" />
                <p className="text-[#444] text-xs">All caught up!</p>
              </div>
            ) : (
              pendingTests.map(t => (
                <Link key={t.id} href="/admin/testimonials"
                  className="flex items-center gap-3 bg-[#0D0D0D] border border-yellow-500/10 rounded-xl p-3 hover:border-yellow-500/20 transition-all">
                  <div className="w-7 h-7 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[10px] font-bold text-[#F97316] shrink-0">
                    {t.initials || t.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{t.name}</p>
                    <p className="text-[#555] text-[10px] truncate">"{t.quote?.slice(0, 40)}..."</p>
                  </div>
                  <span className="text-[9px] text-yellow-400 shrink-0">⏳</span>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Messages */}
      <motion.div variants={fadeUp(10)} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#555] uppercase tracking-wider">Recent Messages</h2>
          <Link href="/admin/messages" className="text-[10px] text-[#F97316] hover:underline">View all</Link>
        </div>
        <div className="bg-[#0D0D0D] border border-[#161616] rounded-2xl overflow-hidden">
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-[#333] text-sm">No messages yet</div>
          ) : (
            recentMessages.map((msg, i) => (
              <Link key={msg.id} href="/admin/messages"
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#111] transition-colors ${i < recentMessages.length - 1 ? 'border-b border-[#0F0F0F]' : ''}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-[#F97316]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold truncate ${msg.read ? 'text-[#666]' : 'text-white'}`}>{msg.name}</p>
                    {msg.budget && <span className="text-[9px] px-1.5 py-0.5 bg-[#1A1A1A] text-[#555] rounded-full">{msg.budget}</span>}
                  </div>
                  <p className="text-[11px] text-[#444] truncate">{msg.message?.slice(0, 60)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-[#333]">{formatDistanceToNow(new Date(msg.createdAt || msg.created_at), { addSuffix: true })}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
