export function safeHref(value: string | null | undefined): string | undefined {
  if (!value || value.trim() !== value) return undefined
  if (value.startsWith('/') && !value.startsWith('//') && !Array.from(value).some(char => char === '\\' || char.charCodeAt(0) <= 32)) return value
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href
  } catch { /* Missing or invalid configuration is rendered as unavailable. */ }
  return undefined
}
