import { NextResponse } from 'next/server';
import { createCmsSession, isCmsConfigured, isCmsRoute } from '@/lib/cms/auth';
import { enforceRateLimit } from '@/lib/cms/rate-limit';

export async function POST(request: Request) {
  if (!isCmsConfigured()) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!(await enforceRateLimit(request, 'cms-login', 10, 900))) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 });
  }

  const payload = (await request.json().catch(() => null)) as { slug?: unknown } | null;
  if (!payload || typeof payload.slug !== 'string' || !isCmsRoute(payload.slug)) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  await createCmsSession();
  return NextResponse.json({ ok: true });
}
