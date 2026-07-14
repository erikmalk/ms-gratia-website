import { Gallery } from '@/components/gallery';
import { featuredHomeMedia } from '@/lib/site-data';

export default function HomePage() {
  return (
    <section className="portfolio-page home-portfolio">
      <div className="portfolio-heading">
        <h1>Gratia</h1>
      </div>
      <Gallery items={featuredHomeMedia} />
    </section>
  );
}
