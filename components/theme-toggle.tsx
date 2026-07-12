'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';

const preferences: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: 'system', label: 'Use system theme', Icon: Monitor },
  { value: 'light', label: 'Use light theme', Icon: Sun },
  { value: 'dark', label: 'Use dark theme', Icon: Moon },
];

function applyTheme(preference: ThemePreference) {
  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolvedTheme = preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPreference = window.localStorage.getItem('theme-preference');
    const initialPreference: ThemePreference =
      storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system'
        ? storedPreference
        : 'system';

    setPreference(initialPreference);
    applyTheme(initialPreference);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = () => {
      if ((window.localStorage.getItem('theme-preference') ?? 'system') === 'system') {
        applyTheme('system');
      }
    };

    media.addEventListener('change', syncSystemTheme);
    return () => media.removeEventListener('change', syncSystemTheme);
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeMenu = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const current = preferences.find((item) => item.value === preference) ?? preferences[0];
  const CurrentIcon = current.Icon;

  const selectPreference = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    window.localStorage.setItem('theme-preference', nextPreference);
    applyTheme(nextPreference);
    setOpen(false);
  };

  return (
    <div className="theme-picker" ref={menuRef}>
      <button
        type="button"
        className="theme-toggle"
        aria-label={`Theme: ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <CurrentIcon aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>

      {open ? (
        <div className="theme-menu" role="menu" aria-label="Choose color theme">
          {preferences.map(({ value, Icon }) => (
            <button
              key={value}
              type="button"
              className="theme-option"
              role="menuitemradio"
              aria-checked={preference === value}
              onClick={() => selectPreference(value)}
            >
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{value === 'system' ? 'System' : value === 'light' ? 'Light' : 'Dark'}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
