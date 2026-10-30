import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [...PUBLIC_ROUTES],
        disallow: ['/projects', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
