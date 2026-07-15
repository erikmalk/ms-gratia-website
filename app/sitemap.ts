import type { MetadataRoute } from 'next';

import { routeList, site } from '@/lib/site-data';
import { getPublicCategories } from '@/lib/cms/repository';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getPublicCategories();
  const routes = [...routeList, ...categories.map((category) => `/${category.slug}`)];
  return routes.map((route) => ({
    url: `${site.url}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/work' ? 0.9 : 0.8,
  }));
}
