import Image from 'next/image';
import React from 'react';

import type { MediaItem } from '@/lib/site-data';
import { isCaptionColorDark } from '@/lib/caption-color';

type MediaImageProps = {
  item: MediaItem;
  priority?: boolean;
  sizes: string;
  className?: string;
  draggable?: boolean;
  showCaption?: boolean;
};

export function MediaImage({ item, priority = false, sizes, className, draggable, showCaption = true }: MediaImageProps) {
  const image = (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      className={className}
      draggable={draggable}
    />
  );

  if (!showCaption || !item.caption) return image;

  const captionColor = item.captionColor ?? '#ffffff';

  return (
    <span className="captioned-media">
      {image}
      <span
        className="media-caption"
        data-position={item.captionPosition ?? 'bottom-right'}
        data-shadow={isCaptionColorDark(captionColor) ? 'none' : undefined}
        style={{ color: captionColor }}
      >
        {item.caption}
      </span>
    </span>
  );
}
