import { motion } from 'framer-motion'
import { disciplinas } from '../data/site'

export default function Marquee({ duration = 30 }: { duration?: number }) {
  const row = (
    <div className="flex shrink-0 gap-12 pr-12">
      {disciplinas.map((d) => (
        <span key={d.slug} className="flex items-center gap-12">{d.name}<span>✦</span></span>
      ))}
    </div>
  )
  return (
    <div className="overflow-hidden border-y border-line bg-gold text-night">
      <motion.div
        className="flex w-max whitespace-nowrap py-[18px] font-display text-[28px] font-extrabold"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  )
}
