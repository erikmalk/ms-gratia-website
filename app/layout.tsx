import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Manrope } from 'next/font/google';

import '@/app/globals.css';
import '@/app/cms.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { site } from '@/lib/site-data';

const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en">
      <body className={sans.variable}>
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
