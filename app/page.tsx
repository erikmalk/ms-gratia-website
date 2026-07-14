import React from 'react';
import { HomeCarousel } from '@/components/home-carousel';
import { homeMedia } from '@/lib/portfolio';

export default function HomePage() {
  return (
    <section className="portfolio-page home-portfolio">
      <div className="portfolio-heading">
        <h1>Gratia</h1>
      </div>
      <HomeCarousel items={homeMedia} />
    </section>
  );
}
