import { ChevronRight, Monitor, Code2, Cpu, Wifi } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const gear = [
  {
    category: 'Development Tools',
    icon: Code2,
    color: '#60A5FA',
    items: [
      { name: 'VS Code', desc: 'Primary code editor with custom Dracula theme', icon: '💙' },
      { name: 'Kiro', desc: 'AI-powered coding assistant', icon: '🤖' },
      { name: 'iTerm2 / Windows Terminal', desc: 'Terminal of choice', icon: '⬛' },
      { name: 'TablePlus', desc: 'Database GUI for MySQL & PostgreSQL', icon: '🗄️' },
      { name: 'Postman', desc: 'API testing and documentation', icon: '🔶' },
      { name: 'GitHub Desktop', desc: 'Visual git client for quick commits', icon: '🐙' },
    ],
  },
  {
    category: 'Design & Productivity',
    icon: Monitor,
    color: '#F472B6',
    items: [
      { name: 'Figma', desc: 'UI/UX design and prototyping', icon: '🎨' },
      { name: 'Notion', desc: 'Notes, docs, and project planning', icon: '📝' },
      { name: 'Linear', desc: 'Issue tracking and sprint planning', icon: '🔷' },
      { name: 'Loom', desc: 'Quick video walkthroughs for clients', icon: '🎥' },
      { name: 'Slack', desc: 'Team communication', icon: '💬' },
    ],
  },
  {
    category: 'Infrastructure & Cloud',
    icon: Wifi,
    color: '#34D399',
    items: [
      { name: 'Vercel', desc: 'Deploying all Next.js projects', icon: '▲' },
      { name: 'Supabase', desc: 'PostgreSQL database + auth + storage', icon: '⚡' },
      { name: 'Cloudinary', desc: 'Image and media CDN', icon: '☁️' },
      { name: 'Render', desc: 'Laravel and Node.js backends', icon: '🔷' },
      { name: 'AWS S3', desc: 'File storage for larger projects', icon: '🟠' },
    ],
  },
  {
    category: 'Hardware',
    icon: Cpu,
    color: '#C084FC',
    items: [
      { name: 'Laptop', desc: 'Main development machine', icon: '💻' },
      { name: 'External Monitor', desc: '24" FHD monitor for extra screen real estate', icon: '🖥️' },
      { name: 'Mechanical Keyboard', desc: 'Tactile switches for those long coding sessions', icon: '⌨️' },
      { name: 'Noise-cancelling Headphones', desc: 'Deep work mode: activated', icon: '🎧' },
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Uses</span>
          </div>

          <div className="mb-12">
            <div className="text-4xl mb-4">⚙️</div>
            <h1 className="text-3xl font-bold text-white mb-2">Uses</h1>
            <p className="text-[#555] max-w-lg">
              A peek into my development setup, tools, and gear. Everything I use daily to build and ship.
            </p>
          </div>

          <div className="space-y-12">
            {gear.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.category}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}>
                      <Icon size={14} style={{ color: section.color }} />
                    </div>
                    <h2 className="font-bold text-white">{section.category}</h2>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-4 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl px-4 py-3 hover:border-[#222] transition-colors group">
                        <span className="text-2xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">{item.name}</p>
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
