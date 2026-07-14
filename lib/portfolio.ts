import snapshot from '@/assets/portfolio-state.json';
import type { MediaItem } from '@/lib/site-data';
import { mediaByFilename } from '@/lib/site-data';

type SnapshotCategory = {
  slug: string;
  title: string;
  description: string;
  displayOrder: number;
  coverFilename: string;
  archived: boolean;
  isHome: boolean;
  filenames: string[];
};

export type PortfolioCategory = {
  slug: string;
  title: string;
  description: string;
  cover: MediaItem;
  items: MediaItem[];
};

export type NavigationItem = { href: string; label: string };

const snapshotCategories = (snapshot.categories as SnapshotCategory[])
  .slice()
  .sort((left, right) => left.displayOrder - right.displayOrder);

const resolveMedia = (filenames: string[]) =>
  filenames.map((filename) => mediaByFilename(filename)).filter((item): item is MediaItem => Boolean(item));

const toCategory = (category: SnapshotCategory): PortfolioCategory | undefined => {
  const items = resolveMedia(category.filenames);
  if (!items.length) return undefined;
  const cover = mediaByFilename(category.coverFilename) ?? items[0];
  return { slug: category.slug, title: category.title, description: category.description, cover, items };
};

export const portfolioCategories = snapshotCategories
  .filter((category) => !category.archived && !category.isHome)
  .map(toCategory)
  .filter((category): category is PortfolioCategory => Boolean(category));

export const homeMedia = resolveMedia(snapshotCategories.find((category) => category.isHome)?.filenames ?? []);

export const navigation: NavigationItem[] = [
  ...portfolioCategories.map((category) => ({ href: `/${category.slug}`, label: category.title })),
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const getPortfolioCategory = (slug: string) =>
  portfolioCategories.find((category) => category.slug === slug);
