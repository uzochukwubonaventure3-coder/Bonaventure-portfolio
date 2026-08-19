import { ChevronRight, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const eligible = [
  'Project cancelled by me before work begins — full refund.',
  'Failure to deliver agreed scope within the timeline, with no valid reason — proportional refund.',
  'Duplicate payment made in error — full refund.',
  'Client cancellation within 48 hours of initial payment, before any work has started — full refund.',
];

const notEligible = [
  'Work has already been completed or significantly progressed.',
  'Client changes scope or direction after approval of designs/functionality.',
  'Dissatisfaction based on subjective preference (not a breach of agreed scope).',
  'Client fails to provide required assets, access, or feedback causing delays.',
  'Third-party tool costs (hosting, APIs, licenses) that have already been incurred.',
  'Rush delivery fees once the accelerated work has been completed.',
];

const process = [
  { step: '01', title: 'Submit Request', desc: 'Email bonaventurechidalu@gmail.com with your project details, invoice number, and reason for the refund request.' },
  { step: '02', title: 'Review Period', desc: 'I will review your request within 3–5 business days and may ask clarifying questions about the project.' },
  { step: '03', title: 'Decision', desc: 'A written decision will be sent to your email. If approved, the refund amount and method will be confirmed.' },
  { step: '04', title: 'Processing', desc: 'Approved refunds are processed within 5–10 business days via the original payment method. Bank transfer times may vary.' },
];

export default function RefundPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Refund Policy</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <RefreshCw size={22} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
              <p className="text-[#555] text-sm mt-0.5">Last updated: June 1, 2026</p>
            </div>
          </div>

          <div className="bg-green-500/5 border border-green-500/15 rounded-2xl px-5 py-4 mb-10">
            <p className="text-sm text-[#888] leading-relaxed">
              I stand behind the quality of my work. This policy is designed to be fair to both parties — protecting clients from poor service while reflecting the value of time and effort invested.
            </p>
          </div>

          {/* General Policy */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">General Policy</h2>
            <div className="text-[#777] text-sm leading-relaxed space-y-3">
              <p>All projects require a <strong className="text-[#aaa]">50% upfront deposit</strong> before work begins, with the remaining balance due upon completion. The deposit covers initial project planning, research, and setup time.</p>
              <p>Refunds are evaluated on a case-by-case basis. I aim to resolve all disputes fairly and professionally. Communication is always the first step — most issues can be resolved through a conversation.</p>
            </div>
          </section>

          {/* Eligible */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle size={18} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">When You Are Eligible for a Refund</h2>
            </div>
            <div className="space-y-3">
              {eligible.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
                  <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#888]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Not Eligible */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <XCircle size={18} className="text-red-400" />
              <h2 className="text-xl font-bold text-white">When You Are NOT Eligible for a Refund</h2>
            </div>
            <div className="space-y-3">
              {notEligible.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#888]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Partial Refunds */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle size={18} className="text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Partial Refunds</h2>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-2xl p-5">
              <p className="text-sm text-[#888] leading-relaxed">
                If a project is cancelled mid-way, a partial refund may be issued based on the percentage of work not yet completed. The refund will be calculated as:
              </p>
              <div className="mt-4 bg-[#111] rounded-xl p-4 font-mono text-sm text-[#F97316]">
                Refund = Total Paid × (1 − % of Work Completed)
              </div>
              <p className="text-xs text-[#555] mt-3">Work completion is documented via deliverables, commits, or written milestone confirmations.</p>
            </div>
          </section>

          {/* Process */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6">How to Request a Refund</h2>
            <div className="space-y-4">
              {process.map((step) => (
                <div key={step.step} className="flex gap-4 bg-[#0F0F0F] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#F97316]/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#F97316] text-sm font-bold font-mono">{step.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{step.title}</p>
                    <p className="text-[#666] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 p-6 bg-[#111] border border-[#1E1E1E] rounded-2xl text-center">
            <p className="text-white font-semibold mb-2">Have a refund question?</p>
            <p className="text-[#555] text-sm mb-4">I respond to all refund inquiries within 3 business days.</p>
            <a href="mailto:bonaventurechidalu@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
              Email Me
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
