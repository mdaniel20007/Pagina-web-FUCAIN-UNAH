import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { site } from '../data/site'
import { ease } from './Reveal'
import ImageBox from './ImageBox'

const word = { hidden: { y: '110%' }, show: (i: number) => ({ y: '0%', transition: { duration: 0.9, ease, delay: 0.15 + i * 0.12 } }) }

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgRotate = useTransform(scrollYProgress, [0, 1], [2, -4])

  return (
    <section ref={ref} className="mx-auto max-w-[1240px] px-6 pb-14 pt-[72px]">
      <div className="grid items-center gap-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
        <div className="flex flex-col gap-6">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">
            {site.name}
          </motion.span>
          <h1 className="m-0 font-display text-[clamp(56px,9vw,124px)] font-extrabold leading-[0.9] tracking-tight">
            {['FUCAIN', '2027'].map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span custom={i} variants={word} initial="hidden" animate="show" className={`block ${i === 1 ? 'text-gold' : ''}`}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease }} className="flex flex-col gap-6">
            <p className="m-0 max-w-[520px] text-[19px] leading-normal text-muted text-pretty">{site.tagline}</p>
            <div className="flex flex-wrap gap-8 border-t border-line pt-2">
              {[['Fechas', site.dates], ['Sede', site.venue]].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 pt-4">
                  <span className="text-xs uppercase tracking-[0.1em] text-muted">{k}</span>
                  <span className="font-display text-[22px] font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} href="#cronogramas" className="rounded-full bg-gold px-6 py-3.5 font-semibold text-night hover:bg-gold-soft hover:text-night">Ver cronogramas</motion.a>
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} href="/galeria" className="rounded-full border border-line-strong px-6 py-3.5 font-semibold text-ink hover:border-gold hover:text-ink">Galería</motion.a>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          style={{ y: imgY, rotate: imgRotate }}
          className="aspect-[4/5] w-full overflow-hidden rounded-3xl"
        >
          <ImageBox src={site.heroImage} alt="Foto principal de Fucain" />
        </motion.div>
      </div>
    </section>
  )
}
