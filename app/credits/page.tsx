import type { Metadata } from 'next';

import { CreditGrid } from '@/components/credit-grid';
import { PageIntro } from '@/components/page-intro';
import { credits } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Credits / Resume',
  description: 'Selected film, television, music, and brand credits for makeup and special effects artist MS Gratia.',
  alternates: {
    canonical: '/credits',
  },
};

export default function CreditsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Credits / Resume"
        title="Known public-site credits."
        description="A concise production résumé spanning feature film, television, music, and branded work, with matching archive imagery used where filenames clearly align."
        aside={<p className="muted-text">Additional résumé details can be shared directly upon request.</p>}
      />
      <section className="section">
        <div className="container">
          <CreditGrid items={credits} />
        </div>
      </section>
    </>
  );
}
