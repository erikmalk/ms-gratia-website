import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

type CreditItem = {
  title: string;
  role: string;
  image?: MediaItem;
};

export function CreditGrid({ items }: { items: readonly CreditItem[] }) {
  return (
    <div className="credit-grid">
      {items.map((item, index) => (
        <article key={item.title} className="credit-card">
          {item.image ? (
            <div className="credit-media">
              <MediaImage
                item={item.image}
                priority={index < 3}
                sizes="(min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw"
              />
            </div>
          ) : null}
          <div className="card-copy">
            <p className="card-kicker">Selected credit</p>
            <h3 className="title-md">{item.title}</h3>
            <p className="body-copy">{item.role}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
