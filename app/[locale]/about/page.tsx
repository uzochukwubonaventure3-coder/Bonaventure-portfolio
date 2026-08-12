import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import { FaBolt, FaGlobe, FaMagnifyingGlass } from 'react-icons/fa6';

const VALUES = [
  { icon: FaBolt, title: 'Fast Delivery', desc: 'I ship on time. Always. Deadlines are a commitment, not a suggestion.' },
  { icon: FaMagnifyingGlass, title: 'Detail Obsessed', desc: 'Every pixel, every query, every edge case — nothing escapes my attention.' },
  { icon: FaGlobe, title: 'Remote First', desc: 'Async-friendly, timezone-flexible, and built for global collaboration.' },
];

export default function AboutPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-20 max-w-2xl">
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
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {VALUES.map((v) => {
              const ValueIcon = v.icon;
              return (
              <div key={v.title} className="bento-card">
                <ValueIcon className="text-[#F97316] mb-4" size={26} aria-hidden="true" />
                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </div>
              );
            })}
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
