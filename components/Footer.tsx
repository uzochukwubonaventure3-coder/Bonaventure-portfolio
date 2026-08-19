import Link from 'next/link';
import { MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  GENERAL: [
    { label: 'Home', href: '/' },
    { label: 'About Me', href: '/about' },
    { label: 'Projects', href: '/work' },
    { label: 'Blog', href: '/blog' },
  ],
  WORK: [
    { label: 'Hire Me', href: '/contact' },
    { label: 'Hosting Guide', href: '/hosting-guide' },
    { label: 'Experience', href: '/about#experience' },
    { label: 'Start a Project', href: '/contact' },
    { label: 'Book a Consultation', href: '/contact/consult' },
    { label: 'Refer & Earn 10%', href: '/refer-earn' },
  ],
  COMMUNITY: [
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Share a Testimonial', href: '/testify' },
    { label: 'Report a Bug', href: '/report-bug' },
    { label: 'GitHub', href: 'https://github.com/bonaventurechidalu', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/bonaventure-chidalu-b58221350', external: true },
    { label: 'Twitter / X', href: 'https://twitter.com/bonaventurechidalu', external: true },
  ],
  LEGAL: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#111] mt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">

        {/* Brand row */}
        <div className="mb-10">
          <p className="text-2xl font-bold text-[#F97316] mb-2">bccodesphere</p>
          <p className="text-sm text-[#666] leading-relaxed mb-3 max-w-xs">
            Abuja&apos;s best full-stack web developer. Building fast, scalable, and SEO-optimized web applications.
          </p>
          <div className="flex items-center gap-1.5 text-[#555] text-sm mb-4">
            <MapPin size={13} /><span>FCT Abuja, Nigeria</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-white hover:border-[#333] transition-all">
              <Github size={13} />
            </a>
            <a href="https://twitter.com/bonaventurechidalu" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-white hover:border-[#333] transition-all">
              <Twitter size={13} />
            </a>
            <a href="https://linkedin.com/in/bonaventure-chidalu-b58221350" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center text-[#555] hover:text-white hover:border-[#333] transition-all">
              <Linkedin size={13} />
            </a>
          </div>
        </div>

        {/* ── MOBILE: 2-column grid (like screenshot 12) ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:hidden">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[10px] uppercase tracking-widest text-[#444] mb-3 font-semibold">{category}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#666] hover:text-[#F97316] transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-xs text-[#666] hover:text-[#F97316] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: 4-column grid ── */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[10px] uppercase tracking-widest text-[#444] mb-4">{category}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#666] hover:text-[#F97316] transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[#666] hover:text-[#F97316] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#0D0D0D] px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#444] text-center sm:text-left">
            Found a bug or something to improve?{' '}
            <Link href="/report-bug" className="text-[#F97316] font-semibold hover:underline">
              let me know
            </Link>
            . Your feedback helps me grow! 🙏
          </p>
          <p className="text-xs text-[#333] shrink-0">© {new Date().getFullYear()} Bonaventure Chidalu</p>
        </div>
      </div>
    </footer>
  );
}
