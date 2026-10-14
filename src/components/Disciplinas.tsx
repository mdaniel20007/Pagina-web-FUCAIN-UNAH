import { motion } from 'framer-motion'
import { disciplinas } from '../data/site'
import { fadeUp, stagger } from './Reveal'
import SectionHeading from './SectionHeading'
import ImageBox from './ImageBox'

export default function Disciplinas() {
  return (
    <section id="disciplinas" className="mx-auto max-w-[1240px] px-6 pb-24">
      <div className="mb-8"><SectionHeading eyebrow="Disciplinas" title={`${disciplinas.length === 6 ? 'Seis' : disciplinas.length} categorías`} /></div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger(0.1)} className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))]">
        {disciplinas.map((d, i) => (
          <motion.a
            key={d.slug}
            href="#cronogramas"
            variants={fadeUp}
            whileHover={{ y: -8, rotate: i % 2 ? 0.8 : -0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group flex flex-col gap-3.5 rounded-[20px] border border-line bg-night-2 p-3.5 text-ink hover:border-gold hover:text-ink"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                <ImageBox src={d.image} alt={`Foto ${d.name.toLowerCase()}`} />
              </div>
            </div>
            <div className="flex items-center justify-between px-1.5 pb-1.5 pt-1">
              <span className="font-display text-2xl font-semibold">{d.name}</span>
              <span className="text-[13px] font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
