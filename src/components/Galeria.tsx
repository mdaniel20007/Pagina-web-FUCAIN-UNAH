import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { fotos } from '../data/galeria'
import { stagger } from './Reveal'
import SectionHeading from './SectionHeading'
import ImageBox from './ImageBox'

const tile = { hidden: { opacity: 0, scale: 0.85, y: 40 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const } } }
const spans = ['row-span-2', '', '', 'sm:col-span-2']

/** Vista previa en la portada: 4 fotos + enlace a /galeria */
export default function Galeria() {
  const preview = Array.from({ length: 4 }, (_, i) => fotos[i])
  return (
    <section id="galeria" className="mx-auto max-w-[1240px] px-6 py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Galería" title="Momentos de Fucain" />
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
          <Link to="/galeria" className="inline-block rounded-full bg-gold px-6 py-3.5 font-semibold text-night hover:bg-gold-soft hover:text-night">Ver galería completa →</Link>
        </motion.div>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger(0.08)} className="grid grid-flow-dense auto-rows-[240px] gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))]">
        {preview.map((p, i) => (
          <motion.div key={i} variants={tile} whileHover={{ scale: 1.03 }} className={`min-w-0 overflow-hidden rounded-2xl ${spans[i]}`}>
            <Link to="/galeria" className="block h-full">
              <ImageBox src={p?.src} alt={p?.alt ?? 'Foto de galería'} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
