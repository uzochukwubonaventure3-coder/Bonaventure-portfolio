import { ChevronRight, ExternalLink, Github, Linkedin, Twitter, Globe, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const links = [
  {
    category: 'Social',
    items: [
      { label: 'GitHub', desc: 'My open source work & projects', href: 'https://github.com/bonaventurechidalu', icon: Github, color: '#ffffff' },
      { label: 'LinkedIn', desc: 'Professional network & updates', href: 'https://linkedin.com/in/bonaventure-chidalu-b58221350', icon: Linkedin, color: '#0A66C2' },
      { label: 'Twitter / X', desc: 'Dev thoughts & building in public', href: 'https://twitter.com/bonaventurechidalu', icon: Twitter, color: '#1D9BF0' },
    ],
  },
  {
    category: 'Work With Me',
    items: [
      { label: 'Start a Project', desc: 'Tell me about your idea', href: '/contact', icon: Globe, color: '#F97316' },
      { label: 'Book a Consultation', desc: 'Schedule a quick call', href: '/contact/consult', icon: MessageCircle, color: '#22C55E' },
      { label: 'Email Me', desc: 'bonaventurechidalu@gmail.com', href: 'mailto:bonaventurechidalu@gmail.com', icon: Mail, color: '#A855F7' },
    ],
  },
  {
    category: 'Resources',
    items: [
      { label: 'Hosting Guide', desc: 'My recommended hosting platforms', href: '/hosting-guide', icon: Globe, color: '#60A5FA' },
      { label: 'Share a Testimonial', desc: 'Worked with me? Leave a review', href: '/testify', icon: Globe, color: '#FBBF24' },
      { label: 'Refer & Earn 10%', desc: 'Earn commission by referring clients', href: '/refer-earn', icon: Globe, color: '#34D399' },
    ],
  },
];

export default function LinksPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Links</span>
          </div>

          {/* Profile card */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-[#F97316]/10 border-2 border-[#F97316]/30 flex items-center justify-center mx-auto mb-4 text-3xl">
              👨‍💻
            </div>
            <h1 className="text-xl font-bold text-white">Bonaventure Chidalu</h1>
            <p className="text-[#555] text-sm mt-1">Fullstack Developer · FCT Abuja, Nigeria</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-green-400 text-xs">Available for work</span>
            </div>
          </div>

          <div className="space-y-8">
            {links.map(({ category, items }) => (
              <div key={category}>
                <p className="text-[10px] uppercase tracking-widest text-[#444] mb-3">{category}</p>
                <div className="space-y-2">
                  {items.map((link) => {
                    const Icon = link.icon;
                    const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto');
                    const Wrapper = isExternal ? 'a' : Link;
                    const props = isExternal
                      ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                      : { href: link.href };

                    return (
                      <Wrapper key={link.label} {...(props as any)}
                        className="flex items-center gap-4 bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl px-4 py-4 hover:border-[#F97316]/20 hover:bg-[#111] transition-all group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${link.color}12`, border: `1px solid ${link.color}25` }}>
                          <Icon size={18} style={{ color: link.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">{link.label}</p>
                          <p className="text-[#555] text-xs">{link.desc}</p>
                        </div>
                        <ExternalLink size={14} className="text-[#333] group-hover:text-[#F97316] transition-colors shrink-0" />
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
