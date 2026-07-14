import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Gallery } from '@/components/gallery';
import { PageIntro } from '@/components/page-intro';
import { getCategory, site } from '@/lib/site-data';

const validSlugs = ['beauty', 'creative', 'special-effects'] as const;

type CategoryParams = {
  slug: (typeof validSlugs)[number];
};

export function generateStaticParams(): CategoryParams[] {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<CategoryParams> }): Promise<Metadata> {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    return {};
  }

  const category = getCategory(slug);

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

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const category = getCategory(slug);
  return (
    <section className="portfolio-page">
      <PageIntro title={category.title} />
      <Gallery items={category.items} />
    </section>
  );
}
