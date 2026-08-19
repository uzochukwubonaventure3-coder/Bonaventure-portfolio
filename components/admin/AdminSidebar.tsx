'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Briefcase,
  Settings, LogOut, Menu, X, Star, Mail, ExternalLink,
  Image as ImageIcon, Code2, Upload, Users, Bug,
  Globe, ChevronDown, FileBox, Share2,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { href: '/admin/messages', icon: Mail, label: 'Messages', badge: 'messages' },
      { href: '/admin/bug-reports', icon: Bug, label: 'Bug Reports', badge: 'bugs' },
      { href: '/admin/referrals', icon: Users, label: 'Referrals' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
      { href: '/admin/blog', icon: FileText, label: 'Blog / Journal' },
      { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
      { href: '/admin/testimonials', icon: Star, label: 'Testimonials', badge: 'pending' },
      { href: '/admin/tech-stack', icon: Code2, label: 'Tech Stack' },
      { href: '/admin/social', icon: Share2, label: 'Social Posts' },
    ],
  },
  {
    label: 'Assets',
    items: [
      { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
      { href: '/admin/resume', icon: Upload, label: 'Resume' },
      { href: '/admin/pages', icon: Globe, label: 'Page Content' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.success) setAdmin(d.data); }).catch(() => {});
    loadBadges();
  }, [pathname]);

  async function loadBadges() {
    try {
      const [msgs, tests] = await Promise.all([
        fetch('/api/contact').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/testimonials?all=true').then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setBadges({
        messages: (msgs.data ?? []).filter((m: any) => !m.read).length,
        pending: (tests.data ?? []).filter((t: any) => !t.approved).length,
        bugs: (msgs.data ?? []).filter((m: any) => m.budget === 'Bug Report' && !m.read).length,
      });
    } catch {}
  }

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-black font-bold text-sm shrink-0">BC</div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm">BC Portfolio</p>
            <p className="text-[#555] text-[10px]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[9px] uppercase tracking-widest text-[#333] font-semibold px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label, exact, badge }) => {
                const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin';
                const isActive = exact ? pathname === href : (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
                const badgeCount = badge ? badges[badge] ?? 0 : 0;
                return (
                  <Link key={href} href={href} onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group ${
                      isActive
                        ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/15'
                        : 'text-[#666] hover:text-white hover:bg-[#1A1A1A]'
                    }`}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} />
                      <span>{label}</span>
                    </div>
                    {badgeCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/15 font-bold">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1A1A1A] shrink-0 space-y-1.5">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-all">
          <ExternalLink size={14} />
          <span>View Live Site</span>
        </a>
        {admin && (
          <div className="px-3 py-2.5 rounded-xl bg-[#111] border border-[#1A1A1A]">
            <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
            <p className="text-[#444] text-[10px] truncate">{admin.email}</p>
          </div>
        )}
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-[#0A0A0A] border-r border-[#1A1A1A] z-40">
        <SidebarContent />
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-black font-bold text-xs">BC</div>
          <span className="text-white font-semibold text-sm">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white p-1">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 h-full w-60 bg-[#0A0A0A] border-r border-[#1A1A1A] z-50">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
