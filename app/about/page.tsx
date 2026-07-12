import type { Metadata } from 'next';
import Link from 'next/link';

import { MediaImage } from '@/components/media-image';
import { PageIntro } from '@/components/page-intro';
import { aboutPortrait, site } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'About',
  description: 'About LA-based makeup and special effects artist MS Gratia.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About"
        title="Artist, collaborator, and problem-solver on set."
        description="A focused practice rooted in film and television, with an eye for character, finish, and collaboration."
        aside={
          <div className="inline-links">
            <Link href="/contact" className="chip-link">
              Get in touch
            </Link>
          </div>
        }
      />
      <section className="section">
        <div className="container about-grid">
          <div className="about-media surface-card">
            <MediaImage item={aboutPortrait} priority sizes="(min-width: 700px) 50vw, 100vw" />
          </div>
          <article className="surface-card">
            <div className="card-copy">
              {site.aboutCopy.map((paragraph) => (
                <p key={paragraph} className="lead">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
