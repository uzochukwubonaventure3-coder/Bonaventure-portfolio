'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { LANGUAGES, NAV_LINKS } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
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
        {/* Logo */}
        <Link href="/" className="font-bold text-lg text-white px-3 py-1 mr-2">
          BC
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                pathname === link.href
                  ? 'text-white font-medium'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm text-[#888] hover:text-white transition-colors">
            More <ChevronDown size={14} />
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#888] hover:text-white hover:border-[#F97316]/40 transition-all"
            >
              <Globe size={14} />
              <span>{currentLang.flag}</span>
              <span className="text-xs">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="lang-dropdown"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`lang-option w-full text-left ${currentLang.code === lang.code ? 'active' : ''}`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{lang.label}</div>
                        <div className="text-[11px] text-[#666]">{lang.name}</div>
                      </div>
                      {currentLang.code === lang.code && (
                        <span className="ml-auto text-[#F97316] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Links */}
          <a
            href="https://github.com/bonaventurechidalu"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white hover:border-[#333] transition-all"
          >
            <Github size={15} />
          </a>
          <a
            href="https://linkedin.com/in/bonaventure-chidalu-b58221350"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-white hover:border-[#333] transition-all"
          >
            <Linkedin size={15} />
          </a>

          {/* Contact */}
          <Link
            href="/contact"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all duration-200"
          >
            Contact
          </Link>
        </div>
      </motion.header>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-nav">
        <Link href="/" className="font-bold text-white text-lg">BC</Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed bottom-16 left-4 right-4 z-50 bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col gap-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-[#F97316]/10 text-[#F97316]'
                    : 'text-[#888] hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl bg-[#F97316] text-black text-sm font-semibold text-center"
            >
              Contact
            </Link>
            {/* Mobile Lang */}
            <div className="border-t border-[#222] pt-3 mt-1">
              <p className="text-xs text-[#555] mb-2 px-1">Language</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.slice(0, 6).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setCurrentLang(lang); setMobileOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                      currentLang.code === lang.code
                        ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
                        : 'bg-[#1A1A1A] text-[#888] border border-[#222]'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
