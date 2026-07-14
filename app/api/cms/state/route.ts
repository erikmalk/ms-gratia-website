import { NextResponse } from 'next/server';
import { hasCmsSession } from '@/lib/cms/auth';
import { getCmsAssets } from '@/lib/cms/repository';
import { enforceRateLimit } from '@/lib/cms/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await hasCmsSession())) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!(await enforceRateLimit(request, 'cms-read', 240, 60))) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  return NextResponse.json({ assets: await getCmsAssets() }, {
    headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
  });
}
