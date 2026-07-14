import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.NODE_ENV === 'production' ? '__Host-msgratia-cms' : 'msgratia-cms';
const SESSION_SECONDS = 60 * 60 * 8;

type Session = { expires: number };

const secret = () => process.env.CMS_SESSION_SECRET ?? '';
const routeSecret = () => process.env.CMS_ROUTE_SECRET ?? '';

const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('base64url');

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const isCmsConfigured = () => Boolean(routeSecret() && secret() && process.env.DATABASE_URL);

export const isCmsRoute = (slug: string) => Boolean(routeSecret()) && safeEqual(slug, routeSecret());

export const createCmsSession = async () => {
  const payload: Session = { expires: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const store = await cookies();
  store.set(COOKIE_NAME, `${encoded}.${sign(encoded)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
};

export const hasCmsSession = async () => {
  if (!secret()) return false;
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [encoded, signature] = raw.split('.');
  if (!encoded || !signature || !safeEqual(signature, sign(encoded))) return false;

  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as Session;
    return session.expires > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export const clearCmsSession = async () => {
  (await cookies()).delete(COOKIE_NAME);
};
