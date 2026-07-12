import type { Metadata } from 'next';
import Link from 'next/link';

import { ContactForm } from '@/components/contact-form';
import { MediaImage } from '@/components/media-image';
import { PageIntro } from '@/components/page-intro';
import { contactImage, site } from '@/lib/site-data';
import { formatPhoneHref } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact MS Gratia for makeup, beauty, and special effects project inquiries.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const canUseApi = Boolean(process.env.RESEND_API_KEY);

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Open for film, TV, editorial, music, and branded collaborations."
        description="Reach out with project details, production timing, and creative goals. If form delivery is not configured, the site falls back gracefully to direct email."
      />
      <section className="section">
        <div className="container contact-grid">
          <ContactForm canUseApi={canUseApi} />
          <aside className="contact-card">
            <div className="contact-media">
              <MediaImage item={contactImage} priority sizes="(min-width: 700px) 50vw, 100vw" />
            </div>
            <div className="card-copy">
              <div>
                <p className="card-kicker">Email</p>
                <Link href={`mailto:${site.email}`} className="title-md">
                  {site.email}
                </Link>
              </div>
              <div>
                <p className="card-kicker">Phone</p>
                <Link href={formatPhoneHref(site.phone)} className="title-md">
                  {site.phone}
                </Link>
              </div>
              <div>
                <p className="card-kicker">Instagram</p>
                <Link href={site.instagramUrl} target="_blank" rel="noreferrer" className="title-md">
                  {site.instagram}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
