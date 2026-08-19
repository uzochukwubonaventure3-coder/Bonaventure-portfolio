'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const bucketList = [
  { category: '🌍 Travel', items: [
    { text: 'Visit Japan during cherry blossom season', done: false },
    { text: 'Road trip through Europe', done: false },
    { text: 'See the Northern Lights in Iceland', done: false },
    { text: 'Visit Dubai', done: true },
    { text: 'Explore Cape Town, South Africa', done: false },
  ]},
  { category: '💻 Tech & Career', items: [
    { text: 'Speak at a tech conference', done: false },
    { text: 'Build and launch a SaaS product', done: false },
    { text: 'Get to 10,000 GitHub stars', done: false },
    { text: 'Mentor 100 developers', done: false },
    { text: 'Land a remote role at a top global company', done: false },
  ]},
  { category: '📚 Learning', items: [
    { text: 'Learn to speak French fluently', done: false },
    { text: 'Read 52 books in a year', done: false },
    { text: 'Complete AWS Solutions Architect certification', done: false },
    { text: 'Master Rust programming language', done: false },
  ]},
  { category: '🎯 Personal', items: [
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
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Bucket List</span>
          </div>

          <div className="mb-10">
            <div className="text-5xl mb-4">🪣</div>
            <h1 className="text-3xl font-bold text-white mb-2">Bucket List</h1>
            <p className="text-[#555] text-sm mb-6">Things to do at least once in my life. Updated as I go.</p>

            {/* Progress */}
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#555]">Progress</span>
                  <span className="text-xs text-[#F97316] font-bold">{done}/{total} completed</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-[#F97316] rounded-full" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#F97316] font-mono">{pct}%</div>
            </div>
          </div>

          <div className="space-y-8">
            {bucketList.map((cat, ci) => (
              <motion.div key={cat.category}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 }}>
                <h2 className="font-bold text-white text-base mb-4">{cat.category}</h2>
                <div className="space-y-2">
                  {cat.items.map((item, ii) => (
                    <div key={ii}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        item.done
                          ? 'bg-green-500/5 border-green-500/10 opacity-60'
                          : 'bg-[#0F0F0F] border-[#1A1A1A] hover:border-[#222]'
                      }`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        item.done ? 'bg-green-500 border-green-500' : 'border-[#333]'
                      }`}>
                        {item.done && <Check size={11} className="text-white" />}
                      </div>
                      <span className={`text-sm ${item.done ? 'line-through text-[#444]' : 'text-[#ccc]'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
