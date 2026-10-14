import { motion } from 'framer-motion'
import { cronogramas } from '../data/site'
import { stagger } from './Reveal'
import SectionHeading from './SectionHeading'

const row = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const } } }

export default function Cronogramas() {
  return (
    <section id="cronogramas" className="bg-paper text-night">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-24 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div className="flex flex-col gap-4">
          <SectionHeading eyebrow="Cronogramas" title="Programa del evento" light />
          <p className="m-0 text-[17px] leading-relaxed text-[#4A3D5C]">Descarga el cronograma general o el programa de cada disciplina.</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.06)} className="flex flex-col">
          {cronogramas.map((c) => (
            <motion.a key={c.label} href={c.href} target="_blank" rel="noreferrer" variants={row} whileHover={{ x: 12 }} className="flex items-center justify-between gap-4 border-b border-paper-line px-1 py-[18px] text-night hover:text-rust">
              <span className="font-display text-[21px] font-semibold">{c.label}</span>
              <span className="rounded-full border border-night px-2.5 py-1 text-xs font-semibold tracking-[0.08em]">PDF</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
