'use client';

import { FormEvent, useMemo, useState } from 'react';

import { site } from '@/lib/site-data';

type ContactFormProps = {
  canUseApi: boolean;
};

type Status =
  | { type: 'idle'; message: string }
  | { type: 'submitting'; message: string }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const initialStatus: Status = {
  type: 'idle',
  message: '',
};

export function ContactForm({ canUseApi }: ContactFormProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const fallbackHref = useMemo(
    () =>
      `mailto:${site.email}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(
        'Hi Gratia,\n\nI would love to collaborate on...\n\nName:\nCompany:\nTimeline:\nBudget:\n',
      )}`,
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!canUseApi) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus({ type: 'submitting', message: 'Sending your message…' });

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        message: formData.get('message'),
      }),
    });

    const result = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;

    if (!response.ok || !result?.ok) {
      setStatus({ type: 'error', message: result?.error ?? 'Something went wrong. Please email me directly instead.' });
      return;
    }

    event.currentTarget.reset();
    setStatus({ type: 'success', message: 'Thanks—your message is on its way. I will be in touch soon.' });
  };

  return (
    <form className="contact-card" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Project inquiries</p>
        <h2 className="title-lg">Let&apos;s make something unforgettable.</h2>
      </div>

      <div className="form-row">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input className="input" id="name" name="name" autoComplete="name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="input" id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="company">
          Company / Production
        </label>
        <input className="input" id="company" name="company" autoComplete="organization" />
      </div>

      <div>
        <label className="label" htmlFor="message">
          Project details
        </label>
        <textarea className="textarea" id="message" name="message" required />
      </div>

      <div className="form-actions">
        {canUseApi ? (
          <button type="submit" className="button">
            Send inquiry
          </button>
        ) : (
          <a href={fallbackHref} className="button">
            Email via mail app
          </a>
        )}
      </div>

      {status.message ? (
        <p className="form-status" data-state={status.type === 'idle' ? undefined : status.type}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
