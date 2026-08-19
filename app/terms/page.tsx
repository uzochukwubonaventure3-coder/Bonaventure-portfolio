import { ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing this portfolio website or engaging my services, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using this website or my services.

These terms apply to all visitors, clients, and others who access or use the services offered through this website.`,
  },
  {
    title: '2. Services Offered',
    content: `Bonaventure Chidalu offers the following freelance and contract-based services:

• **Full-Stack Web Development** — Backend and frontend development using PHP, Laravel, React, Next.js, and related technologies.
• **SEO Optimization** — Technical SEO, on-page optimization, and performance auditing.
• **WordPress Development** — Custom themes, plugins, and site management.
• **Technical Team Leadership** — Mentorship, code review, and team coordination.
• **Consulting** — Architecture planning and technology advisory.

Service scope, deliverables, and pricing are defined per project in a separate written agreement or proposal.`,
  },
  {
    title: '3. Project Agreements',
    content: `All projects require a signed agreement or written confirmation via email before work begins. The agreement will cover:

• Project scope and deliverables
• Timeline and milestones
• Payment terms and schedule
• Revision policy
• Ownership and licensing of deliverables

Work will not commence without at least **50% upfront payment** unless otherwise agreed in writing.`,
  },
  {
    title: '4. Payment Terms',
    content: `**Payment Schedule**: Standard payment is 50% upfront and 50% upon project completion, unless otherwise agreed.

**Late Payments**: Invoices unpaid after 14 days of the due date may incur a 2% monthly late fee.

**Refunds**: Please review my Refund Policy for full details on refund eligibility.

**Currency**: Payments are accepted in USD, NGN, or other agreed currencies. Currency is confirmed in the project agreement.

**Methods**: Bank transfer, Flutterwave, Paystack, PayPal, or other methods agreed upon in the project contract.`,
  },
  {
    title: '5. Intellectual Property',
    content: `**Client Ownership**: Upon full payment, you receive full ownership of the final deliverables created specifically for your project (custom code, designs, content).

**Third-Party Assets**: Any open-source libraries, frameworks, or third-party tools used remain under their respective licenses.

**Portfolio Rights**: I retain the right to showcase completed work in my portfolio, case studies, and social media unless you request confidentiality in writing.

**Pre-existing Work**: Any tools, frameworks, or code I develop independently remain my intellectual property.`,
  },
  {
    title: '6. Revisions & Scope Changes',
    content: `Each project includes a defined number of revision rounds as specified in the project agreement (typically 2-3 rounds).

**Scope creep**: Requests for features or changes outside the original scope will be quoted separately and require written approval before work begins.

**Additional revisions** beyond the agreed number will be billed at my standard hourly rate.`,
  },
  {
    title: '7. Confidentiality',
    content: `I treat all client information as strictly confidential. I will not disclose your proprietary business information, code, or data to third parties without your written consent.

Clients are also expected to keep any proprietary tools, frameworks, or processes shared during the engagement confidential.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `My total liability for any claim arising from services rendered shall not exceed the total amount paid for the specific project in question.

I am not liable for:
• Losses caused by third-party services, hosting providers, or APIs outside my control.
• Data loss due to factors beyond reasonable precaution.
• Indirect, incidental, or consequential damages.
• Delays caused by client failure to provide materials, feedback, or approvals on time.`,
  },
  {
    title: '9. Termination',
    content: `Either party may terminate a project engagement with 7 days written notice.

**Client termination**: Payment is due for all work completed up to the termination date. Upfront deposits are non-refundable unless termination is due to my breach of agreement.

**My termination**: If a client engages in abusive behavior, fails to pay, or requests unethical work, I reserve the right to terminate immediately with a refund of any unused portion of prepaid work.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through good-faith negotiation first. If unresolved, disputes shall be submitted to arbitration in Abuja, Nigeria.`,
  },
  {
    title: '11. Changes to These Terms',
    content: `I reserve the right to update these Terms at any time. Updated terms will be posted on this page with a revised date. Continued use of my services after updates constitutes acceptance.`,
  },
  {
    title: '12. Contact',
    content: `For questions about these Terms:\n\n📧 bonaventurechidalu@gmail.com\n📍 FCT Abuja, Nigeria\n💬 WhatsApp: +234 906 477 9856`,
  },
];

export default function TermsPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Terms of Service</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FileText size={22} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-[#555] text-sm mt-0.5">Last updated: June 1, 2026</p>
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/15 rounded-2xl px-5 py-4 mb-10">
            <p className="text-sm text-[#888] leading-relaxed">
              Please read these terms carefully before engaging my services. They outline the rules, responsibilities, and expectations for both parties to ensure a smooth working relationship.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="border-b border-[#111] pb-8 last:border-0">
                <h2 className="text-lg font-bold text-white mb-4">{section.title}</h2>
                <div className="text-[#777] text-sm leading-relaxed space-y-3">
                  {section.content.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <p key={i}>
                        {parts.map((part, j) =>
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j} className="text-[#aaa] font-semibold">{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#111] border border-[#1E1E1E] rounded-2xl text-center">
            <p className="text-white font-semibold mb-2">Ready to work together?</p>
            <p className="text-[#555] text-sm mb-4">Let&apos;s build something great. Start a project or book a consultation today.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
                Start a Project
              </Link>
              <Link href="/contact/consult" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#F97316] text-[#F97316] text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
