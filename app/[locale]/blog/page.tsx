import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';

const POSTS = [
  {
    id: 1,
    title: 'How I Built a Real-Time Tracking System with Laravel & WebSockets',
    excerpt: 'A deep dive into the architecture behind iTrust Rapid Logistics — how I handled real-time GPS updates, driver assignments, and role-based dashboards.',
    date: 'May 10, 2026',
    readTime: '8 min read',
    category: 'Backend',
    color: '#F97316',
  },
  {
    id: 2,
    title: 'SEO in 2026: What Actually Moves the Needle for Nigerian Businesses',
    excerpt: 'After 6 months of SEO work for The Heritage Times, here are the strategies that drove 300% organic traffic growth — and what didn\'t work.',
    date: 'April 22, 2026',
    readTime: '6 min read',
    category: 'SEO',
    color: '#22C55E',
  },
  {
    id: 3,
    title: 'Why I Switched from REST to GraphQL (and Back Again)',
    excerpt: 'My honest take on GraphQL after building three production APIs with it. Spoiler: the answer depends heavily on your team size.',
    date: 'March 15, 2026',
    readTime: '5 min read',
    category: 'Backend',
    color: '#F97316',
  },
  {
    id: 4,
    title: 'Dockerizing a Laravel App for Production: A Complete Guide',
    excerpt: 'Step-by-step breakdown of how I containerize Laravel applications for zero-downtime deployments on AWS ECS.',
    date: 'February 8, 2026',
    readTime: '10 min read',
    category: 'DevOps',
    color: '#3B82F6',
  },
  {
    id: 5,
    title: 'Getting Remote Dev Jobs as a Nigerian Developer in 2026',
    excerpt: 'Practical advice on portfolio building, interview prep, and the exact platforms I used to land remote opportunities abroad.',
    date: 'January 20, 2026',
    readTime: '7 min read',
    category: 'Career',
    color: '#A855F7',
  },
  {
    id: 6,
    title: 'Building Your First React Native App: Lessons from FoodRunner',
    excerpt: 'Everything I wish I knew before shipping a cross-platform food delivery app — from state management to push notification edge cases.',
    date: 'December 5, 2025',
    readTime: '9 min read',
    category: 'Mobile',
    color: '#EAB308',
  },
];

export default function BlogPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-28 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[#F97316] text-sm font-semibold uppercase tracking-widest mb-3">Blog</p>
            <h1 className="text-5xl font-bold text-white mb-4">Thoughts & Tutorials</h1>
            <p className="text-[#666] text-lg max-w-xl">
              Writing about backend development, SEO, remote work, and everything in between.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((post) => (
              <article
                key={post.id}
                className="bento-card group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: `${post.color}15`,
                      color: post.color,
                      border: `1px solid ${post.color}30`,
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[#555]">{post.readTime}</span>
                </div>

                <h2 className="font-bold text-white text-lg leading-snug mb-3 group-hover:text-[#F97316] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[#666] text-sm leading-relaxed mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1A1A1A]">
                  <span className="text-xs text-[#555]">{post.date}</span>
                  <span className="text-xs text-[#F97316] font-medium group-hover:underline">Read more →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
