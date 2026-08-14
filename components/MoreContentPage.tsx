'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaArrowUpRightFromSquare, FaImage, FaLink, FaListCheck, FaToolbox } from 'react-icons/fa6';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

type Content = { title: string; description?: string; url?: string; imageUrl?: string };
const config = {
  links: { key: 'more_links', eyebrow: 'Portfolio links', title: 'Everything, in one', emphasis: 'place.', icon: FaLink, empty: 'Useful destinations are being curated.' },
  uses: { key: 'more_uses', eyebrow: 'My toolkit', title: 'Tools I trust to', emphasis: 'ship.', icon: FaToolbox, empty: 'My current tools will appear here soon.' },
  gallery: { key: 'more_gallery', eyebrow: 'Gallery', title: 'Moments from', emphasis: 'the work.', icon: FaImage, empty: 'Gallery images will appear here soon.' },
  'bucket-list': { key: 'more_bucket_list', eyebrow: 'Bucket list', title: 'Things worth', emphasis: 'building toward.', icon: FaListCheck, empty: 'The next milestones are being prepared.' },
} as const;

export default function MoreContentPage({ type }: { type: keyof typeof config }) {
  const [items, setItems] = useState<Content[]>([]); const [loading, setLoading] = useState(true); const page = config[type]; const Icon = page.icon;
  useEffect(() => { fetch('/api/more').then(r => r.json()).then(r => setItems(r.data?.[page.key] ?? [])).finally(() => setLoading(false)); }, [page.key]);
  return <><CustomCursor /><Navbar /><main className="cursor-none min-h-screen pt-32 pb-20"><div className="max-w-6xl mx-auto px-6 lg:px-8"><p className="text-[#F97316] text-xs font-semibold uppercase tracking-[.22em] mb-5">{page.eyebrow}</p><h1 className="max-w-3xl text-4xl md:text-6xl font-bold leading-tight text-white">{page.title} <span className="text-[#F97316]">{page.emphasis}</span></h1><p className="mt-6 max-w-2xl text-[#888] leading-relaxed">A living part of the portfolio, managed from the dashboard and updated as work, tools, and goals evolve.</p>{loading ? <div className="mt-16 h-40 animate-pulse rounded-2xl bg-[#111]" /> : items.length ? <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-[#222] bg-[#111]">{item.imageUrl && <Image src={item.imageUrl} alt={item.title} width={400} height={192} className="h-48 w-full object-cover" />}<div className="p-6"><Icon className="mb-4 text-[#F97316]" size={18}/><h2 className="font-semibold text-white">{item.title}</h2>{item.description && <p className="mt-2 text-sm leading-relaxed text-[#777]">{item.description}</p>}{item.url && <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#F97316]">Visit <FaArrowUpRightFromSquare size={11}/></a>}</div></article>)}</div> : <div className="mt-14 rounded-2xl border border-[#222] bg-[#111] p-10 text-center"><Icon className="mx-auto mb-4 text-[#F97316]" size={28}/><p className="text-[#777]">{page.empty}</p><Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm text-[#F97316]">Start a conversation <FaArrowRight size={12}/></Link></div>}</div></main><Footer /><BackToTop /></>;
}
