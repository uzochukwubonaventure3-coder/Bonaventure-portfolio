'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub as Github, FaLinkedin as Linkedin, FaChevronDown as ChevronDown, FaGlobe as Globe, FaBars as Menu, FaXmark as X, FaCheck, FaArrowUpRightFromSquare, FaImages, FaLayerGroup, FaLink, FaUser } from 'react-icons/fa6';
import { LANGUAGES, NAV_LINKS } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
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
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-colors ${moreOpen ? 'bg-[#1A1A1A] text-white' : 'text-[#888] hover:text-white'}`}
            >
              More <ChevronDown size={12} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 top-full mt-3 w-[520px] rounded-2xl border border-[#242424] bg-[#111]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
                  role="menu"
                >
                  <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/bucket-list" onClick={() => setMoreOpen(false)} className="group relative min-h-48 overflow-hidden rounded-xl border border-[#2A2A2A] bg-gradient-to-br from-[#5D3B25] via-[#27211E] to-[#111] p-4" role="menuitem">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(249,115,22,0.42),transparent_34%),linear-gradient(145deg,transparent_45%,rgba(0,0,0,0.7))] transition-transform duration-300 group-hover:scale-110" />
                        <div className="relative flex h-full flex-col justify-end">
                          <span className="mb-2 w-fit rounded-lg bg-black/30 p-2 text-[#F97316]"><FaLayerGroup size={14} /></span>
                          <p className="font-semibold text-white">Bucket list</p>
                          <p className="text-xs text-[#C4B5A5]">Goals worth pursuing</p>
                        </div>
                      </Link>
                      <Link href="/gallery" onClick={() => setMoreOpen(false)} className="group relative min-h-48 overflow-hidden rounded-xl border border-[#2A2A2A] bg-gradient-to-br from-[#16333A] via-[#182125] to-[#111] p-4" role="menuitem">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.28),transparent_32%),linear-gradient(145deg,transparent_45%,rgba(0,0,0,0.72))] transition-transform duration-300 group-hover:scale-110" />
                        <div className="relative flex h-full flex-col justify-end">
                          <span className="mb-2 w-fit rounded-lg bg-black/30 p-2 text-sky-300"><FaUser size={14} /></span>
                          <p className="font-semibold text-white">Gallery</p>
                          <p className="text-xs text-[#A9C4CA]">A visual work journal</p>
                        </div>
                      </Link>
                    </div>
                    <div className="space-y-1 rounded-xl bg-[#0D0D0D]/80 p-2">
                      {[
                        { href: '/links', icon: FaLink, label: 'Links', description: 'Every important destination' },
                        { href: '/uses', icon: FaLayerGroup, label: 'Uses', description: 'Tools behind my work' },
                        { href: '/gallery', icon: FaImages, label: 'Gallery', description: 'A visual work journal' },
                        { href: '/bucket-list', icon: FaUser, label: 'Bucket list', description: 'Goals and milestones' },
                      ].map(({ href, icon: Icon, label, description }) => (
                        <Link key={label} href={href} onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#1A1A1A]" role="menuitem">
                          <span className="rounded-lg bg-black/40 p-2 text-[#F97316]"><Icon size={13} /></span>
                          <span>
                            <span className="block text-sm font-medium text-white">{label}</span>
                            <span className="block text-[11px] text-[#666]">{description}</span>
                          </span>
                          <FaArrowUpRightFromSquare className="ml-auto text-[#444]" size={10} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                        <FaCheck className="ml-auto text-[#F97316]" size={11} aria-label="Selected" />
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
