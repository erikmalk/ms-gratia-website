'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import type { NavigationItem } from '@/lib/portfolio';

const STATIC_PUBLIC_PATHS = new Set(['/', '/about', '/contact', '/credits', '/work', '/resume']);

export function SiteMenuReveal({ navigation }: { navigation: NavigationItem[] }) {
  const pathname = usePathname();
  const isPublicPage = STATIC_PUBLIC_PATHS.has(pathname) || navigation.some((item) => item.href === pathname);

  if (!isPublicPage) return null;

  return (
    <div className="site-menu-reveal">
      <nav className="site-menu-reveal-panel" aria-label="Explore more">
        <ul className="site-menu-reveal-list">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  className="site-menu-reveal-link"
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}