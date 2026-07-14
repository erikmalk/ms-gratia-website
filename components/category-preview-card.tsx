import Link from 'next/link';

import { MediaImage } from '@/components/media-image';
import type { MediaItem } from '@/lib/site-data';

type CategoryPreviewCardProps = {
  href: '/celebrity' | '/beauty' | '/editorial' | '/advertising' | '/film' | '/sfx' | '/work';
  title: string;
  image: MediaItem;
  priority?: boolean;
};

export function CategoryPreviewCard({ href, title, image, priority = false }: CategoryPreviewCardProps) {
  return (
    <Link href={href} className="category-card">
      <div className="category-card-media">
        <MediaImage item={image} priority={priority} sizes="(min-width: 980px) 33vw, (min-width: 700px) 50vw, 100vw" />
      </div>
      <h3 className="title-md">{title}</h3>
    </Link>
  );
}
