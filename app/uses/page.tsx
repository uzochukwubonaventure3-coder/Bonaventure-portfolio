import { Code2, Monitor, Cloud, Cpu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const gear = [
  { category: 'Development Tools', icon: Code2, color: '#60A5FA', items: [
    { name: 'VS Code',           icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', desc: 'Primary editor with Dracula theme' },
    { name: 'Kiro',              icon: 'https://cdn.simpleicons.org/amazonaws/FF9900', desc: 'AI-powered coding assistant' },
    { name: 'TablePlus',         icon: 'https://cdn.simpleicons.org/mysql/4479A1', desc: 'Database GUI for MySQL & PostgreSQL' },
    { name: 'Postman',           icon: 'https://cdn.simpleicons.org/postman/FF6C37', desc: 'API testing and documentation' },
    { name: 'GitHub Desktop',    icon: 'https://cdn.simpleicons.org/github/ffffff', desc: 'Visual git client' },
  ]},
  { category: 'Design & Productivity', icon: Monitor, color: '#F472B6', items: [
    { name: 'Figma',             icon: 'https://cdn.simpleicons.org/figma/F24E1E', desc: 'UI/UX design and prototyping' },
    { name: 'Notion',            icon: 'https://cdn.simpleicons.org/notion/ffffff', desc: 'Notes, docs, project planning' },
    { name: 'Linear',            icon: 'https://cdn.simpleicons.org/linear/5E6AD2', desc: 'Issue tracking and sprint planning' },
    { name: 'Slack',             icon: 'https://cdn.simpleicons.org/slack/4A154B', desc: 'Team communication' },
  ]},
  { category: 'Infrastructure & Cloud', icon: Cloud, color: '#34D399', items: [
    { name: 'Vercel',            icon: 'https://cdn.simpleicons.org/vercel/ffffff', desc: 'Deploying all Next.js projects' },
    { name: 'Supabase',          icon: 'https://cdn.simpleicons.org/supabase/3ECF8E', desc: 'PostgreSQL database + auth + storage' },
    { name: 'Cloudinary',        icon: 'https://cdn.simpleicons.org/cloudinary/3448C5', desc: 'Image and media CDN' },
    { name: 'Render',            icon: 'https://cdn.simpleicons.org/render/46E3B7', desc: 'Laravel and Node.js backends' },
    { name: 'AWS S3',            icon: 'https://cdn.simpleicons.org/amazons3/569A31', desc: 'File storage for larger projects' },
  ]},
  { category: 'Hardware', icon: Cpu, color: '#C084FC', items: [
    { name: 'Laptop',            icon: 'https://cdn.simpleicons.org/apple/ffffff', desc: 'Main development machine' },
    { name: 'External Monitor',  icon: 'https://cdn.simpleicons.org/dell/007DB8', desc: '24" FHD for extra screen real estate' },
    { name: 'Mech Keyboard',     icon: 'https://cdn.simpleicons.org/logitech/00B8FC', desc: 'Tactile switches for long sessions' },
    { name: 'Headphones',        icon: 'https://cdn.simpleicons.org/sony/000000', desc: 'Noise-cancelling, deep work mode' },
  ]},
];

export default function UsesPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="md:cursor-none min-h-screen pt-20 pb-28 md:pb-20">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Uses</span>
          </div>
          <div className="mb-12">
            <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-5">
              <Cpu size={24} className="text-[#F97316]" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Uses</h1>
            <p className="text-[#555]">A peek into my development setup, tools, and gear.</p>
          </div>
          <div className="space-y-12">
            {gear.map(section => {
              const Icon = section.icon;
              return (
                <div key={section.category}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}>
                      <Icon size={15} style={{ color: section.color }} />
                    </div>
                    <h2 className="font-bold text-white">{section.category}</h2>
                  </div>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <div key={item.name}
                        className="flex items-center gap-4 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl px-4 py-3 hover:border-[#222] transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center shrink-0">
                          <img src={item.icon} alt={item.name} width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <p className="text-[#555] text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
