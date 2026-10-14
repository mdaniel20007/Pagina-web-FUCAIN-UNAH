import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const ease = [0.2, 0.8, 0.2, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export const stagger = (s = 0.08): Variants => ({ hidden: {}, show: { transition: { staggerChildren: s } } })

export default function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ hidden: fadeUp.hidden, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay } } }}
    >
      {children}
    </motion.div>
  )
}
