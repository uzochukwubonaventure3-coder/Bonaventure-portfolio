import { ChevronRight, Server, Zap, Globe, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const hostingOptions = [
  {
    name: 'Vercel',
    badge: 'Best for Next.js',
    badgeColor: 'bg-black border border-white/20 text-white',
    icon: '▲',
    iconBg: 'bg-white text-black',
    desc: 'Zero-config deployments for React & Next.js. Free tier is generous, edge functions included, global CDN.',
    features: ['Automatic HTTPS', 'Preview deployments', 'Edge functions', 'Analytics built-in'],
    link: 'https://vercel.com',
    price: 'Free – $20/mo',
    recommended: true,
  },
  {
    name: 'Render',
    badge: 'Best for Laravel',
    badgeColor: 'bg-[#46E3B7]/10 border border-[#46E3B7]/20 text-[#46E3B7]',
    icon: '🔷',
    iconBg: 'bg-[#46E3B7]/10',
    desc: 'Full-stack hosting with native support for PHP, Node.js, PostgreSQL, and Redis. No server management.',
    features: ['Managed PostgreSQL', 'Auto-deploy from Git', 'Private networking', 'Cron jobs'],
    link: 'https://render.com',
    price: 'Free – $25/mo',
    recommended: false,
  },
  {
    name: 'DigitalOcean',
    badge: 'Best for VPS',
    badgeColor: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
    icon: '🌊',
    iconBg: 'bg-blue-500/10',
    desc: 'Full control with App Platform or Droplets. Great for Laravel + MySQL stacks with predictable pricing.',
    features: ['Managed databases', 'App Platform', 'Load balancers', 'Spaces (S3-like)'],
    link: 'https://digitalocean.com',
    price: '$6 – $50/mo',
    recommended: false,
  },
  {
    name: 'Supabase',
    badge: 'Best for Database',
    badgeColor: 'bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-[#3ECF8E]',
    icon: '⚡',
    iconBg: 'bg-[#3ECF8E]/10',
    desc: 'Open-source Firebase alternative. Postgres database, Auth, Storage, and Edge Functions — all in one.',
    features: ['PostgreSQL', 'Auth built-in', 'Real-time', 'S3 storage'],
    link: 'https://supabase.com',
    price: 'Free – $25/mo',
    recommended: false,
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose a hosting provider',
    desc: 'Select based on your tech stack. Next.js → Vercel. Laravel → Render or DigitalOcean. Static sites → Netlify or Cloudflare Pages.',
    icon: Server,
  },
  {
    number: '02',
    title: 'Connect your repository',
    desc: 'Most platforms support auto-deploy from GitHub. Push to main → site rebuilds automatically. No FTP, no SSH needed.',
    icon: Globe,
  },
  {
    number: '03',
    title: 'Configure environment variables',
    desc: 'Never hardcode secrets. Set your API keys, database URLs, and tokens in the platform\'s environment settings.',
    icon: Shield,
  },
  {
    number: '04',
    title: 'Point your domain',
    desc: 'Update your DNS A/CNAME records to point to your host. Most platforms provide a free SSL certificate via Let\'s Encrypt.',
    icon: Zap,
  },
];

const faqs = [
  {
    q: 'Can you help me set up hosting for my project?',
    a: 'Yes! Hosting configuration and deployment are included in all my full-stack projects. I handle everything from environment setup to domain configuration.',
  },
  {
    q: 'What hosting do you recommend for a Laravel + React app?',
    a: 'I typically recommend Render for backend (PHP/Laravel) and Vercel for the React frontend, with Supabase for the database. This stack is reliable, affordable, and scales well.',
  },
  {
    q: 'Do you offer ongoing server management?',
    a: 'Yes, I offer monthly maintenance packages that include security updates, backups, uptime monitoring, and performance optimization. Contact me for pricing.',
  },
  {
    q: 'How much does hosting typically cost for a small business site?',
    a: 'For most projects, hosting costs between $0–$30/month using modern platforms. Complex apps with high traffic may cost more. I\'ll give you a realistic estimate during our consultation.',
  },
];

export default function HostingGuidePage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Hosting Guide</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold mb-5">
              <Server size={12} /> Hosting & Deployment
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Where should you<br />
              <span className="text-[#F97316]">host your website?</span>
            </h1>
            <p className="text-[#666] text-lg max-w-2xl leading-relaxed">
              A plain guide to modern hosting options for developers and small businesses. I use these platforms daily for client projects — here&apos;s my honest breakdown.
            </p>
          </div>

          {/* How I Deploy Section */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-2">How I Deploy Projects</h2>
            <p className="text-[#555] text-sm mb-8">My standard deployment workflow in 4 steps</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#F97316]/20 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#F97316] font-mono text-xs font-bold">{step.number}</span>
                      <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                        <Icon size={14} className="text-[#F97316]" />
                      </div>
                      <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    </div>
                    <p className="text-[#666] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Hosting Options */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-2">My Recommended Platforms</h2>
            <p className="text-[#555] text-sm mb-8">Platforms I&apos;ve used in production for client projects</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hostingOptions.map((opt) => (
                <div key={opt.name}
                  className={`bg-[#0F0F0F] border rounded-2xl p-6 transition-all hover:shadow-lg relative ${
                    opt.recommended ? 'border-[#F97316]/30 shadow-[#F97316]/5 shadow-xl' : 'border-[#1A1A1A] hover:border-[#2A2A2A]'
                  }`}>
                  {opt.recommended && (
                    <div className="absolute -top-3 left-5">
                      <span className="px-3 py-1 rounded-full bg-[#F97316] text-black text-[10px] font-bold">⭐ MY TOP PICK</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${opt.iconBg}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{opt.name}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${opt.badgeColor}`}>{opt.badge}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#555] font-mono">{opt.price}</span>
                  </div>
                  <p className="text-[#666] text-xs leading-relaxed mb-4">{opt.desc}</p>
                  <div className="space-y-1.5 mb-4">
                    {opt.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[#888]">
                        <CheckCircle size={11} className="text-green-400 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <a href={opt.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#F97316] hover:gap-2.5 transition-all font-semibold">
                    Visit {opt.name} <ArrowRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5">
                  <p className="font-semibold text-white text-sm mb-2">{faq.q}</p>
                  <p className="text-[#666] text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#F97316]/10 to-transparent border border-[#F97316]/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Need help deploying your project?</h3>
            <p className="text-[#666] text-sm mb-6 max-w-md mx-auto">
              I handle all deployment, DNS, SSL, and server configuration as part of my development service. No extra charge.
            </p>
            <Link href="/contact/consult"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#EA6C0A] transition-all">
              Book a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
