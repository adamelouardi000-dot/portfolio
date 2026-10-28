import { safeHref } from './links'

/** Resolve public files beneath Vite's deployment base; keep external URLs intact. */
export function publicAssetUrl(value: string | null | undefined): string | undefined {
  const safe = safeHref(value)
  if (!safe || !safe.startsWith('/')) return safe
  const base = import.meta.env.BASE_URL
  return safe.startsWith(base) ? safe : `${base}${safe.slice(1)}`
}
