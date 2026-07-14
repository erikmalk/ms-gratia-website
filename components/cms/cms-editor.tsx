'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArchiveRestore, ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp, GripVertical, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import type { CmsAsset } from '@/lib/cms/catalog';
import type { CmsCategoryState } from '@/lib/cms/repository';

type View = 'select' | 'sort' | 'categories';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const allByPosition = (assets: CmsAsset[], slug: string) =>
  assets.filter((asset) => asset.assignments[slug] !== undefined)
    .sort((a, b) => (a.assignments[slug] ?? 0) - (b.assignments[slug] ?? 0));

const byPosition = (assets: CmsAsset[], slug: string) =>
  allByPosition(assets, slug).filter((asset) => !asset.archived);

const slugify = (title: string) => title.toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 64);

export function CmsEditor({ initialAssets, initialCategories }: { initialAssets: CmsAsset[]; initialCategories: CmsCategoryState[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [categories, setCategories] = useState(initialCategories);
  const [view, setView] = useState<View>('select');
  const [sortCategory, setSortCategory] = useState(initialCategories.find((category) => category.isHome)?.slug ?? initialCategories.find((category) => !category.archived)?.slug ?? 'home');
  const [showArchived, setShowArchived] = useState(false);
  const [showArchivedCategories, setShowArchivedCategories] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [search, setSearch] = useState('');
  const [thumbSize, setThumbSize] = useState(180);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [message, setMessage] = useState('');
  const [dragged, setDragged] = useState<string | null>(null);

  const activeCategories = categories.filter((category) => !category.archived);
  const menuCategories = activeCategories.filter((category) => !category.isHome);
  const categoryLookup = new Map(categories.map((category) => [category.slug, category]));
  const visibleAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets.filter((asset) => (showArchived || !asset.archived) && (!query || `${asset.filename} ${asset.alt}`.toLowerCase().includes(query)));
  }, [assets, search, showArchived]);
  const ordered = useMemo(() => byPosition(assets, sortCategory), [assets, sortCategory]);
  const assignedCount = (slug: string) => assets.filter((asset) => !asset.archived && asset.assignments[slug] !== undefined).length;
  const activePosition = (filename: string, slug: string) => byPosition(assets, slug).findIndex((asset) => asset.filename === filename) + 1;

  const markChanged = () => {
    setStatus('idle');
    setMessage('');
  };

  const normalizeCategory = (next: CmsAsset[], slug: string, filenames: string[]) =>
    next.map((asset) => ({
      ...asset,
      assignments: {
        ...asset.assignments,
        [slug]: filenames.includes(asset.filename) ? filenames.indexOf(asset.filename) + 1 : undefined,
      },
    }));

  const toggleCategory = (filename: string, slug: string) => {
    setAssets((current) => {
      const currentOrder = allByPosition(current, slug).map((asset) => asset.filename);
      const nextOrder = currentOrder.includes(filename) ? currentOrder.filter((item) => item !== filename) : [...currentOrder, filename];
      return normalizeCategory(current, slug, nextOrder);
    });
    markChanged();
  };

  const archive = (filename: string, archived: boolean) => {
    setAssets((current) => current.map((asset) => asset.filename === filename ? { ...asset, archived } : asset));
    markChanged();
  };

  const reorderByFilename = (filename: string, targetFilename: string) => {
    if (filename === targetFilename) return;
    setAssets((current) => {
      const activeFilenames = byPosition(current, sortCategory).map((asset) => asset.filename);
      const from = activeFilenames.indexOf(filename);
      const to = activeFilenames.indexOf(targetFilename);
      if (from < 0 || to < 0 || from === to) return current;
      const [moved] = activeFilenames.splice(from, 1);
      activeFilenames.splice(to, 0, moved);
      let activeIndex = 0;
      const fullOrder = allByPosition(current, sortCategory).map((asset) => asset.archived ? asset.filename : activeFilenames[activeIndex++]);
      return normalizeCategory(current, sortCategory, fullOrder);
    });
    markChanged();
  };

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= ordered.length || from === to) return;
    reorderByFilename(ordered[from].filename, ordered[to].filename);
  };

  const removeFromCategory = (filename: string) => {
    setAssets((current) => normalizeCategory(current, sortCategory, allByPosition(current, sortCategory).map((asset) => asset.filename).filter((item) => item !== filename)));
    markChanged();
  };

  const updateCategoryTitle = (slug: string, title: string) => {
    setCategories((current) => current.map((category) => category.slug === slug ? { ...category, title } : category));
    markChanged();
  };

  const reorderCategory = (slug: string, direction: 'top' | 'up' | 'down' | 'bottom') => {
    setCategories((current) => {
      const active = current.filter((category) => !category.archived && !category.isHome);
      const from = active.findIndex((category) => category.slug === slug);
      if (from < 0) return current;
      const to = direction === 'top' ? 0 : direction === 'bottom' ? active.length - 1 : direction === 'up' ? Math.max(0, from - 1) : Math.min(active.length - 1, from + 1);
      if (from === to) return current;
      const [moved] = active.splice(from, 1);
      active.splice(to, 0, moved);
      let activeIndex = 0;
      return current.map((category) => category.archived || category.isHome ? category : active[activeIndex++]);
    });
    markChanged();
  };

  const setCategoryArchived = (slug: string, archived: boolean) => {
    setCategories((current) => current.map((category) => category.slug === slug ? { ...category, archived } : category));
    if (archived && sortCategory === slug) {
      setSortCategory(categories.find((category) => !category.archived && category.slug !== slug)?.slug ?? 'home');
    }
    markChanged();
  };

  const addCategory = () => {
    const title = newCategoryTitle.trim();
    let base = slugify(title);
    if (!base) return;
    if (base === 'home' || ['about', 'api', 'contact', 'credits', 'resume', 'work'].includes(base)) base = `${base}-portfolio`;
    let slug = base;
    let suffix = 2;
    while (categories.some((category) => category.slug === slug)) slug = `${base}-${suffix++}`;
    setCategories((current) => [...current, {
      slug,
      title,
      description: `${title} portfolio.`,
      displayOrder: current.length + 1,
      archived: false,
      isHome: false,
    }]);
    setNewCategoryTitle('');
    setSortCategory(slug);
    markChanged();
  };

  const save = async () => {
    if (categories.some((category) => !category.title.trim())) {
      setStatus('error');
      setMessage('Every category needs a name.');
      return;
    }
    setStatus('saving');
    setMessage('');
    const response = await fetch('/api/cms/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archived: assets.filter((asset) => asset.archived).map((asset) => asset.filename),
        categories: categories.map((category) => ({
          slug: category.slug,
          title: category.title.trim(),
          description: category.description,
          archived: category.archived,
          isHome: category.isHome,
          filenames: allByPosition(assets, category.slug).map((asset) => asset.filename),
        })),
      }),
    });
    const result = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;
    if (!response.ok || !result?.ok) {
      setStatus('error');
      setMessage(result?.error ?? 'Unable to save changes.');
      return;
    }
    setStatus('saved');
    setMessage('Saved. The homepage, menus, and public galleries have been refreshed.');
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
        <button role="tab" aria-selected={view === 'sort'} onClick={() => setView('sort')}>Sort gallery images</button>
        <button role="tab" aria-selected={view === 'categories'} onClick={() => setView('categories')}>Manage categories</button>
      </div>

      {message && <p className={`cms-message is-${status}`} role="status">{message}</p>}

      {view === 'select' && (
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
                  {asset.type === 'video' ? <video src={asset.src} muted preload="metadata" /> : <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes={`${thumbSize}px`} />}
                  <button className="cms-archive" onClick={() => archive(asset.filename, !asset.archived)} aria-label={asset.archived ? `Restore ${asset.filename}` : `Archive ${asset.filename}`} title={asset.archived ? 'Restore' : 'Archive'}>
                    {asset.archived ? <ArchiveRestore size={17} /> : <Trash2 size={17} />}
                  </button>
                </div>
                <p className="cms-filename" title={asset.filename}>{asset.filename}</p>
                {!asset.archived && asset.type === 'image' && <div className="cms-category-checks">
                  {activeCategories.map((category) => {
                    const assigned = asset.assignments[category.slug] !== undefined;
                    return <label key={category.slug}><input type="checkbox" checked={assigned} onChange={() => toggleCategory(asset.filename, category.slug)} /> <span>{category.title}</span>{assigned && <strong>#{activePosition(asset.filename, category.slug)}</strong>}</label>;
                  })}
                </div>}
                {asset.type === 'video' && <p className="cms-muted">Video · not assignable to image galleries</p>}
              </article>
            ))}
          </div>
        </>
      )}

      {view === 'sort' && (
        <>
          <nav className="cms-category-tabs" aria-label="Gallery to sort">
            {activeCategories.map((category) => <button key={category.slug} aria-current={sortCategory === category.slug ? 'page' : undefined} onClick={() => setSortCategory(category.slug)}>{category.title} <span>{assignedCount(category.slug)}</span></button>)}
          </nav>
          <p className="cms-sort-help">Home controls the gallery at /. Other empty categories disappear from the public menus. Drag by the grip, use the ordering buttons, or remove an image from this gallery with the trash button.</p>
          <div className="cms-sort-list" onPointerMove={(event) => {
            if (!dragged) return;
            event.preventDefault();
            const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-sort-filename]');
            if (target?.dataset.sortFilename) reorderByFilename(dragged, target.dataset.sortFilename);
            if (event.clientY < 80) window.scrollBy({ top: -12 });
            if (event.clientY > window.innerHeight - 80) window.scrollBy({ top: 12 });
          }} onPointerUp={() => setDragged(null)} onPointerCancel={() => setDragged(null)}>
            {ordered.map((asset, index) => (
              <article className={`cms-sort-card${dragged === asset.filename ? ' is-dragging' : ''}`} key={asset.filename} data-sort-filename={asset.filename} draggable onDragStart={() => setDragged(asset.filename)} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { reorder(ordered.findIndex((item) => item.filename === dragged), index); setDragged(null); }}>
                <button type="button" className="cms-grip" aria-label={`Drag ${asset.filename} to reorder`} onPointerDown={(event) => { event.preventDefault(); setDragged(asset.filename); }}><GripVertical size={20} aria-hidden="true" /></button>
                <strong className="cms-position">{index + 1}</strong>
                <Image src={asset.src} alt="" width={80} height={64} />
                <span>{asset.filename}</span>
                <div className="cms-order-actions">
                  <button type="button" onClick={() => reorder(index, 0)} disabled={index === 0} aria-label={`Move ${asset.filename} to top`} title="Move to top"><ArrowUpToLine size={18} /></button>
                  <button type="button" onClick={() => reorder(index, index - 1)} disabled={index === 0} aria-label={`Move ${asset.filename} up`} title="Move up"><ChevronUp size={18} /></button>
                  <button type="button" onClick={() => reorder(index, index + 1)} disabled={index === ordered.length - 1} aria-label={`Move ${asset.filename} down`} title="Move down"><ChevronDown size={18} /></button>
                  <button type="button" onClick={() => reorder(index, ordered.length - 1)} disabled={index === ordered.length - 1} aria-label={`Move ${asset.filename} to bottom`} title="Move to bottom"><ArrowDownToLine size={18} /></button>
                  <button type="button" className="cms-remove-category" onClick={() => removeFromCategory(asset.filename)} aria-label={`Remove ${asset.filename} from ${categoryLookup.get(sortCategory)?.title ?? sortCategory}`} title="Remove from category"><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
            {!ordered.length && <p className="cms-message">This gallery is empty. Add images under Select & archive.</p>}
          </div>
        </>
      )}

      {view === 'categories' && (
        <section className="cms-category-manager">
          <div className="cms-category-manager-header">
            <div><h2>Menu categories</h2><p>Order and names update both desktop and mobile menus. Home is reserved and never appears in the menu.</p></div>
            <label className="cms-check"><input type="checkbox" checked={showArchivedCategories} onChange={(event) => setShowArchivedCategories(event.target.checked)} /> Show archived categories</label>
          </div>
          <div className="cms-add-category">
            <label>New category name <input className="input" value={newCategoryTitle} onChange={(event) => setNewCategoryTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCategory(); } }} placeholder="New category" /></label>
            <button className="button" type="button" onClick={addCategory} disabled={!newCategoryTitle.trim()}><Plus size={16} /> Add category</button>
          </div>
          <div className="cms-category-list">
            {categories.filter((category) => showArchivedCategories || !category.archived).map((category) => {
              const activeIndex = menuCategories.findIndex((item) => item.slug === category.slug);
              return (
                <article className={`cms-category-row${category.archived ? ' is-archived' : ''}`} key={category.slug}>
                  <div className="cms-category-identity">
                    <label>Category name <input className="input" value={category.title} onChange={(event) => updateCategoryTitle(category.slug, event.target.value)} /></label>
                    <span>/{category.slug} · {allByPosition(assets, category.slug).length} images{category.isHome ? ' · homepage' : ''}</span>
                  </div>
                  {!category.archived && !category.isHome && <div className="cms-order-actions cms-category-order-actions">
                    <button type="button" onClick={() => reorderCategory(category.slug, 'top')} disabled={activeIndex === 0} aria-label={`Move ${category.title} to top`} title="Move to top"><ArrowUpToLine size={18} /></button>
                    <button type="button" onClick={() => reorderCategory(category.slug, 'up')} disabled={activeIndex === 0} aria-label={`Move ${category.title} up`} title="Move up"><ChevronUp size={18} /></button>
                    <button type="button" onClick={() => reorderCategory(category.slug, 'down')} disabled={activeIndex === menuCategories.length - 1} aria-label={`Move ${category.title} down`} title="Move down"><ChevronDown size={18} /></button>
                    <button type="button" onClick={() => reorderCategory(category.slug, 'bottom')} disabled={activeIndex === menuCategories.length - 1} aria-label={`Move ${category.title} to bottom`} title="Move to bottom"><ArrowDownToLine size={18} /></button>
                  </div>}
                  {!category.isHome && <button type="button" className={category.archived ? 'secondary-button' : 'cms-category-archive-button'} onClick={() => setCategoryArchived(category.slug, !category.archived)}>{category.archived ? <><ArchiveRestore size={16} /> Restore</> : <><Trash2 size={16} /> Archive</>}</button>}
                  {category.isHome && <strong className="cms-home-badge">Home</strong>}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
