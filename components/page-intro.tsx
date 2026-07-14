import type { ReactNode } from 'react';

type PageIntroProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function PageIntro({ title, description, aside }: PageIntroProps) {
  return (
    <header className="portfolio-heading">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {aside}
    </header>
  );
}
