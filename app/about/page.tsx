'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Search, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';

const values = [
  { icon: Zap,    color: '#F97316', title: 'Fast Delivery',     desc: 'I ship on time. Always. Deadlines are a commitment, not a suggestion.' },
  { icon: Search, color: '#3B82F6', title: 'Detail Obsessed',   desc: 'Every pixel, every query, every edge case — nothing escapes my attention.' },
  { icon: Globe,  color: '#22C55E', title: 'Remote First',      desc: 'Async-friendly, timezone-flexible, and built for global collaboration.' },
];

export default function AboutPage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.data?.profile_picture) setProfilePic(d.data.profile_picture); })
      .catch(() => {});
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none pt-24 pb-24 md:pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-4">About Me</p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                I build things that<br />
                <span className="text-[#F97316]">actually work.</span>
              </h1>
              <p className="text-[#777] text-lg leading-relaxed mb-4">
                 Hi, I&apos;m{" "}
                <span className="font-bold text-white">Bonaventure</span>
                {" "}— a full-stack software engineer based in FCT Abuja, Nigeria.
                I specialize in backend architecture, scalable web systems, and SEO-optimized frontends.
                I&apos;ve been building for the web for nearly 1.8 years.
              </p>
              <p className="text-[#666] text-base leading-relaxed">
                I&apos;m deeply passionate about clean code, performance, and shipping products that real
                people love. Whether it&apos;s a startup&apos;s MVP or an enterprise platform handling thousands
                of users — I bring the same level of craft and attention to detail.
              </p>
              <div className="flex items-center gap-1.5 mt-6 text-[#666] text-sm">
                <MapPin size={14} className="text-[#F97316]" />
                <span>FCT Abuja, Nigeria · Available remotely worldwide</span>
              </div>
            </motion.div>

            {/* Profile picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-[300px] h-[340px]">
                <div className="absolute inset-0 bg-[#F97316]/8 blur-3xl rounded-full" />
                <div
                  className="relative w-full h-full overflow-hidden border-2 border-[#F97316]/20"
                  style={{ clipPath: 'polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)' }}
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Bonaventure Chidalu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                        <span className="text-3xl font-extrabold text-[#F97316]">BC</span>
                      </div>
                      <p className="text-[#444] text-xs">Upload photo in admin settings</p>
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-[#F97316] text-black text-xs font-extrabold px-4 py-2 rounded-full shadow-lg shadow-[#F97316]/20"
                >
                  Available for hire
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {values.map(({ icon: Icon, color, title, desc }) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}
                className="bento-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="font-extrabold text-white text-lg mb-2">{title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <Experience />
          <div className="mt-12">
            <TechStack />
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
