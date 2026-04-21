/**
 * Django builds absolute URLs from the incoming request's host.
 * When Next.js fetches server-side (via BACKEND_URL=http://backend:8000),
 * media URLs come back as http://backend:8000/media/... which the browser
 * can't resolve. This rewrites them to use the public-facing origin.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  const publicBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';
  try {
    const publicOrigin = new URL(publicBase).origin;
    const parsed = new URL(url);
    return publicOrigin + parsed.pathname;
  } catch {
    return url;
  }
}
