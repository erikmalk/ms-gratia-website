'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import type { NavigationItem } from '@/lib/cms/repository';

export function HomeMenuReveal({ navigation }: { navigation: NavigationItem[] }) {
  const pathname = usePathname();

  if (pathname !== '/') return null;

  return (
    <div className="home-menu-reveal">
      <nav className="home-menu-reveal-panel" aria-label="Explore more">
        <ul className="home-menu-reveal-list">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link className="home-menu-reveal-link" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
