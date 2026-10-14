import { animate, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cifras, site } from '../data/site'
import Reveal, { fadeUp, stagger } from './Reveal'

function Count({ value }: { value: number | string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView || typeof value !== 'number') return
    const c = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return <span ref={ref}>{typeof value === 'number' ? n : value}</span>
}

export default function Evento() {
  return (
    <section id="evento" className="mx-auto max-w-[1240px] px-6 py-24">
      <div className="grid gap-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
        <Reveal className="flex flex-col gap-4">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">El evento</span>
          <h2 className="m-0 font-display text-[clamp(36px,5vw,56px)] font-extrabold leading-none tracking-tight text-balance">{site.about.title}</h2>
        </Reveal>
        <div className="flex flex-col gap-8">
          <Reveal delay={0.1}><p className="m-0 text-lg leading-relaxed text-muted text-pretty">{site.about.body}</p></Reveal>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.12)} className="grid grid-cols-3 gap-4">
            {cifras.map((c) => (
              <motion.div key={c.label} variants={fadeUp} className="flex flex-col gap-1 border-t-2 border-gold pt-3.5">
                <span className="font-display text-[44px] font-extrabold"><Count value={c.value} /></span>
                <span className="text-sm text-muted">{c.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
