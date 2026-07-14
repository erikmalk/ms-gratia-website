'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArchiveRestore, ChevronDown, ChevronUp, GripVertical, LogOut, Save, Trash2 } from 'lucide-react';
import { categoryDetails, categorySlugs, type CmsAsset } from '@/lib/cms/catalog';
import type { CategorySlug } from '@/lib/site-data';

type View = 'select' | 'sort';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const allByPosition = (assets: CmsAsset[], slug: CategorySlug) =>
  assets.filter((asset) => asset.assignments[slug] !== undefined)
    .sort((a, b) => (a.assignments[slug] ?? 0) - (b.assignments[slug] ?? 0));

const byPosition = (assets: CmsAsset[], slug: CategorySlug) =>
  allByPosition(assets, slug).filter((asset) => !asset.archived);

export function CmsEditor({ initialAssets }: { initialAssets: CmsAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [view, setView] = useState<View>('select');
  const [sortCategory, setSortCategory] = useState<CategorySlug>('celebrity');
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [thumbSize, setThumbSize] = useState(180);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [message, setMessage] = useState('');
  const [dragged, setDragged] = useState<string | null>(null);

  const visibleAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets.filter((asset) => (showArchived || !asset.archived) && (!query || `${asset.filename} ${asset.alt}`.toLowerCase().includes(query)));
  }, [assets, search, showArchived]);

  const ordered = useMemo(() => byPosition(assets, sortCategory), [assets, sortCategory]);
  const assignedCount = (slug: CategorySlug) => assets.filter((asset) => !asset.archived && asset.assignments[slug] !== undefined).length;
  const activePosition = (filename: string, slug: CategorySlug) =>
    byPosition(assets, slug).findIndex((asset) => asset.filename === filename) + 1;

  const normalizeCategory = (next: CmsAsset[], slug: CategorySlug, filenames: string[]) =>
    next.map((asset) => ({
      ...asset,
      assignments: {
        ...asset.assignments,
        [slug]: filenames.includes(asset.filename) ? filenames.indexOf(asset.filename) + 1 : undefined,
      },
    }));

  const toggleCategory = (filename: string, slug: CategorySlug) => {
    setAssets((current) => {
      const currentOrder = allByPosition(current, slug).map((asset) => asset.filename);
      const nextOrder = currentOrder.includes(filename) ? currentOrder.filter((item) => item !== filename) : [...currentOrder, filename];
      return normalizeCategory(current, slug, nextOrder);
    });
    setStatus('idle');
  };

  const archive = (filename: string, archived: boolean) => {
    setAssets((current) => current.map((asset) => asset.filename === filename
      ? { ...asset, archived }
      : asset));
    setStatus('idle');
  };

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= ordered.length || from === to) return;
    const activeFilenames = ordered.map((asset) => asset.filename);
    const [moved] = activeFilenames.splice(from, 1);
    activeFilenames.splice(to, 0, moved);
    setAssets((current) => {
      let activeIndex = 0;
      const fullOrder = allByPosition(current, sortCategory).map((asset) =>
        asset.archived ? asset.filename : activeFilenames[activeIndex++],
      );
      return normalizeCategory(current, sortCategory, fullOrder);
    });
    setStatus('idle');
  };

  const save = async () => {
    setStatus('saving');
    setMessage('');
    const response = await fetch('/api/cms/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archived: assets.filter((asset) => asset.archived).map((asset) => asset.filename),
        categories: Object.fromEntries(categorySlugs.map((slug) => [slug, allByPosition(assets, slug).map((asset) => asset.filename)])),
      }),
    });
    const result = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;
    if (!response.ok || !result?.ok) {
      setStatus('error');
      setMessage(result?.error ?? 'Unable to save changes.');
      return;
    }
    setStatus('saved');
    setMessage('Saved. The public galleries have been refreshed.');
  };

  const logout = async () => {
    await fetch('/api/cms/logout', { method: 'POST' });
    window.location.assign('/');
  };

  return (
    <section className="cms-shell">
      <header className="cms-toolbar">
        <div>
          <p className="cms-eyebrow">Temporary content manager</p>
          <h1>All media</h1>
          <p>{assets.length} assets · {assets.filter((asset) => asset.archived).length} archived</p>
        </div>
        <div className="cms-actions">
          <button className="secondary-button" onClick={logout}><LogOut size={16} /> Log out</button>
          <button className="button" onClick={save} disabled={status === 'saving'}><Save size={16} /> {status === 'saving' ? 'Saving…' : 'Save changes'}</button>
        </div>
      </header>

      <div className="cms-tabs" role="tablist" aria-label="CMS view">
        <button role="tab" aria-selected={view === 'select'} onClick={() => setView('select')}>Select & archive</button>
        <button role="tab" aria-selected={view === 'sort'} onClick={() => setView('sort')}>Sort categories</button>
      </div>

      {message && <p className={`cms-message is-${status}`} role="status">{message}</p>}

      {view === 'select' ? (
        <>
          <div className="cms-filters">
            <label>Search <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filename or description" /></label>
            <label>Thumbnail size <input type="range" min="110" max="300" value={thumbSize} onChange={(event) => setThumbSize(Number(event.target.value))} /></label>
            <label className="cms-check"><input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} /> Show archived</label>
          </div>
          <div className="cms-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${thumbSize}px, 1fr))` }}>
            {visibleAssets.map((asset) => (
              <article className={`cms-card${asset.archived ? ' is-archived' : ''}`} key={asset.filename}>
                <div className="cms-thumb">
                  {asset.type === 'video' ? <video src={asset.src} muted preload="metadata" /> : <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes={`${thumbSize}px`} /> }
                  <button className="cms-archive" onClick={() => archive(asset.filename, !asset.archived)} aria-label={asset.archived ? `Restore ${asset.filename}` : `Archive ${asset.filename}`} title={asset.archived ? 'Restore' : 'Archive'}>
                    {asset.archived ? <ArchiveRestore size={17} /> : <Trash2 size={17} />}
                  </button>
                </div>
                <p className="cms-filename" title={asset.filename}>{asset.filename}</p>
                {!asset.archived && asset.type === 'image' && <div className="cms-category-checks">
                  {categorySlugs.map((slug) => {
                    const assigned = asset.assignments[slug] !== undefined;
                    return <label key={slug}><input type="checkbox" checked={assigned} onChange={() => toggleCategory(asset.filename, slug)} /> <span>{categoryDetails[slug].title}</span>{assigned && <strong>#{activePosition(asset.filename, slug)}</strong>}</label>;
                  })}
                </div>}
                {asset.type === 'video' && <p className="cms-muted">Video · not assignable to image galleries</p>}
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <nav className="cms-category-tabs" aria-label="Category to sort">
            {categorySlugs.map((slug) => <button key={slug} aria-current={sortCategory === slug ? 'page' : undefined} onClick={() => setSortCategory(slug)}>{categoryDetails[slug].title} <span>{assignedCount(slug)}</span></button>)}
          </nav>
          <p className="cms-sort-help">Drag cards or use the arrow buttons. The displayed number is the public gallery order.</p>
          <div className="cms-sort-list">
            {ordered.map((asset, index) => (
              <article
                className="cms-sort-card"
                key={asset.filename}
                draggable
                onDragStart={() => setDragged(asset.filename)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const from = ordered.findIndex((item) => item.filename === dragged);
                  reorder(from, index);
                  setDragged(null);
                }}
              >
                <GripVertical className="cms-grip" aria-hidden="true" />
                <strong className="cms-position">{index + 1}</strong>
                <Image src={asset.src} alt="" width={80} height={64} />
                <span>{asset.filename}</span>
                <div className="cms-order-actions">
                  <button onClick={() => reorder(index, index - 1)} disabled={index === 0} aria-label={`Move ${asset.filename} up`}><ChevronUp size={18} /></button>
                  <button onClick={() => reorder(index, index + 1)} disabled={index === ordered.length - 1} aria-label={`Move ${asset.filename} down`}><ChevronDown size={18} /></button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
