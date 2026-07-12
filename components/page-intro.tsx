import type { ReactNode } from 'react';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <section className="section section-compact">
      <div className="container section-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="title-xl">{title}</h1>
        </div>
        <div>
          <p className="lead">{description}</p>
          {aside}
        </div>
      </div>
    </section>
  );
}
