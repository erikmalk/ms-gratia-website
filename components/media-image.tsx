import Image from 'next/image';

import type { MediaItem } from '@/lib/site-data';

type MediaImageProps = {
  item: MediaItem;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function MediaImage({ item, priority = false, sizes, className }: MediaImageProps) {
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
