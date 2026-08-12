import Link from 'next/link';
import { FaArrowRight, FaCheck, FaClock, FaShieldHalved } from 'react-icons/fa6';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

interface ResourcePageProps {
  eyebrow: string;
  title: string;
  emphasis: string;
  intro: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  note?: string;
}

export default function ResourcePage({ eyebrow, title, emphasis, intro, points, ctaLabel, ctaHref, note }: ResourcePageProps) {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#F97316] text-xs font-semibold uppercase tracking-[0.22em] mb-5">{eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              {title} <span className="text-[#F97316]">{emphasis}</span>
            </h1>
            <p className="text-[#888] text-lg leading-relaxed">{intro}</p>
          </div>

          <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-5 mt-14">
            <section className="rounded-2xl border border-[#222] bg-[#111] p-7 md:p-9">
              <p className="text-xs uppercase tracking-widest text-[#555] mb-6">What to expect</p>
              <ul className="space-y-5">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-[#B0B0B0] leading-relaxed">
                    <FaCheck className="mt-1 shrink-0 text-[#F97316]" size={13} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
            <aside className="rounded-2xl border border-[#F97316]/20 bg-[#F97316]/[0.06] p-7 flex flex-col justify-between">
              <div>
                <FaShieldHalved className="text-[#F97316] mb-5" size={22} aria-hidden="true" />
                <p className="text-white font-semibold mb-2">Senior-level ownership</p>
                <p className="text-sm leading-relaxed text-[#777]">Clear communication, thoughtful implementation, and reliable delivery from discovery through launch.</p>
              </div>
              <Link href={ctaHref} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EA6C0A]">
                {ctaLabel} <FaArrowRight size={13} />
              </Link>
            </aside>
          </div>
          {note && <p className="mt-8 flex items-center gap-2 text-sm text-[#555]"><FaClock size={13} /> {note}</p>}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
