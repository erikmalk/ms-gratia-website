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
        title="Selected credits"
        description="Film, television, music, and commercial work."
      />
      <section className="section">
        <div className="container">
          <CreditGrid items={credits} />
        </div>
      </section>
    </>
  );
}
