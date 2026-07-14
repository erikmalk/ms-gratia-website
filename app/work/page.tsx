import React from 'react';
import { CategoryPreviewCard } from '@/components/category-preview-card';
import { PageIntro } from '@/components/page-intro';
import { categories } from '@/lib/site-data';
import { getPublicCategories } from '@/lib/cms/repository';

export default async function WorkPage() {
  const publicCategories = await getPublicCategories(categories);

  return (
    <>
      <PageIntro title="Work" />

      <section className="section">
        <div className="container">
          <div className="preview-grid">
            {publicCategories.map((category, index) => (
              <CategoryPreviewCard
                key={category.slug}
                href={`/${category.slug}` as `/${typeof category.slug}`}
                title={category.title}
                image={category.cover}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
