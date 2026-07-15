'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';
import { isCaptionColorDark } from '@/lib/caption-color';

const SLIDE_DURATION_MS = 2000;
const SWIPE_DISTANCE_PX = 45;
const HOLD_THRESHOLD_MS = 500;

type PointerStart = {
  id: number;
  x: number;
  y: number;
  time: number;
  pointerType: string;
};

export function HomeCarousel({ items }: { items: MediaItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [mediaInset, setMediaInset] = useState({ left: 12, right: 12, bottom: 12 });
  const pointerStart = useRef<PointerStart | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const goNext = useCallback(() => {
    if (items.length < 1) return;

    if (currentIndex === items.length - 1) {
      setCurrentIndex(0);
      setHasCompleted(true);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }, [currentIndex, items.length]);

  const goPrevious = useCallback(() => {
    if (items.length < 1) return;
    setCurrentIndex((index) => (index === 0 ? items.length - 1 : index - 1));
  }, [items.length]);

  useEffect(() => {
    if (hasCompleted || isHolding || items.length < 1) return;
    const timer = window.setTimeout(goNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [currentIndex, goNext, hasCompleted, isHolding, items.length]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const image = viewport?.querySelector<HTMLElement>(".home-carousel-slide[data-active='true'] img");
    if (!viewport || !image) return;

    const updateInset = () => {
      const viewportBounds = viewport.getBoundingClientRect();
      const imageBounds = image.getBoundingClientRect();
      const nextInset = {
        left: Math.max(10, imageBounds.left - viewportBounds.left + 10),
        right: Math.max(10, viewportBounds.right - imageBounds.right + 10),
        bottom: Math.max(10, viewportBounds.bottom - imageBounds.bottom + 10),
      };
      setMediaInset((current) => (
        current.left === nextInset.left
          && current.right === nextInset.right
          && current.bottom === nextInset.bottom
          ? current
          : nextInset
      ));
    };

    updateInset();
    const observer = new ResizeObserver(updateInset);
    observer.observe(viewport);
    observer.observe(image);
    image.addEventListener('load', updateInset);
    return () => {
      observer.disconnect();
      image.removeEventListener('load', updateInset);
    };
  }, [currentIndex]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];
  const currentCaptionColor = currentItem.captionColor ?? '#ffffff';
  const goTo = (index: number) => setCurrentIndex(index);
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      pointerType: event.pointerType,
    };
    setIsHolding(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events may not register an active native pointer.
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId) return;

    pointerStart.current = null;
    setIsHolding(false);
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const elapsed = performance.now() - start.time;
    const isSwipe = start.pointerType !== 'mouse'
      && Math.abs(deltaX) >= SWIPE_DISTANCE_PX
      && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;

    if (isSwipe) {
      if (deltaX < 0) goNext();
      else goPrevious();
      return;
    }

    const isTap = Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12 && elapsed < HOLD_THRESHOLD_MS;
    if (!isTap) return;

    const isMobile = window.matchMedia('(max-width: 759px)').matches;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width;
    if (isMobile && horizontalPosition <= 0.25) goPrevious();
    else goNext();
  };

  const cancelPointer = () => {
    pointerStart.current = null;
    setIsHolding(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      goNext();
    } else if (event.key === ' ') {
      event.preventDefault();
      setIsHolding(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ') setIsHolding(false);
  };

  return (
    <div className="home-carousel" aria-label="Featured work carousel">
      <div
        ref={viewportRef}
        className="home-carousel-viewport"
        role="group"
        tabIndex={0}
        aria-label={`Slide ${currentIndex + 1} of ${items.length}. Use arrow keys to browse; hold Space to pause.`}
        data-holding={isHolding ? 'true' : 'false'}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelPointer}
        onLostPointerCapture={cancelPointer}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onContextMenu={(event) => event.preventDefault()}
      >
        {items.map((item, index) => (
          <figure
            key={item.id}
            className="home-carousel-slide"
            data-active={index === currentIndex ? 'true' : 'false'}
            aria-hidden={index !== currentIndex}
          >
            <MediaImage
              item={item}
              priority={index < 2}
              sizes="(min-width: 760px) min(100vw - 80px, 1280px), calc(100vw - 32px)"
              draggable={false}
              showCaption={false}
            />
          </figure>
        ))}

        {currentItem.caption ? (
          <span
            className="media-caption home-carousel-caption"
            data-position={currentItem.captionPosition ?? 'bottom-right'}
            data-shadow={isCaptionColorDark(currentCaptionColor) ? 'none' : undefined}
            style={{
              bottom: mediaInset.bottom,
              color: currentCaptionColor,
              left: currentItem.captionPosition === 'bottom-left' ? mediaInset.left : undefined,
              right: currentItem.captionPosition !== 'bottom-left' ? mediaInset.right : undefined,
            }}
          >
            {currentItem.caption}
          </span>
        ) : null}

      </div>

      {items.length > 1 ? (
        <div className="home-carousel-dots" role="group" aria-label="Choose a slide">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="home-carousel-dot"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
