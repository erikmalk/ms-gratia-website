import Link from 'next/link';

import { navigation, site } from '@/lib/site-data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} MS Gratia. Makeup & special effects artistry in Los Angeles.</p>
        <div className="inline-links" aria-label="Footer links">
          <Link href={`mailto:${site.email}`}>{site.email}</Link>
          <Link href={site.instagramUrl} target="_blank" rel="noreferrer">
            {site.instagram}
          </Link>
          <Link href={navigation[5].href}>{navigation[5].label}</Link>
        </div>
      </div>
    </footer>
  );
}
