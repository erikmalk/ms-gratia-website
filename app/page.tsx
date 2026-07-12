import Link from 'next/link';

import { CategoryPreviewCard } from '@/components/category-preview-card';
import { CreditGrid } from '@/components/credit-grid';
import { FeaturedMediaGrid } from '@/components/featured-media-grid';
import { Hero } from '@/components/hero';
import { SectionHeader } from '@/components/section-header';
import { categories, featuredCredits, featuredHomeMedia, site } from '@/lib/site-data';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Selected work"
            title="A focused first impression."
            description="The homepage highlights only a small edit of standout imagery—editorial beauty, concept-driven frames, and textured special effects—before the deeper galleries open up by category."
          />
          <FeaturedMediaGrid items={featuredHomeMedia} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Core practices"
            title="Three distinct lanes, one considered point of view."
            description="Beauty, creative, and special effects each get their own immersive gallery while still feeling connected through tonal restraint and image-led storytelling."
            alignEndContent={
              <div className="inline-links">
                <Link href="/work" className="ghost-link">
                  Browse all work
                </Link>
              </div>
            }
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

      <section className="section">
        <div className="container split-grid">
          <article className="metrics-card">
            <p className="eyebrow">Practice</p>
            <h2 className="title-lg">From editorial polish to full transformation.</h2>
            <p className="body-copy">
              {site.name} works across production formats with a strong eye for texture, silhouette, finish, and how makeup reads through a lens.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{site.totalAssets}+</div>
                <div className="stat-label">Optimized portfolio assets</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">3</div>
                <div className="stat-label">Primary portfolio categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">LA</div>
                <div className="stat-label">Based in Los Angeles</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">Film / TV</div>
                <div className="stat-label">Production specialization</div>
              </div>
            </div>
          </article>

          <article className="quote-card">
            <p className="eyebrow">Approach</p>
            <h2 className="title-lg">Elegant image-making anchored in craft.</h2>
            <p className="lead">
              Whether the goal is polished beauty, stylized character, or tactile prosthetic realism, every look is built to feel intentional, cinematic, and collaboration-ready.
            </p>
            <div className="hero-actions">
              <Link href="/about" className="chip-link">
                Read about Gratia
              </Link>
              <Link href="/contact" className="chip-link">
                Get in touch
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Selected credits"
            title="Production work across film, television, music, and branded projects."
            description="A concise selection of known credits from the public site, paired where possible with matching media from the archive."
            alignEndContent={
              <div className="inline-links">
                <Link href="/credits" className="ghost-link">
                  View full credits
                </Link>
              </div>
            }
          />
          <CreditGrid items={featuredCredits} />
        </div>
      </section>
    </>
  );
}
