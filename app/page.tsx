import React from 'react';
import { HomeCarousel } from '@/components/home-carousel';
import { getHomeMedia } from '@/lib/cms/repository';

export default async function HomePage() {
  const homeMedia = await getHomeMedia();
  return (
    <section className="portfolio-page home-portfolio">
      <div className="portfolio-heading">
        <h1>Gratia</h1>
      </div>
      <HomeCarousel items={homeMedia} />
    </section>
  );
}
