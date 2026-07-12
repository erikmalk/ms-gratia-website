import Link from 'next/link';

import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

type CategoryPreviewCardProps = {
  href: '/beauty' | '/creative' | '/special-effects' | '/work';
  title: string;
  eyebrow: string;
  description: string;
  image: MediaItem;
  priority?: boolean;
};

export function CategoryPreviewCard({ href, title, eyebrow, description, image, priority = false }: CategoryPreviewCardProps) {
  return (
    <article className="category-card">
      <div className="category-card-media">
        <MediaImage item={image} priority={priority} sizes="(min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw" />
      </div>
      <div className="card-copy">
        <p className="card-kicker">{eyebrow}</p>
        <h3 className="title-md">{title}</h3>
        <p className="body-copy">{description}</p>
        <Link href={href} className="chip-link">
          Explore
        </Link>
      </div>
    </article>
  );
}
