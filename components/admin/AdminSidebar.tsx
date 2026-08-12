'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTableColumns as LayoutDashboard, FaFolderOpen as FolderOpen, FaFileLines as FileText, FaBriefcase as Briefcase,
  FaMessage as MessageSquare, FaGear as Settings, FaRightFromBracket as LogOut, FaBars as Menu, FaXmark as X, FaStar as Star,
  FaEnvelope as Mail, FaArrowUpRightFromSquare as ExternalLink, FaCompass as Compass,
} from 'react-icons/fa6';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/blog', icon: FileText, label: 'Blog Posts' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/more', icon: Compass, label: 'More Content' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.success) setAdmin(d.data); });
  }, []);

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-black font-bold text-sm">
            BC
          </div>
          <div>
            <p className="text-white font-bold text-sm">BC Portfolio</p>
            <p className="text-[#555] text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
                  : 'text-[#666] hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[#1A1A1A] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-all"
        >
          <ExternalLink size={16} />
          View Site
        </Link>

        {admin && (
          <div className="px-3 py-2.5 rounded-xl bg-[#111] border border-[#1A1A1A]">
            <p className="text-white text-xs font-semibold">{admin.name}</p>
            <p className="text-[#555] text-xs truncate">{admin.email}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0D0D0D] border-r border-[#1A1A1A] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-black font-bold text-xs">BC</div>
          <span className="text-white font-semibold text-sm">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 h-full w-64 bg-[#0D0D0D] border-r border-[#1A1A1A] z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
