import { motion } from 'framer-motion'
import { patrocinadores } from '../data/site'
import { fadeUp, stagger } from './Reveal'
import SectionHeading from './SectionHeading'

export default function Patrocinadores() {
  return (
    <section id="patrocinadores" className="mx-auto max-w-[1240px] px-6 pb-24">
      <div className="mb-8"><SectionHeading eyebrow="Patrocinadores" title="Con el apoyo de" /></div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.05)} className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line [grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr))]">
        {patrocinadores.map((p) => (
          <motion.a key={p.name} href={p.href} variants={fadeUp} className="group flex h-[140px] items-center justify-center bg-night p-7 text-muted hover:bg-night-2 hover:text-ink">
            {p.logo ? (
              <img src={p.logo} alt={p.name} className="max-h-[72px] w-auto opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
            ) : (
              <span className="font-display text-lg font-semibold">{p.name}</span>
            )}
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
