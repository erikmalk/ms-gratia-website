'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';

const preferences: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: 'system', label: 'System theme', Icon: Monitor },
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
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

  const currentIndex = preferences.findIndex((item) => item.value === preference);
  const current = preferences[currentIndex] ?? preferences[0];
  const next = preferences[(currentIndex + 1) % preferences.length] ?? preferences[0];
  const CurrentIcon = current.Icon;

  const cycleTheme = () => {
    setPreference(next.value);
    window.localStorage.setItem('theme-preference', next.value);
    applyTheme(next.value);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`${current.label}. Switch to ${next.label}.`}
      title={`${current.label} · switch to ${next.label}`}
      onClick={cycleTheme}
    >
      <CurrentIcon aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}
