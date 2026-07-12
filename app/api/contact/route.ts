import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { site } from '@/lib/site-data';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sanitize = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!payload) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const name = sanitize(payload.name);
  const email = sanitize(payload.email);
  const company = sanitize(payload.company);
  const message = sanitize(payload.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and project details are required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json({ error: 'Email delivery is not configured on this deployment.' }, { status: 503 });
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'MS Gratia <onboarding@resend.dev>',
    to: [site.email],
    replyTo: email,
    subject: `Portfolio inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company / Production: ${company || 'Not provided'}`,
      '',
      'Project details:',
      message,
    ].join('\n'),
  });

  return NextResponse.json({ ok: true });
}
