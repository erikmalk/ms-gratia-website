import { CategoryPreviewCard } from '@/components/category-preview-card';
import { PageIntro } from '@/components/page-intro';
import { categories } from '@/lib/site-data';

export default function WorkPage() {
  return (
    <>
      <PageIntro title="Work" />

      <section className="section">
        <div className="container">
          <div className="preview-grid">
            {categories.map((category, index) => (
              <CategoryPreviewCard
                key={category.slug}
                href={`/${category.slug}` as '/beauty' | '/creative' | '/special-effects'}
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
