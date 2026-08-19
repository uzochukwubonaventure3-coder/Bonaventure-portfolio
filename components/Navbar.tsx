'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, ChevronDown, Globe, Menu, X,
  Link2, Cpu, Image as ImageIcon, User, Home, Briefcase,
  Info, BookOpen, Phone, Moon, Sun, Twitter,
} from 'lucide-react';
import { LANGUAGES, NAV_LINKS } from '@/lib/data';

const MOBILE_NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/work', label: 'Work', icon: Briefcase },
  { href: '/about', label: 'About', icon: Info },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [darkMode, setDarkMode] = useState(true);
  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Scroll hide/show for mobile nav
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY < 60) { setMobileVisible(true); return; }
      if (currentY > lastScrollY.current + 5) {
        setMobileVisible(false);
        setMobileOpen(false);
      } else if (currentY < lastScrollY.current - 5) {
        setMobileVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Light/dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── DESKTOP Navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#111]/95 backdrop-blur-xl border border-[#222] shadow-2xl shadow-black/50'
            : 'bg-[#111]/80 backdrop-blur-md border border-[#1E1E1E]'
        }`}
        style={{ width: 'min(820px, 92vw)' }}
      >
        <Link href="/" className="font-bold text-lg text-white px-3 py-1 mr-2">BC</Link>
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                pathname === link.href ? 'text-white font-medium' : 'text-[#888] hover:text-white'
              }`}>
              {link.label}
            </Link>
          ))}
          <div ref={moreRef} className="relative">
            <button onMouseEnter={() => setMoreOpen(true)} onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-colors ${moreOpen ? 'text-white' : 'text-[#888] hover:text-white'}`}>
              More <ChevronDown size={14} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18 }}
                  onMouseLeave={() => setMoreOpen(false)}
                  className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[420px] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-2 p-3 pb-2">
                    {[
                      { href: '/bucket-list', label: 'Bucket List', desc: 'Things to do at least once in my life', emoji: '🪣', grad: 'from-[#F97316]/8' },
                      { href: '/streaks', label: 'My Streaks', desc: 'Streaks I maintain 🔥', emoji: '🔥', grad: 'from-orange-500/8' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                        className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden h-28 flex flex-col justify-end p-3 hover:border-[#F97316]/30 border border-transparent transition-all">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.grad} to-transparent`} />
                        <div className="absolute top-3 right-3 text-2xl">{item.emoji}</div>
                        <div className="relative">
                          <p className="text-white text-sm font-semibold leading-tight">{item.label}</p>
                          <p className="text-[#666] text-[11px] mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-0 px-1 pb-2">
                    {[
                      { label: 'Links', desc: 'All my links are...', href: '/links', icon: <Link2 size={14} className="text-blue-400" />, bg: 'bg-blue-500/10' },
                      { label: 'Uses', desc: 'A peek into my...', href: '/uses', icon: <Cpu size={14} className="text-purple-400" />, bg: 'bg-purple-500/10' },
                      { label: 'Gallery', desc: 'Workspace & g...', href: '/gallery', icon: <ImageIcon size={14} className="text-pink-400" />, bg: 'bg-pink-500/10' },
                      { label: '/me', desc: 'Where I am right...', href: '/me', icon: <User size={14} className="text-green-400" />, bg: 'bg-green-500/10' },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1A1A1A] transition-colors group mx-1 my-0.5">
                        <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>{item.icon}</div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-semibold group-hover:text-[#F97316] transition-colors">{item.label}</p>
                          <p className="text-[#555] text-[10px] truncate">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all">
            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#888] hover:text-white hover:border-[#F97316]/40 transition-all">
              <Globe size={14} /><span>{currentLang.flag}</span><span className="text-xs">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="lang-dropdown">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`lang-option w-full text-left ${currentLang.code === lang.code ? 'active' : ''}`}>
                      <span className="text-base">{lang.flag}</span>
                      <div><div className="text-sm font-medium text-white">{lang.label}</div><div className="text-[11px] text-[#666]">{lang.name}</div></div>
                      {currentLang.code === lang.code && <span className="ml-auto text-[#F97316] text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="https://github.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all"><Github size={15} /></a>
          <a href="https://linkedin.com/in/bonaventure-chidalu-b58221350" target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all"><Linkedin size={15} /></a>
          <Link href="/contact"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all duration-200">
            Contact
          </Link>
        </div>
      </motion.header>

      {/* ── MOBILE Bottom Pill — hide/show on scroll ── */}
      <AnimatePresence>
        {mobileVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-[#111]/95 backdrop-blur-xl border border-[#222] rounded-full shadow-2xl shadow-black/70">
              <Link href="/" className="font-bold text-white text-base tracking-tight">BC</Link>
              <div className="w-px h-4 bg-[#2A2A2A]" />
              <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-0.5">
                <AnimatePresence mode="wait">
                  {mobileOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE Menu Sheet (Image 5 style) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] rounded-t-3xl shadow-2xl overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-[#2A2A2A] rounded-full" />
              </div>

              {/* Brand */}
              <div className="px-5 py-3 border-b border-[#1A1A1A]">
                <p className="text-[#F97316] font-bold text-sm">bccodesphere</p>
              </div>

              {/* Nav links — full width list */}
              <div className="px-3 py-2">
                {MOBILE_NAV.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl mb-1 text-sm font-medium transition-all ${
                      pathname === href
                        ? 'bg-[#F97316]/10 text-white border border-[#F97316]/15'
                        : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
                    }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pathname === href ? 'bg-[#F97316]/15' : 'bg-[#1A1A1A]'}`}>
                      <Icon size={16} className={pathname === href ? 'text-[#F97316]' : 'text-[#555]'} />
                    </div>
                    {label}
                  </Link>
                ))}
              </div>

              {/* Bottom toolbar */}
              <div className="border-t border-[#1A1A1A] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a href="https://linkedin.com/in/bonaventure-chidalu-b58221350" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://github.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                    <Github size={16} />
                  </a>
                  <button onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-1.5 h-10 px-3 rounded-2xl bg-[#1A1A1A] border border-[#222] text-[#666] hover:text-white transition-colors text-xs">
                    <Globe size={14} /> {currentLang.code.toUpperCase()}
                  </button>
                </div>
                <button onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                  {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                </button>
              </div>

              {/* Safe area spacer */}
              <div className="h-safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }} />
            </motion.div>

            {/* Language dropdown on mobile */}
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="fixed bottom-60 left-4 right-4 z-[60] bg-[#0D0D0D] border border-[#222] rounded-2xl p-3 grid grid-cols-3 gap-2 shadow-2xl">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs transition-all ${
                        currentLang.code === lang.code ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20' : 'bg-[#111] text-[#666] border border-[#1A1A1A]'
                      }`}>
                      <span>{lang.flag}</span>{lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
