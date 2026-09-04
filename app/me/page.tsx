'use client';

import { useEffect, useState } from 'react';
import { MapPin, Code2, BookOpen, Music, Coffee, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function MePage() {
  const [content, setContent] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setContent(d.data ?? {})).catch(() => {});
  }, []);
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const items = [
    { icon: MapPin, color: '#F97316', label: 'Location', value: content.me_location || 'FCT Abuja, Nigeria', sub: 'Open to remote work globally' },
    { icon: Code2, color: '#3B82F6', label: 'Currently Building', value: content.me_building || 'Client projects + this portfolio', sub: content.me_building_sub || 'Next.js, Laravel, Supabase stack' },
    { icon: BookOpen, color: '#22C55E', label: 'Currently Reading', value: content.me_reading || 'The Pragmatic Programmer', sub: content.me_reading_sub || 'By Andrew Hunt & David Thomas' },
    { icon: Music, color: '#A855F7', label: 'Currently Listening', value: content.me_listening || 'Lo-fi beats & Afrobeats', sub: 'Fuel for deep work sessions' },
    { icon: Coffee, color: '#EAB308', label: 'Fuel', value: 'Too much coffee', sub: 'And sometimes green tea' },
  ];

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-28 md:pb-20">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">/me</span>
          </div>
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white mb-2">/me</h1>
            <p className="text-[#555] text-sm">What I&apos;m up to right now. Updated regularly.</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#444]">
              <Clock size={12} /><span>{now}</span>
            </div>
          </div>
          <div className="space-y-3">
            {items.map(({ icon: Icon, color, label, value, sub }) => (
              <div key={label} className="flex items-center gap-4 bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl px-5 py-4 hover:border-[#222] transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#444] mb-0.5 font-semibold">{label}</p>
                  <p className="font-bold text-white text-sm">{value}</p>
                  <p className="text-[#555] text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-[#F97316]/5 border border-[#F97316]/15 rounded-2xl p-5 text-center">
            <p className="text-white font-bold mb-2">Want to chat?</p>
            <p className="text-[#555] text-sm mb-4">Always happy to connect with fellow developers and potential clients.</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-bold hover:bg-[#EA6C0A] transition-all">
              Get in Touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
