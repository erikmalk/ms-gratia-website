import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Gallery } from '@/components/gallery';
import { PageIntro } from '@/components/page-intro';
import { CmsEntry } from '@/components/cms/cms-entry';
import { hasCmsSession, isCmsConfigured, isCmsRoute } from '@/lib/cms/auth';
import { getPublicCategory } from '@/lib/cms/repository';
import { site } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

type CategoryParams = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<CategoryParams> }): Promise<Metadata> {
  const { slug } = await params;

  if (isCmsRoute(slug)) {
    return {
      title: 'Content manager',
      robots: { index: false, follow: false, noarchive: true },
      referrer: 'no-referrer',
    };
  }

  const category = await getPublicCategory(slug);
  if (!category) return {};

  const [firstImage] = category.items;
  if (!firstImage) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${category.title} — ${site.name}`,
      description: category.description,
      url: `/${category.slug}`,
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
      title: `${category.title} — ${site.name}`,
      description: category.description,
      images: [firstImage.src],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<CategoryParams> }) {
  const { slug } = await params;

  if (isCmsRoute(slug)) {
    if (!isCmsConfigured()) notFound();
    return <CmsEntry slug={slug} authenticated={await hasCmsSession()} />;
  }

  const category = await getPublicCategory(slug);
  if (!category) notFound();
  return (
    <section className="portfolio-page">
      <PageIntro title={category.title} />
      <Gallery items={category.items} />
    </section>
  );
}
