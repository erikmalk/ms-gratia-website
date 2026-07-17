import type { Metadata } from 'next';
import React from 'react';

import { HomeCarousel } from '@/components/home-carousel';
import { getHomeMedia } from '@/lib/cms/repository';
import { site } from '@/lib/site-data';

export async function generateMetadata(): Promise<Metadata> {
  const [firstImage] = await getHomeMedia();
  if (!firstImage) return {};

  return {
    openGraph: {
      type: 'website',
      url: site.url,
      title: site.title,
      description: site.description,
      siteName: site.name,
      images: [
        {
          url: firstImage.src,
          width: firstImage.width,
          height: firstImage.height,
          alt: firstImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.title,
      description: site.description,
      images: [firstImage.src],
    },
  };
}

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
