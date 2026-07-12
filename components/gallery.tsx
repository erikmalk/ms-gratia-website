'use client';

import { useEffect, useMemo, useState } from 'react';

import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

type GalleryProps = {
  items: MediaItem[];
  initialCount?: number;
};

export function Gallery({ items, initialCount = items.length }: GalleryProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const canLoadMore = visibleCount < items.length;

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === null ? 0 : (current + 1) % visibleItems.length));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? 0 : (current - 1 + visibleItems.length) % visibleItems.length,
        );
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, visibleItems.length]);

  const activeItem = activeIndex === null ? null : visibleItems[activeIndex];

  return (
    <>
      <div className="masonry-grid" role="list">
        {visibleItems.map((item, index) => (
          <div key={item.id} className="gallery-item" role="listitem">
            <button
              type="button"
              className="gallery-button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${item.alt} in fullscreen view`}
            >
              <div className="gallery-card">
                <MediaImage item={item} priority={index < 6} sizes="(min-width: 1240px) 25vw, (min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw" />
                <div className="gallery-caption">
                  <span>{item.alt}</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {canLoadMore ? (
        <div className="section-compact">
          <button type="button" className="secondary-button" onClick={() => setVisibleCount(items.length)}>
            View all {items.length} images
          </button>
        </div>
      ) : null}

      {activeItem ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${activeItem.alt} fullscreen view`}>
          <div className="lightbox-header">
            <div>
              <p className="card-kicker">Fullscreen viewer</p>
              <div className="stat-value">{activeItem.alt}</div>
            </div>
            <button type="button" className="close-button" onClick={() => setActiveIndex(null)}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close lightbox</span>
            </button>
          </div>
          <div className="lightbox-stage">
            <button
              type="button"
              className="lightbox-control prev"
              onClick={() => setActiveIndex((current) => (current === null ? 0 : (current - 1 + visibleItems.length) % visibleItems.length))}
            >
              ←
            </button>
            <MediaImage item={activeItem} priority sizes="100vw" />
            <button
              type="button"
              className="lightbox-control next"
              onClick={() => setActiveIndex((current) => (current === null ? 0 : (current + 1) % visibleItems.length))}
            >
              →
            </button>
          </div>
          <div className="lightbox-footer">
            <span className="muted-text">
              {(activeIndex ?? 0) + 1} / {visibleItems.length}
            </span>
            <button type="button" className="secondary-button" onClick={() => setActiveIndex(null)}>
              Back to gallery
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
