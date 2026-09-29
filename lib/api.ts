import { headers } from 'next/headers';

// Builds an absolute base URL for server-side fetches to our own API routes.
// `headers()` is a Request-time API, so callers must run in a Server Component
// or Route Handler (never a Client Component).
export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host =
    headersList.get('x-forwarded-host') ??
    headersList.get('host') ??
    'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  return `${protocol}://${host}`;
}
