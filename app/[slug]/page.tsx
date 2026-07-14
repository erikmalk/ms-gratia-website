import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Gallery } from '@/components/gallery';
import { PageIntro } from '@/components/page-intro';
import { getPortfolioCategory, portfolioCategories } from '@/lib/portfolio';
import { site } from '@/lib/site-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioCategories.map((category) => ({ slug: category.slug }));
}

type CategoryParams = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<CategoryParams> }): Promise<Metadata> {
  const { slug } = await params;

  const category = getPortfolioCategory(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} — ${site.name}`,
      description: category.description,
      url: `/${category.slug}`,
      images: [
        {
          url: category.cover.src,
          width: category.cover.width,
          height: category.cover.height,
          alt: category.cover.alt,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<CategoryParams> }) {
  const { slug } = await params;

  const category = getPortfolioCategory(slug);
  if (!category) notFound();
  return (
    <section className="portfolio-page">
      <PageIntro title={category.title} />
      <Gallery items={category.items} />
    </section>
  );
}
