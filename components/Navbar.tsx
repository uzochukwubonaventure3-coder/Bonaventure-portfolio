'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, ChevronDown, Globe, Menu, X,
  Link2, Cpu, ImageIcon, User, Home, Briefcase,
  Info, BookOpen, Phone, Moon, Sun, FolderOpen,
  Flame, ArrowRight,
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
  const [navVisible, setNavVisible] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [darkMode, setDarkMode] = useState(true);
  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y < 60) { setNavVisible(true); return; }
      if (y > lastScrollY.current + 8) { setNavVisible(false); setMobileOpen(false); }
      else if (y < lastScrollY.current - 8) { setNavVisible(true); }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── DESKTOP floating pill navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          scrolled ? 'bg-[#111]/95 backdrop-blur-xl border border-[#222] shadow-2xl shadow-black/50'
                   : 'bg-[#111]/80 backdrop-blur-md border border-[#1E1E1E]'
        }`}
        style={{ width: 'min(820px, 92vw)' }}
      >
        <Link href="/" className="font-bold text-lg text-white px-3 py-1 mr-1 shrink-0">BC</Link>

        <nav className="flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === link.href ? 'text-white bg-white/8' : 'text-[#888] hover:text-white'
              }`}>{link.label}</Link>
          ))}
          <div ref={moreRef} className="relative">
            <button onMouseEnter={() => setMoreOpen(true)} onClick={() => setMoreOpen(v => !v)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${moreOpen ? 'text-white' : 'text-[#888] hover:text-white'}`}>
              More <ChevronDown size={13} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                  onMouseLeave={() => setMoreOpen(false)}
                  className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[400px] bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-2 p-3 pb-2">
                    {[{ href:'/bucket-list', label:'Bucket List', desc:'Things to do in my lifetime', grad:'from-[#F97316]/8', emoji:'🪣' },
                      { href:'/streaks', label:'My Streaks', desc:'Daily habits I maintain', grad:'from-orange-500/8', emoji:'🔥' }
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                        className="group relative bg-[#1A1A1A] rounded-xl h-24 flex flex-col justify-end p-3 border border-transparent hover:border-[#F97316]/20 transition-all">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.grad} to-transparent rounded-xl`} />
                        <div className="absolute top-3 right-3 text-lg">{item.emoji}</div>
                        <p className="relative text-white text-xs font-bold">{item.label}</p>
                        <p className="relative text-[#666] text-[10px]">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 px-2 pb-2">
                    {[{ label:'Links', desc:'All my links', href:'/links', icon:<Link2 size={13} className="text-blue-400"/>, bg:'bg-blue-500/10' },
                      { label:'Uses', desc:'My tools & gear', href:'/uses', icon:<Cpu size={13} className="text-purple-400"/>, bg:'bg-purple-500/10' },
                      { label:'Gallery', desc:'Workspace & life', href:'/gallery', icon:<ImageIcon size={13} className="text-pink-400"/>, bg:'bg-pink-500/10' },
                      { label:'/me', desc:'Where I am now', href:'/me', icon:<User size={13} className="text-green-400"/>, bg:'bg-green-500/10' },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#1A1A1A] transition-colors group">
                        <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>{item.icon}</div>
                        <div><p className="text-white text-xs font-semibold group-hover:text-[#F97316] transition-colors">{item.label}</p>
                        <p className="text-[#555] text-[9px]">{item.desc}</p></div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setDarkMode(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all">
            {darkMode ? <Moon size={13} /> : <Sun size={13} />}
          </button>
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-[#888] hover:text-white transition-all">
              <Globe size={12} /> {currentLang.flag} {currentLang.code.toUpperCase()}
              <ChevronDown size={11} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="lang-dropdown">
                  {LANGUAGES.slice(0, 8).map(lang => (
                    <button key={lang.code} onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`lang-option w-full text-left ${currentLang.code === lang.code ? 'active' : ''}`}>
                      <span>{lang.flag}</span>
                      <div><div className="text-xs font-medium text-white">{lang.label}</div></div>
                      {currentLang.code === lang.code && <span className="ml-auto text-[#F97316] text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="https://github.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all"><Github size={13} /></a>
          <a href="https://linkedin.com/in/bonaventure-chidalu-b58221350" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white transition-all"><Linkedin size={13} /></a>
          <Link href="/contact"
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-[#F97316] hover:text-white transition-all">
            Contact
          </Link>
        </div>
      </motion.header>

      {/* ── MOBILE: full-width bottom bar exactly like Image 1 ── */}
      <AnimatePresence>
        {navVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          >
            {/* Full-width bottom bar */}
            <div className="mobile-bottom-bar flex items-center justify-between px-6 py-4 bg-[#111]/98 backdrop-blur-xl border-t">
              <Link href="/" className="font-bold text-white text-base tracking-tight">BC</Link>
              <button onClick={() => setMobileOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#222] text-white transition-all active:scale-95">
                <AnimatePresence mode="wait">
                  {mobileOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.span>
                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE menu sheet — exactly like Image 2 ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 38 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] rounded-t-3xl"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 70px)' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-4">
                <div className="w-10 h-1 bg-[#2A2A2A] rounded-full" />
              </div>

              {/* Nav items — full-width capsule buttons with icons like Image 2 */}
              <div className="px-4 space-y-2 mb-4">
                {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl transition-all ${
                        active
                          ? 'bg-[#2A1F1A] text-white border border-[#3A2A1F]'
                          : 'bg-[#1A1A1A] text-[#888] hover:text-white hover:bg-[#222] border border-transparent'
                      }`}>
                      <Icon size={17} className={active ? 'text-[#F97316]' : 'text-[#555]'} />
                      <span className="font-semibold text-sm">{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom toolbar — 4 icon buttons like Image 2 */}
              <div className="px-4 pt-3 border-t border-[#1A1A1A] flex items-center gap-2">
                <a href="https://linkedin.com/in/bonaventure-chidalu-b58221350" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                  <Linkedin size={17} />
                </a>
                <a href="https://github.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                  <Github size={17} />
                </a>
                <button onClick={() => setLangOpen(v => !v)}
                  className="flex items-center gap-1.5 h-11 px-3 rounded-2xl bg-[#1A1A1A] border border-[#222] text-[#666] hover:text-white transition-colors text-xs font-semibold">
                  <Globe size={15} /> {currentLang.code.toUpperCase()}
                </button>
                <div className="flex-1" />
                <button onClick={() => setDarkMode(v => !v)}
                  className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#666] hover:text-white transition-colors">
                  {darkMode ? <Moon size={17} /> : <Sun size={17} />}
                </button>
              </div>
            </motion.div>

            {/* Language picker overlay */}
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="fixed bottom-72 left-4 right-4 z-[60] bg-[#0D0D0D] border border-[#222] rounded-2xl p-3 grid grid-cols-3 gap-2 shadow-2xl">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs transition-all ${
                        currentLang.code === lang.code
                          ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
                          : 'bg-[#111] text-[#666] border border-[#1A1A1A] hover:text-white'
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
