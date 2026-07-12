import type { MetadataRoute } from 'next';

import { routeList, site } from '@/lib/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  return routeList.map((route) => ({
    url: `${site.url}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/work' ? 0.9 : 0.8,
  }));
}
