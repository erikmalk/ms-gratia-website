import Image from 'next/image';

import type { MediaItem } from '@/lib/site-data';

type MediaImageProps = {
  item: MediaItem;
  priority?: boolean;
  sizes: string;
  className?: string;
  draggable?: boolean;
};

export function MediaImage({ item, priority = false, sizes, className, draggable }: MediaImageProps) {
  return (
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
}
