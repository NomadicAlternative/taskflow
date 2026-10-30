// Single source of truth for site-wide metadata. Pages and the root layout
// read from here so the site name and description stay consistent everywhere,
// and so Open Graph previews never drift from the real page title.

export const SITE_NAME = 'TaskFlow';

export const SITE_DESCRIPTION =
  'Organize your projects and tasks in one place.';

// Canonical origin. Used for the sitemap and robots so both always point at the
// stable production alias rather than a per-deployment hostname.
export const SITE_URL = 'https://taskflow-ivory-alpha-23.vercel.app';

// Pages that are public and worth indexing. Everything else requires auth.
export const PUBLIC_ROUTES = ['/', '/login', '/signup'] as const;
