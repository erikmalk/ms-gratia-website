import Link from 'next/link';

import { heroVideo, site } from '@/lib/site-data';

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Los Angeles makeup & special effects artist</p>
          <h1 className="display">Editorial beauty. Character transformation. Camera-ready craft.</h1>
          <p className="lead">
            Gratia creates makeup, prosthetic, and special effects work for film, television, music, and editorial projects—melding refined beauty with tactile transformation.
          </p>
          <div className="hero-actions">
            <Link href="/work" className="primary-link">
              View selected work
            </Link>
            <Link href="/contact" className="ghost-link">
              Start a project
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
            poster="/media/painted-body-profile.webp"
            aria-label="Showreel montage"
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
          <div className="hero-overlay">
            <div>
              <p className="kicker">Showreel</p>
              <div className="stat-value">{Math.round(heroVideo.durationSeconds ?? 51)} sec motion edit</div>
            </div>
            <Link href={`mailto:${site.email}`} className="chip-link">
              Book now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
