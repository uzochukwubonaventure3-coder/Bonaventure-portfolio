'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';

export default function AboutPage() {
  const [profilePic, setProfilePic] = useState<string>('/profile.jpg');

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => {
        if (d.data?.profile_picture) setProfilePic(d.data.profile_picture);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Hero - two column with profile pic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left - text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-4">About Me</p>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                I build things that<br />
                <span className="text-[#F97316]">actually work.</span>
              </h1>
              <p className="text-[#777] text-lg leading-relaxed mb-4">
                Hi, I&apos;m Bonaventure — a full-stack software engineer based in FCT Abuja, Nigeria. I specialize in
                backend architecture, scalable web systems, and SEO-optimized frontends. I&apos;ve been building
                for the web for nearly 5 years.
              </p>
              <p className="text-[#666] text-lg leading-relaxed">
                I&apos;m deeply passionate about clean code, performance, and shipping products that real people love.
                Whether it&apos;s a startup&apos;s MVP or an enterprise platform handling thousands of users — I bring the
                same level of craft and attention to detail.
              </p>
            </motion.div>

            {/* Right - profile picture with blob */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-[340px] h-[380px]">
                {/* Glow */}
                <div className="absolute inset-0 bg-[#F97316]/10 blur-3xl rounded-full" />
                {/* Blob shape using clip-path */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    background: '#1A1A1A',
                    border: '2px solid rgba(249,115,22,0.2)',
                  }}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Bonaventure Chidalu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback illustration - chimp coding (same style as reference) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]"
                    style={{ display: profilePic && profilePic !== '/profile.jpg' ? 'none' : 'flex' }}>
                    <div className="text-8xl">🐒</div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-[#F97316] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-[#F97316]/20"
                >
                  Available for hire ✓
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'I ship on time. Always. Deadlines are a commitment, not a suggestion.' },
              { icon: '🔍', title: 'Detail Obsessed', desc: 'Every pixel, every query, every edge case — nothing escapes my attention.' },
              { icon: '🌍', title: 'Remote First', desc: 'Async-friendly, timezone-flexible, and built for global collaboration.' },
            ].map((v) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}
                className="bento-card">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <Experience />
          <TechStack />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
