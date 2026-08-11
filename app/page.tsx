import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import BentoGrid from '@/components/BentoGrid';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Testimonials from '@/components/Testimonials';
import ActivityFeed from '@/components/activity/ActivityFeed';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none">
        <Hero />
        <Projects />
        <ActivityFeed />
        <BentoGrid />
        <Experience />
        <TechStack />
        <Testimonials />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
