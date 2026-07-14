import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

export function Gallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="portfolio-feed">
      <div className="portfolio-stage">
        {items.map((item, index) => {
          const isTall = item.height / item.width > 1.5;

          return (
            <figure key={item.id} className={isTall ? 'portfolio-image is-tall' : 'portfolio-image'}>
              <MediaImage item={item} priority={index < 3} sizes="(min-width: 760px) 1200px, calc(100vw - 40px)" />
            </figure>
          );
        })}
      </div>
    </div>
  );
}
