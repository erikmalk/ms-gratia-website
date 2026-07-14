import React from 'react';
import { CategoryPreviewCard } from '@/components/category-preview-card';
import { PageIntro } from '@/components/page-intro';
import { portfolioCategories } from '@/lib/portfolio';

export default function WorkPage() {
  return (
    <>
      <PageIntro title="Work" />

      <section className="section">
        <div className="container">
          <div className="preview-grid">
            {portfolioCategories.map((category, index) => (
              <CategoryPreviewCard
                key={category.slug}
                href={`/${category.slug}`}
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
