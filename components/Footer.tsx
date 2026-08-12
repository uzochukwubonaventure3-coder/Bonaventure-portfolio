'use client';

import Link from 'next/link';
import { FaLocationDot as MapPin } from 'react-icons/fa6';
import { FOOTER_LINKS } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t border-[#111] mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-[#F97316] mb-3">bccodesphere</p>
            <p className="text-sm text-[#666] leading-relaxed mb-4">
              Nigeria&apos;s best full-stack web developer. Building fast, scalable, and SEO-optimized web applications.
            </p>
            <div className="flex items-center gap-1.5 text-[#555] text-sm">
              <MapPin size={13} />
              <span>FCT Abuja, Nigeria</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[10px] uppercase tracking-widest text-[#444] mb-4">{category}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') || link.href.startsWith('mailto:') ? (
                      <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-sm text-[#666] hover:text-[#F97316] transition-colors">
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
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-[#444] text-center">
            I&apos;m not an island of knowledge. If you&apos;ve spotted something that could be better, or found a bug, please{' '}
            <a href="mailto:abonaventure@gmail.com" className="text-[#F97316] font-semibold hover:underline">
              let me know
            </a>
            . Your feedback helps me grow.
          </p>
        </div>
      </div>
    </footer>
  );
}
