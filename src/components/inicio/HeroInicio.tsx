import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { heroSlides, inicio } from '../../data/inicio'
import { BTN_GOLD, Confetti, Destello, EASE, Foto, PapelPicado } from './fx'

const RAYA = ['#FBC102', '#66B32F', '#85328A', '#7ECBE3', '#12AC9C', '#E84E2B', '#F5A12F']

/** Entrada escalonada: subida + desenfoque. */
const entra = (i: number) => ({
  initial: { opacity: 0, y: 48, scale: 0.96, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 1.2, delay: 0.26 + i * 0.14, ease: EASE },
})

export default function HeroInicio() {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute -left-[200px] top-[140px] size-[520px] rounded-full bg-fc-yellow opacity-20 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -right-[180px] top-[220px] size-[480px] rounded-full bg-fc-purple opacity-[.14] blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-[240px] left-[35%] size-[520px] rounded-full bg-fc-teal opacity-[.14] blur-[100px]" />

      <Confetti seed={7} n={24} big burst={36} fall="vh" />
      <div className="md:hidden"><PapelPicado count={16} /></div>
      <div className="hidden md:block"><PapelPicado count={30} /></div>
      <Destello spin={40} className="left-[6%] top-[42%] z-[2] w-14 md:w-24" />
      <Destello spin={-55} className="right-[7%] top-[30%] z-[2] w-11 md:w-[72px]" />

      <div className="pointer-events-none relative z-[3] mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[22px] px-6 pb-11 pt-[190px] text-center md:pt-[210px]">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '.8em', filter: 'blur(6px)' }}
          animate={{ opacity: 1, letterSpacing: '.3em', filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
          className="text-xs font-black tracking-[0.3em] text-fc-red"
        >
          {inicio.eyebrow}
        </motion.span>
        <h1 className="fc-display m-0 flex flex-col items-center text-balance text-[clamp(44px,9vw,104px)] leading-[.92] text-fc-navy">
          {inicio.titulo.map((t, i) => (
            <motion.span key={t} className="block" {...entra(i)}>
              {t}
            </motion.span>
          ))}
        </h1>
        <motion.div
          {...entra(2)}
          className="fx-shimmer bg-clip-text font-display text-[clamp(22px,3.4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.01em] text-transparent"
          style={{ backgroundImage: 'linear-gradient(90deg,#C9391A 0%,#85328A 25%,#0E8A7D 50%,#85328A 75%,#C9391A 100%)', backgroundSize: '200% 100%' }}
        >
          {inicio.subtitulo}
        </motion.div>
        <motion.div {...entra(3)} className="pointer-events-auto mt-3.5 flex w-full flex-col items-center justify-center gap-3.5 md:w-auto md:flex-row">
          <a href="#programacion" className={`${BTN_GOLD} w-full md:w-auto`}>
            Ver programación <span>→</span>
          </a>
          <Link
            to="/galeria"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-fc-navy bg-white px-8 py-4 text-base font-bold text-fc-navy transition-[transform,background-color,color] duration-[400ms] fc-ease hover:scale-[1.04] hover:bg-fc-navy hover:text-white md:w-auto"
          >
            Explorar galería
          </Link>
        </motion.div>
      </div>

      <motion.div
        {...entra(4)}
        className="relative z-[3] mx-auto mb-14 h-[300px] w-[calc(100%-48px)] max-w-[1280px] overflow-hidden rounded-[32px] shadow-[0_40px_80px_-40px_rgba(11,22,49,.55)] md:h-[min(56vh,560px)]"
      >
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden transition-opacity duration-[1600ms] fc-ease"
            style={{ opacity: slide === i ? 1 : 0, background: s.bg }}
            aria-hidden={slide !== i}
          >
            <Foto src={s.image} alt={s.alt} style={{ animation: `${i % 2 ? 'fxKenBurnsB' : 'fxKenBurnsA'} ${16 + i * 2.5}s ease-in-out infinite alternate` }} />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2">
          {RAYA.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
