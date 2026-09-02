import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://bonaventurechidalu.com'),
  title: {
    default: 'Bonaventure Chidalu | Fullstack Developer & SEO Specialist',
    template: '%s — Bonaventure Chidalu',
  },
  description:
    'Fullstack software engineer based in FCT Abuja, Nigeria. Specializing in PHP, Laravel, React, Next.js, and scalable backend systems. Available for remote work globally.',
  keywords: [
    'fullstack developer', 'PHP', 'Laravel', 'React', 'Next.js',
    'Nigeria', 'FCT Abuja', 'remote developer', 'backend developer', 'SEO specialist',
  ],
  authors: [{ name: 'Bonaventure Chidalu', url: 'https://bonaventurechidalu.com' }],
  creator: 'Bonaventure Chidalu',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bonaventure Chidalu Portfolio',
    title: 'Bonaventure Chidalu | Fullstack Developer & SEO Specialist',
    description: 'Fullstack software engineer based in FCT Abuja, Nigeria.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bonaventure Chidalu' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bonaventurechidalu',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://cdn.simpleicons.org" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body
        className="font-sans antialiased bg-[#0A0A0A] text-white overflow-x-hidden"
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              border: '1px solid #222',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#F97316', secondary: '#000' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
