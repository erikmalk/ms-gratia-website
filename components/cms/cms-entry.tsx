'use client';

import React, { useEffect, useState } from 'react';
import { CmsEditor } from '@/components/cms/cms-editor';
import type { CmsAsset } from '@/lib/cms/catalog';

export function CmsEntry({ slug, authenticated }: { slug: string; authenticated: boolean }) {
  const [ready, setReady] = useState(authenticated);
  const [assets, setAssets] = useState<CmsAsset[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const start = async () => {
      if (!ready) {
        const sessionResponse = await fetch('/api/cms/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });
        if (!sessionResponse.ok) {
          if (active) setError('This CMS link is unavailable.');
          return;
        }
        if (active) setReady(true);
      }

      const response = await fetch('/api/cms/state', { cache: 'no-store' });
      const result = (await response.json().catch(() => null)) as { assets?: CmsAsset[]; error?: string } | null;
      if (!response.ok || !result?.assets) {
        if (active) setError(result?.error ?? 'Unable to load the image catalog.');
        return;
      }
      if (active) setAssets(result.assets);
    };
    void start();
    return () => { active = false; };
  }, [ready, slug]);

  if (error) return <div className="cms-loading"><p>{error}</p></div>;
  if (!ready || !assets) return <div className="cms-loading"><p>Loading all 220 media assets…</p></div>;
  return <CmsEditor initialAssets={assets} />;
}
