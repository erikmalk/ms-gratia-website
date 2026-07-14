import Link from 'next/link';

import { heroVideo } from '@/lib/site-data';

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-copy">
        <p className="eyebrow">Los Angeles makeup & special effects artist</p>
        <h1 className="display">Beauty. Character. Transformation.</h1>
        <div className="hero-actions">
          <Link href="/work" className="primary-link">
            View work
          </Link>
          <Link href="/contact" className="ghost-link">
            Contact
          </Link>
        </div>
      </div>

      <div className="hero-media">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/sweatpants-video-frame.webp"
          aria-label="MS Gratia makeup and special effects showreel"
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
