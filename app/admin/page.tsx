'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFolderOpen as FolderOpen, FaFileLines as FileText, FaBriefcase as Briefcase, FaStar as Star, FaEnvelope as Mail, FaEye as Eye, FaArrowTrendUp as TrendingUp, FaUsers as Users, FaHand as Hand, FaLightbulb as Lightbulb } from 'react-icons/fa6';
import Link from 'next/link';

interface Stats {
  projects: number;
  posts: number;
  experience: number;
  testimonials: number;
  messages: number;
  unread: number;
}

const card = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [projects, posts, experience, testimonials, messages] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/blog?all=true').then(r => r.json()),
        fetch('/api/experience').then(r => r.json()),
        fetch('/api/testimonials?all=true').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
      ]);
      const msgs = messages.data ?? [];
      setStats({
        projects: projects.data?.length ?? 0,
        posts: posts.data?.length ?? 0,
        experience: experience.data?.length ?? 0,
        testimonials: testimonials.data?.length ?? 0,
        messages: msgs.length,
        unread: msgs.filter((m: any) => !m.read).length,
      });
    }
    load();
  }, []);

  const CARDS = [
    { label: 'Projects', value: stats?.projects, icon: FolderOpen, href: '/admin/projects', color: '#F97316' },
    { label: 'Blog Posts', value: stats?.posts, icon: FileText, href: '/admin/blog', color: '#3B82F6' },
    { label: 'Experience', value: stats?.experience, icon: Briefcase, href: '/admin/experience', color: '#22C55E' },
    { label: 'Testimonials', value: stats?.testimonials, icon: Star, href: '/admin/testimonials', color: '#A855F7' },
    { label: 'Messages', value: stats?.messages, icon: Mail, href: '/admin/messages', color: '#EAB308', badge: stats?.unread },
  ];

  const QUICK = [
    { label: 'Add Project', href: '/admin/projects?new=1', icon: FolderOpen },
    { label: 'New Blog Post', href: '/admin/blog?new=1', icon: FileText },
    { label: 'Add Experience', href: '/admin/experience?new=1', icon: Briefcase },
    { label: 'Site Settings', href: '/admin/settings', icon: TrendingUp },
  ];

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#555] text-sm mt-1 flex items-center gap-1.5">Welcome back, Bonaventure <Hand className="text-[#F97316]" size={14} /></p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {CARDS.map(({ label, value, icon: Icon, href, color, badge }, i) => (
          <motion.div key={label} variants={card(i)} initial="hidden" animate="show">
            <Link href={href} className="block bg-[#111] border border-[#1E1E1E] rounded-2xl p-5 hover:border-[#2A2A2A] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                    {badge} new
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">
                {value ?? <span className="text-[#333] animate-pulse">—</span>}
              </p>
              <p className="text-xs text-[#555]">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={card(5)} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3.5 bg-[#111] border border-[#1E1E1E] rounded-xl text-sm text-[#888] hover:text-[#F97316] hover:border-[#F97316]/20 transition-all"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={card(6)} initial="hidden" animate="show">
        <div className="bg-[#F97316]/5 border border-[#F97316]/15 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Lightbulb size={15} /> Getting Started
          </h3>
          <ul className="space-y-1.5 text-sm text-[#888]">
            <li>1. Go to <strong className="text-white">Settings</strong> and update your bio, stats and social links</li>
            <li>2. Add your real projects under <strong className="text-white">Projects</strong> with screenshots from Cloudinary</li>
            <li>3. Add your work history under <strong className="text-white">Experience</strong></li>
            <li>4. Publish blog posts from the <strong className="text-white">Blog Posts</strong> section</li>
            <li>5. Approve testimonials submitted through your contact form</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
