'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { NavigationItem } from '@/lib/cms/repository';

export function SiteHeader({ navigation }: { navigation: NavigationItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showWordmark, setShowWordmark] = useState(pathname !== '/');

  useEffect(() => {
    setOpen(false);
    setShowWordmark(pathname !== '/');
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const title = document.querySelector('.home-portfolio .portfolio-heading h1');
    if (!title) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowWordmark(!entry.isIntersecting),
      { rootMargin: '-48px 0px 0px' },
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="wordmark"
          data-visible={showWordmark ? 'true' : 'false'}
          aria-label="Gratia home"
          aria-hidden={!showWordmark}
          tabIndex={showWordmark ? undefined : -1}
        >
          Gratia
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          <ul className="nav-list">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link className="nav-link" href={item.href} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className="mobile-panel" aria-label="Mobile">
          <div className="container">
            <ul className="mobile-list">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      className="mobile-link"
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
