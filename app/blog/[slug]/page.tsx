import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPostBySlug, getFeaturedPosts } from '@/lib/supabase/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackToTop, CustomCursor } from '@/components/UI';
import PostContent from '@/components/blog/PostContent';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — BC Engineering Journal`,
    description: post.excerpt ?? post.ai_summary ?? '',
    openGraph: { title: post.title, description: post.excerpt ?? '', images: post.cover_image ? [post.cover_image] : [] },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  const related = await getFeaturedPosts(3);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="cursor-none pt-24 pb-20 min-h-screen">
        <PostContent post={post} related={related.filter(r => r.id !== post.id).slice(0, 2)} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
