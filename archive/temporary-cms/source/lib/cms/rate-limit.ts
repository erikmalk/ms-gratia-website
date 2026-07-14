import { createHmac } from 'node:crypto';
import { getSql } from '@/lib/cms/db';

export const enforceRateLimit = async (request: Request, scope: string, limit = 120, windowSeconds = 60) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const secret = process.env.CMS_SESSION_SECRET ?? 'local-development';
  const key = createHmac('sha256', secret).update(`${scope}:${ip}`).digest('hex');
  const sql = getSql();
  const rows = await sql<{ allowed: boolean }[]>`
    insert into cms_rate_limits (key, window_started_at, request_count)
    values (${key}, now(), 1)
    on conflict (key) do update set
      window_started_at = case
        when cms_rate_limits.window_started_at < now() - (${windowSeconds} * interval '1 second') then now()
        else cms_rate_limits.window_started_at
      end,
      request_count = case
        when cms_rate_limits.window_started_at < now() - (${windowSeconds} * interval '1 second') then 1
        else cms_rate_limits.request_count + 1
      end
    returning request_count <= ${limit} as allowed
  `;
  return rows[0]?.allowed ?? false;
};
