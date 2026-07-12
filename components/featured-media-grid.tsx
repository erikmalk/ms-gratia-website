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
        <article key={item.id} className="feature-card">
          <div className="feature-media">
            <MediaImage
              item={item}
              priority={index < 3}
              sizes="(min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw"
            />
          </div>
          <div className="card-copy">
            <p className="card-kicker">Featured frame</p>
            <h3 className="title-md">{item.alt}</h3>
            <Link href={`/${item.category}`} className="chip-link">
              View {item.category.replace('-', ' ')}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
