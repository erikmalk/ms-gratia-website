import type { MetadataRoute } from 'next';

import { routeList, site } from '@/lib/site-data';
import { portfolioCategories } from '@/lib/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...routeList, ...portfolioCategories.map((category) => `/${category.slug}`)];
  return routes.map((route) => ({
    url: `${site.url}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/work' ? 0.9 : 0.8,
  }));
}
