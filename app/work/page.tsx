import Link from 'next/link';

import { CategoryPreviewCard } from '@/components/category-preview-card';
import { PageIntro } from '@/components/page-intro';
import { SectionHeader } from '@/components/section-header';
import { categories } from '@/lib/site-data';

export default function WorkPage() {
  return (
    <>
      <PageIntro
        eyebrow="Work"
        title="An archive shaped into a clear path."
        description="Browse the portfolio by discipline: polished beauty work, concept-driven creative imagery, and special effects focused on texture, character, and transformation."
        aside={
          <div className="inline-links">
            <Link href="/contact" className="chip-link">
              Book a project
            </Link>
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Portfolio sections"
            title="Choose the lane that matches the brief."
            description="Each section has its own atmosphere and pacing, while keeping the browsing experience lightweight, elegant, and responsive."
          />
          <div className="preview-grid">
            {categories.map((category, index) => (
              <CategoryPreviewCard
                key={category.slug}
                href={`/${category.slug}` as '/beauty' | '/creative' | '/special-effects'}
                title={category.title}
                eyebrow={category.eyebrow}
                description={category.description}
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
