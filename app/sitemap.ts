import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.5,
  }));
}
