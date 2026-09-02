'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle, Target, Globe, Code2, BookOpen, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const bucketList = [
  { category: 'Travel', icon: Globe, color: '#3B82F6', items: [
    { text: 'Visit Japan during cherry blossom season', done: false },
    { text: 'Road trip through Europe', done: false },
    { text: 'See the Northern Lights in Iceland', done: false },
    { text: 'Visit Dubai', done: true },
    { text: 'Explore Cape Town, South Africa', done: false },
  ]},
  { category: 'Tech & Career', icon: Code2, color: '#F97316', items: [
    { text: 'Speak at a tech conference', done: false },
    { text: 'Build and launch a SaaS product', done: false },
    { text: 'Get to 10,000 GitHub stars', done: false },
    { text: 'Mentor 100 developers', done: false },
    { text: 'Land a remote role at a top global company', done: false },
  ]},
  { category: 'Learning', icon: BookOpen, color: '#22C55E', items: [
    { text: 'Learn to speak French fluently', done: false },
    { text: 'Read 52 books in a year', done: false },
    { text: 'Complete AWS Solutions Architect certification', done: false },
    { text: 'Master Rust programming language', done: false },
  ]},
  { category: 'Personal', icon: Trophy, color: '#A855F7', items: [
    { text: 'Run a half marathon', done: false },
    { text: 'Build my dream home office', done: false },
    { text: 'Start a tech YouTube channel', done: false },
    { text: 'Achieve financial independence', done: false },
    { text: 'Learn to play the guitar', done: false },
  ]},
];

export default function BucketListPage() {
  const total = bucketList.flatMap(c => c.items).length;
  const done  = bucketList.flatMap(c => c.items).filter(i => i.done).length;
  const pct   = Math.round((done / total) * 100);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-28 md:pb-20">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Bucket List</span>
          </div>

          <div className="mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-5">
              <Target size={24} className="text-[#F97316]" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Bucket List</h1>
            <p className="text-[#555] text-sm mb-6">Things to do at least once in my life. Updated as I go.</p>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#555] font-medium">Progress</span>
                  <span className="text-xs text-[#F97316] font-bold">{done}/{total} completed</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-[#F97316] rounded-full" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#F97316] font-mono">{pct}%</div>
            </div>
          </div>

          <div className="space-y-8">
            {bucketList.map((cat, ci) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.category}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
                      <Icon size={14} style={{ color: cat.color }} />
                    </div>
                    <h2 className="font-bold text-white text-base">{cat.category}</h2>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        item.done ? 'bg-green-500/5 border-green-500/10 opacity-60' : 'bg-[#0F0F0F] border-[#1A1A1A] hover:border-[#222]'
                      }`}>
                        {item.done
                          ? <CheckCircle size={16} className="text-green-400 shrink-0" />
                          : <Circle size={16} className="text-[#333] shrink-0" />}
                        <span className={`text-sm font-medium ${item.done ? 'line-through text-[#444]' : 'text-[#ccc]'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
