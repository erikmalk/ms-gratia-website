import Link from 'next/link';

import { site } from '@/lib/site-data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} MS Gratia</p>
        <div className="inline-links" aria-label="Footer links">
          <Link href={`mailto:${site.email}`}>{site.email}</Link>
          <Link href={site.instagramUrl} target="_blank" rel="noreferrer">
            {site.instagram}
          </Link>
          <Link href={site.workInstagramUrl} target="_blank" rel="noreferrer">
            {site.workInstagram}
          </Link>
        </div>
      </div>
    </footer>
  );
}
