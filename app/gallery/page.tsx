import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function GalleryPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#555] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Gallery</span>
          </div>

          <div className="mb-10">
            <div className="text-4xl mb-4">🖼️</div>
            <h1 className="text-3xl font-bold text-white mb-2">Gallery</h1>
            <p className="text-[#555]">Workspace, setup, events, and glimpses of life behind the screen.</p>
          </div>

          {/* Empty state */}
          <div className="text-center py-24 bg-[#0F0F0F] border border-[#1A1A1A] border-dashed rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={24} className="text-[#333]" />
            </div>
            <p className="text-white font-semibold mb-2">Gallery coming soon</p>
            <p className="text-[#444] text-sm max-w-sm mx-auto">
              I&apos;m putting together workspace photos, event snapshots, and behind-the-scenes content. Check back soon!
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
