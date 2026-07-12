import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  alignEndContent?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, alignEndContent }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="title-lg">{title}</h2>
      </div>
      <div>
        {description ? <p className="body-copy">{description}</p> : null}
        {alignEndContent}
      </div>
    </div>
  );
}
