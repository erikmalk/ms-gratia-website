'use client';

import Link from 'next/link';
import React, { useLayoutEffect, useRef } from 'react';

import { site } from '@/lib/site-data';

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const viewport = window.visualViewport;
    let frame = 0;

    const updateLayoutMetrics = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--site-footer-height', `${footer.getBoundingClientRect().height}px`);
        document.documentElement.style.setProperty(
          '--site-viewport-height',
          `${viewport?.height ?? window.innerHeight}px`,
        );
      });
    };
    const observer = new ResizeObserver(updateLayoutMetrics);

    updateLayoutMetrics();
    observer.observe(footer);
    window.addEventListener('resize', updateLayoutMetrics);
    viewport?.addEventListener('resize', updateLayoutMetrics);
    viewport?.addEventListener('scroll', updateLayoutMetrics);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', updateLayoutMetrics);
      viewport?.removeEventListener('resize', updateLayoutMetrics);
      viewport?.removeEventListener('scroll', updateLayoutMetrics);
    };
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
