import type { Metadata } from 'next';
import '../globals.css';
import { IntlProvider } from '@/app/providers';
import { locales, defaultLocale } from '@/i18n.config';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Bonaventure Chidalu | Fullstack Developer & SEO Specialist',
  description:
    'Portfolio of Bonaventure Chidalu, a Fullstack Developer specializing in PHP, Laravel, Node.js, React, and SEO-optimized web applications.',
  keywords: ['fullstack developer', 'PHP', 'Laravel', 'React', 'Next.js', 'Nigeria', 'remote'],
  authors: [{ name: 'Bonaventure Chidalu' }],
  openGraph: {
    title: 'Bonaventure Chidalu | Fullstack Developer',
    description: 'Building fast, scalable, and SEO-optimized web applications.',
    url: 'https://bonaventurechidalu.com.ng',
    siteName: 'Apcodesphere Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bonaventure Chidalu | Fullstack Developer',
    description: 'Building fast, scalable, and SEO-optimized web applications.',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
