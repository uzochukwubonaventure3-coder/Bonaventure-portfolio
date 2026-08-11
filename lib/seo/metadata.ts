import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bonaventurechidalu.com';
const OWNER = 'Bonaventure Chidalu';
const TAGLINE = 'Fullstack Developer & SEO Specialist';
const DESCRIPTION = 'Fullstack software engineer based in FCT Abuja, Nigeria. Specializing in PHP, Laravel, React, Next.js, and scalable backend systems. Available for remote work globally.';

// ─── BASE METADATA ─────────────────────────────────────────
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${OWNER} | ${TAGLINE}`,
    template: `%s — ${OWNER}`,
  },
  description: DESCRIPTION,
  keywords: [
    'fullstack developer', 'PHP developer', 'Laravel developer',
    'React developer', 'Next.js developer', 'Nigeria', 'FCT Abuja',
    'remote developer', 'backend developer', 'SEO specialist',
    'web development', 'API development', 'Bonaventure Chidalu',
  ],
  authors: [{ name: OWNER, url: BASE_URL }],
  creator: OWNER,
  publisher: OWNER,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: `${OWNER} Portfolio`,
    title: `${OWNER} | ${TAGLINE}`,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: `${OWNER} — ${TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${OWNER} | ${TAGLINE}`,
    description: DESCRIPTION,
    creator: '@bonaventurechidalu',
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  alternates: { canonical: BASE_URL },
};

// ─── PAGE-SPECIFIC METADATA ────────────────────────────────
export function pageMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  tags?: string[];
}): Metadata {
  const url = `${BASE_URL}${overrides.path ?? ''}`;
  const image = overrides.image ?? `${BASE_URL}/og-image.png`;
  const title = overrides.title
    ? `${overrides.title} — ${OWNER}`
    : `${OWNER} | ${TAGLINE}`;
  const description = overrides.description ?? DESCRIPTION;

  return {
    title: overrides.title ?? `${OWNER} | ${TAGLINE}`,
    description,
    keywords: overrides.tags,
    alternates: { canonical: url },
    openGraph: {
      type: overrides.type ?? 'website',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(overrides.publishedAt ? { publishedTime: overrides.publishedAt } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// ─── PERSON SCHEMA ─────────────────────────────────────────
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: OWNER,
    url: BASE_URL,
    jobTitle: TAGLINE,
    description: DESCRIPTION,
    address: { '@type': 'PostalAddress', addressLocality: 'FCT Abuja', addressCountry: 'NG' },
    sameAs: [
      'https://github.com/bonaventurechidalu',
      'https://linkedin.com/in/bonaventurechidalu',
      'https://twitter.com/bonaventurechidalu',
    ],
    knowsAbout: ['PHP', 'Laravel', 'React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'SEO'],
  };
}

// ─── WEBSITE SCHEMA ────────────────────────────────────────
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${OWNER} Portfolio`,
    url: BASE_URL,
    description: DESCRIPTION,
    author: { '@type': 'Person', name: OWNER },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── BLOG POST SCHEMA ──────────────────────────────────────
export function blogPostSchema(post: {
  title: string; excerpt: string | null; content: string;
  slug: string; cover_image: string | null;
  created_at: string; updated_at: string; tags: string[];
  reading_time: number; ai_seo_desc?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.ai_seo_desc ?? post.excerpt ?? post.content.slice(0, 155),
    url: `${BASE_URL}/blog/${post.slug}`,
    image: post.cover_image ?? `${BASE_URL}/og-image.png`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: OWNER, url: BASE_URL },
    publisher: {
      '@type': 'Person',
      name: OWNER,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    keywords: post.tags.join(', '),
    timeRequired: `PT${post.reading_time}M`,
    inLanguage: 'en-US',
  };
}

// ─── PROJECT SCHEMA ────────────────────────────────────────
export function projectSchema(project: {
  title: string; description: string; slug: string;
  image_url: string | null; tags: string[]; live_url?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.live_url ?? `${BASE_URL}/work`,
    image: project.image_url ?? `${BASE_URL}/og-image.png`,
    author: { '@type': 'Person', name: OWNER },
    keywords: project.tags.join(', '),
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
  };
}

// ─── BREADCRUMB SCHEMA ─────────────────────────────────────
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}
