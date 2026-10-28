import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

// Brand marks are kept local; Lucide supplies the interface icons.
export function Github({ size = 16, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.7-1.6 6.7-7.3a5.7 5.7 0 0 0-1.5-3.9 5.3 5.3 0 0 0-.1-3.9S17.9 0 15 1.9a13.4 13.4 0 0 0-6 0C6.1 0 4.8.4 4.8.4a5.3 5.3 0 0 0-.1 3.9A5.7 5.7 0 0 0 3.2 8c0 5.7 3.4 6.9 6.7 7.3A3.4 3.4 0 0 0 9 18v4" transform="translate(0 1) scale(.95)" />
  </svg>
}

export function Linkedin({ size = 16, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v7M7.5 7v.1M11.5 17.5v-7m0 3a3 3 0 0 1 6 0v4" />
  </svg>
}
