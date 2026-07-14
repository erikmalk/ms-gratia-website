import React from 'react';
import { Gallery } from '@/components/gallery';
import { featuredHomeMedia } from '@/lib/site-data';
import { getArchivedFilenames } from '@/lib/cms/repository';

export default async function HomePage() {
  const archivedFilenames = await getArchivedFilenames();
  const homeMedia = featuredHomeMedia.filter((item) => !archivedFilenames.has(item.filename));

  return (
    <section className="portfolio-page home-portfolio">
      <div className="portfolio-heading">
        <h1>Gratia</h1>
      </div>
      <Gallery items={homeMedia} />
    </section>
  );
}
