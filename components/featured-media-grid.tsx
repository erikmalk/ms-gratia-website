import Link from 'next/link';

import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

type FeaturedMediaGridProps = {
  items: MediaItem[];
};

export function FeaturedMediaGrid({ items }: FeaturedMediaGridProps) {
  return (
    <div className="feature-grid">
      {items.map((item, index) => (
        <Link
          key={item.id}
          href={`/${item.category}`}
          className="feature-media"
          aria-label={`View ${item.category.replace('-', ' ')} work`}
        >
          <MediaImage
            item={item}
            priority={index < 3}
            sizes="(min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw"
          />
        </Link>
      ))}
    </div>
  );
}
