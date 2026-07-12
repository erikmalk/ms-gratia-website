import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Cormorant_Garamond } from 'next/font/google';

import '@/app/globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { site } from '@/lib/site-data';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s — MS Gratia',
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    images: [{ url: '/media/old-age-sculpt-profile.webp', width: 2500, height: 1667, alt: site.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/media/old-age-sculpt-profile.webp'],
  },
  category: 'portfolio',
  keywords: [
    'makeup artist los angeles',
    'special effects makeup artist',
    'film and television makeup',
    'beauty makeup portfolio',
    'prosthetic makeup artist',
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('theme-preference')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.dataset.themePreference=p;document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${sans.variable} ${serif.variable}`}>
        <div className="page-shell">
          <SiteHeader />
          <main id="main-content" className="page-main">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
