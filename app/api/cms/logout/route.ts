import { NextResponse } from 'next/server';
import { clearCmsSession } from '@/lib/cms/auth';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  }
  await clearCmsSession();
  return NextResponse.json({ ok: true });
}
