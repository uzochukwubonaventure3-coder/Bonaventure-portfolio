import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import SchemaScript from '@/components/SchemaScript';
import { baseMetadata, personSchema, websiteSchema } from '@/lib/seo/metadata';
import './globals.css';

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <SchemaScript schema={[personSchema(), websiteSchema()]} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-white overflow-x-hidden">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '12px', fontSize: '13px' },
            success: { iconTheme: { primary: '#F97316', secondary: '#000' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
