'use client';

import Link from 'next/link';
import React, { useLayoutEffect, useRef } from 'react';

import { site } from '@/lib/site-data';

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty('--site-footer-height', `${footer.offsetHeight}px`);
    };
    const observer = new ResizeObserver(updateHeight);

    updateHeight();
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} MS Gratia</p>
        <div className="inline-links" aria-label="Footer links">
          <Link href={`mailto:${site.email}`}>{site.email}</Link>
          <Link href={site.instagramUrl} target="_blank" rel="noreferrer">
            {site.instagram}
          </Link>
          <Link href={site.workInstagramUrl} target="_blank" rel="noreferrer">
            {site.workInstagram}
          </Link>
        </div>
      </div>
    </footer>
  );
}
