import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useVisualEffects } from '../hooks/useVisualEffects'

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { enabled } = useVisualEffects()
  const reduced = !enabled
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} animate={reduced ? { opacity: 1, y: 0 } : undefined} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -30px 0px' }} transition={{ duration: enabled ? .55 : 0, delay: enabled ? delay : 0, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
