import { ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const sections = [
  {
    title: '1. Information I Collect',
    content: `When you use this portfolio website or contact me, I may collect the following information:

• **Contact details**: Your name, email address, and WhatsApp number when you fill out a contact or consultation form.
• **Project details**: Information about your project, budget, and goals that you voluntarily provide.
• **Testimonials**: Your name, role, company, and written feedback if you submit a testimonial.
• **Usage data**: Standard browser information such as your IP address, browser type, and pages visited — collected automatically through analytics.
• **Bug reports**: Technical descriptions and contact info when you report issues.`,
  },
  {
    title: '2. How I Use Your Information',
    content: `Your information is used solely for legitimate business purposes:

• To respond to your inquiries and project requests.
• To schedule consultations and communicate project timelines.
• To display approved testimonials on this portfolio.
• To improve the website based on bug reports.
• To send project-related updates (never unsolicited marketing).

I do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '3. Data Storage & Security',
    content: `Your data is stored securely using industry-standard services:

• Form submissions are stored in a secured PostgreSQL database (Supabase).
• All data is transmitted over HTTPS/TLS encryption.
• Access to stored data is restricted to authorized personnel only.
• I use Cloudinary for media storage, which complies with GDPR standards.

While I take all reasonable precautions, no online transmission is 100% secure. I cannot guarantee absolute security.`,
  },
  {
    title: '4. Testimonials',
    content: `If you submit a testimonial through the /testify page:

• Your testimonial is reviewed before being published.
• Only your name, role/company, and testimonial text are displayed publicly.
• Your email address is never displayed.
• You may request removal of your testimonial at any time by emailing me.`,
  },
  {
    title: '5. Cookies & Analytics',
    content: `This website may use minimal cookies and analytics tools (such as Vercel Analytics or Google Analytics) to understand how visitors use the site. These tools collect anonymized usage data.

You can disable cookies in your browser settings. Doing so will not affect the core functionality of this portfolio.`,
  },
  {
    title: '6. Third-Party Links',
    content: `This website contains links to external services (GitHub, LinkedIn, Twitter/X, WhatsApp). I am not responsible for the privacy practices of these third-party platforms. Please review their respective privacy policies.`,
  },
  {
    title: '7. Your Rights',
    content: `Depending on your location, you may have the following rights:

• **Access**: Request a copy of personal data I hold about you.
• **Correction**: Request that inaccurate data be corrected.
• **Deletion**: Request deletion of your data ("right to be forgotten").
• **Objection**: Object to certain processing of your data.

To exercise any of these rights, contact me at: bonaventurechidalu@gmail.com`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `This website is not directed at children under the age of 13. I do not knowingly collect personal information from children. If you believe a child has submitted personal information, please contact me and I will promptly delete it.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `I reserve the right to update this Privacy Policy at any time. Changes will be reflected by updating the "Last Updated" date at the top of this page. Continued use of the website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact',
    content: `For any privacy-related questions or requests, please reach out:\n\n📧 bonaventurechidalu@gmail.com\n📍 FCT Abuja, Nigeria`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Privacy Policy</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield size={22} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-[#555] text-sm mt-0.5">Last updated: June 1, 2026</p>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl px-5 py-4 mb-10">
            <p className="text-sm text-[#888] leading-relaxed">
              Your privacy is important to me. This policy explains what data I collect, how I use it, and your rights regarding your information. I am committed to being fully transparent.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="border-b border-[#111] pb-8 last:border-0">
                <h2 className="text-lg font-bold text-white mb-4">{section.title}</h2>
                <div className="text-[#777] text-sm leading-relaxed space-y-3">
                  {section.content.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    // Bold markdown
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

          {/* Footer CTA */}
          <div className="mt-12 p-6 bg-[#111] border border-[#1E1E1E] rounded-2xl text-center">
            <p className="text-white font-semibold mb-2">Have a privacy concern?</p>
            <p className="text-[#555] text-sm mb-4">I take your privacy seriously. Reach out and I&apos;ll respond within 24 hours.</p>
            <a href="mailto:bonaventurechidalu@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA6C0A] transition-all">
              Contact Me
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
