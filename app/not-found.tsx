import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container surface-card">
        <div className="card-copy">
          <p className="eyebrow">404</p>
          <h1 className="title-xl">That page is not in the portfolio.</h1>
          <p className="lead">Try returning home or browsing the work archive instead.</p>
          <div className="inline-links">
            <Link href="/" className="button">
              Go home
            </Link>
            <Link href="/work" className="ghost-link">
              View work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
