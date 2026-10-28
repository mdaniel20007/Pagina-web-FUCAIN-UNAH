import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { categorias, centros, contadores, galeriaInicio, slides, universidades } from '../../data/inicio'
import PosterCard, { GLASS_BTN } from './PosterCard'
import { BTN_GOLD, Confetti, Destello, Eyebrow, Foto, Reveal, SectionTitle } from './fx'

/* ───────── 02 · Programación ───────── */
export function Programacion() {
  return (
    <section id="programacion" className="bg-white pt-24">
      <Reveal className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 text-center">
        <Eyebrow color="#C9391A">PROGRAMACIÓN 2026</Eyebrow>
        <SectionTitle>Elige tu escenario</SectionTitle>
        <p className="m-0 max-w-[560px] text-[17px] leading-[1.65] text-fc-navy/72">
          Tres cronogramas, decenas de presentaciones. Consulta horarios, sedes y participantes por disciplina.
        </p>
      </Reveal>
      <Reveal className="mt-14 grid grid-cols-1 md:grid-cols-3">
        {categorias.map((c) => (
          <PosterCard
            key={c.slug}
            tag={`CRONOGRAMA ${c.numero}`}
            titulo={c.label}
            desc={c.descripcion}
            base={c.base}
            overlay={c.overlay}
            shade={c.shade}
            image={c.image}
            action={
              <Link to={`/cronograma/${c.slug}`} className={GLASS_BTN}>
                Ver cronograma <span>→</span>
              </Link>
            }
          />
        ))}
      </Reveal>
    </section>
  )
}

/* ───────── 03 · Contadores ───────── */
const ICONOS: Record<string, string> = {
  mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8',
  ticket: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM15 7v10',
  pin: 'M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
  calendar: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4',
}

export function Contadores() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setP(1)
    let raf = 0
    const t0 = performance.now()
    const D = 1900
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / D)
      setP(k === 1 ? 1 : 1 - Math.pow(2, -10 * k))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  return (
    <section id="contadores" ref={ref} className="relative overflow-hidden bg-white pt-14">
      <Confetti seed={31} n={12} z={1} op={0.7} />
      <Reveal className="relative z-[2] mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 pb-14 text-center">
        <Eyebrow color="#0E8A7D">FUCAIN EN NÚMEROS</Eyebrow>
        <SectionTitle>Una universidad que se expresa</SectionTitle>
      </Reveal>
      <div className="relative z-[2] grid grid-cols-2 md:grid-cols-4">
        {contadores.map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-2.5 px-4 py-9 text-center md:px-6 md:py-14" style={{ background: c.bg, color: c.fg }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={ICONOS[c.icon]} />
            </svg>
            <div className="fc-display text-5xl leading-none tracking-[-0.02em] tabular-nums md:text-[clamp(56px,6.4vw,88px)]">
              {Math.round(c.valor * p).toLocaleString('es-HN')}
              {c.sufijo}
            </div>
            <span className="text-xs font-extrabold tracking-[0.22em]">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────── 04 · Galería (carrusel) ───────── */
export function GaleriaSlider() {
  const [gi, setGi] = useState(0)
  const go = (i: number) => setGi((i + slides.length) % slides.length)
  const touch = useRef<number | null>(null)

  return (
    <section id="galeria" className="flex min-h-svh flex-col justify-center bg-white px-6 pb-24 pt-[72px]">
      <Reveal className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 text-center">
        <Eyebrow color="#85328A">GALERÍA</Eyebrow>
        <SectionTitle>{galeriaInicio.titulo}</SectionTitle>
        <p className="m-0 max-w-[560px] text-[17px] leading-[1.65] text-fc-navy/72">{galeriaInicio.texto}</p>
      </Reveal>
      <Reveal className="mx-auto mt-12 w-full max-w-[1360px]">
        <div
          className="relative h-[320px] overflow-hidden rounded-[28px] bg-fc-navy shadow-[0_40px_80px_-40px_rgba(11,22,49,.6)] md:h-[min(64vh,620px)]"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return
            const dx = e.changedTouches[0].clientX - touch.current
            if (Math.abs(dx) > 40) go(gi + (dx < 0 ? 1 : -1))
            touch.current = null
          }}
        >
          {slides.map((s, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-[800ms] fc-ease" style={{ opacity: i === gi ? 1 : 0, background: s.bg }} aria-hidden={i !== gi}>
              <Foto src={s.image} alt={s.cap} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-fc-navy/0 to-fc-navy/60" />
              <div className="pointer-events-none absolute bottom-[26px] left-7 flex flex-col gap-1.5">
                <span className="text-[11.5px] font-black tracking-[0.25em] text-fc-yellow">{s.tag}</span>
                <span className="font-display text-2xl font-extrabold text-fc-cream">{s.cap}</span>
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute right-5 top-5 z-[3] rounded-full bg-fc-navy/72 px-4 py-2 text-sm font-bold tracking-[0.06em] text-fc-cream tabular-nums backdrop-blur-[8px]">
            {gi + 1} / {slides.length}
          </div>
          {[
            { dir: -1, label: 'Anterior', pos: 'left-5', icon: '←' },
            { dir: 1, label: 'Siguiente', pos: 'right-5', icon: '→' },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => go(gi + b.dir)}
              aria-label={b.label}
              className={`absolute top-1/2 z-[3] size-[54px] -translate-y-1/2 cursor-pointer rounded-full border-0 bg-white text-xl text-fc-navy shadow-[0_10px_24px_-8px_rgba(11,22,49,.5)] transition-transform duration-300 fc-ease hover:scale-[1.08] ${b.pos}`}
            >
              {b.icon}
            </button>
          ))}
        </div>
        <div className="mt-[22px] flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={s.cap}
              className="h-2 cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-[400ms] fc-ease"
              style={{ width: i === gi ? 30 : 8, background: i === gi ? '#85328A' : 'rgba(11,22,49,.2)' }}
            />
          ))}
        </div>
        <div className="mt-[22px] flex justify-start gap-2.5 overflow-x-auto px-0.5 pb-2 pt-1 md:justify-center">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="relative h-[68px] w-[104px] flex-none cursor-pointer overflow-hidden rounded-[14px] border-[3px] p-0 transition-[opacity,border-color] duration-300"
              style={{ borderColor: i === gi ? '#85328A' : 'transparent', background: s.bg, opacity: i === gi ? 1 : 0.7 }}
            >
              <Foto src={s.image} alt="" />
              <span className="absolute inset-0 flex items-end p-2 text-left text-[11px] font-bold leading-[1.2] text-fc-cream">{s.cap}</span>
            </button>
          ))}
        </div>
        <div className="mt-7 flex justify-center">
          <Link to="/galeria" className={BTN_GOLD}>
            Ver galería completa <span>→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

/* ───────── 05 · Logo en vitrina ───────── */
export function LogoVitrina() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-24 pt-6">
      <Confetti seed={91} n={10} z={1} op={0.85} />
      <Reveal className="relative z-[2] flex flex-col items-center">
        <div className="fx-bob will-change-transform">
          <img src="/img/fucain-color.png" alt="FUCAIN · UNAH" className="block h-auto w-[min(440px,72vw)]" />
        </div>
        <div className="fx-shadow -mt-1.5 h-[30px] w-[min(300px,50vw)] rounded-[50%] blur-[4px]" style={{ background: 'radial-gradient(closest-side, rgba(11,22,49,.28), rgba(11,22,49,0))' }} />
      </Reveal>
    </section>
  )
}

/* ───────── 06 · Participantes (centros) ───────── */
export function Participantes() {
  return (
    <section id="participantes" className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute -left-[180px] top-[20%] size-[460px] rounded-full bg-fc-teal opacity-[.16] blur-[90px]" />
      <div className="pointer-events-none absolute -right-[180px] top-[30%] size-[460px] rounded-full bg-fc-purple opacity-[.16] blur-[90px]" />
      <Reveal className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 text-center">
        <Eyebrow color="#3F7D17">PARTICIPANTES</Eyebrow>
        <SectionTitle>Ocho universidades, una sola fiesta</SectionTitle>
        <p className="m-0 max-w-[580px] text-[17px] leading-[1.65] text-fc-navy/72">
          Delegaciones de ocho universidades de Honduras llevan su talento a FUCAIN.
        </p>
      </Reveal>
      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="fx-marquee flex w-max gap-7 px-3.5 pb-9 pt-3 will-change-transform">
          {[...centros, ...centros].map((c, i) => (
            <div key={i} className="flex w-52 flex-col items-center gap-3.5" aria-hidden={i >= centros.length}>
              <div
                className="relative flex h-[156px] w-52 flex-col justify-end overflow-hidden rounded-[20px] px-[18px] py-4 shadow-[0_20px_40px_-18px_rgba(11,22,49,.45)]"
                style={{ background: c.bg, color: c.fg }}
              >
                <div className="absolute -right-[30px] -top-[30px] size-[100px] rounded-full border-2 border-current opacity-30" />
                <div className="absolute right-14 top-[22px] size-[18px] rotate-45 bg-current opacity-25" />
                <span className="fc-display text-[34px] leading-none">{c.code}</span>
                <span className="mt-1.5 text-[11px] font-extrabold tracking-[0.2em]">{c.city}</span>
              </div>
              <span className="text-center text-[15px] font-bold text-fc-navy">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── 07 · Inscripciones (CTA) ───────── */
export function Inscripcion({ fechaLimite }: { fechaLimite: string }) {
  return (
    <section id="inscripcion" className="relative overflow-hidden bg-fc-purple px-6 pb-[72px] pt-16">
      <Confetti seed={53} n={14} big z={1} />
      <Destello spin={50} className="left-[4%] top-[12%] w-[110px] opacity-90" />
      <Destello spin={-45} className="bottom-[6%] right-[5%] w-[90px] opacity-85" />
      <Reveal className="relative z-[2] mx-auto flex max-w-[860px] flex-col items-center gap-[18px] text-center">
        <Eyebrow color="#FBC102">INSCRIPCIONES ABIERTAS</Eyebrow>
        <h2 className="fc-display m-0 text-[clamp(36px,5vw,56px)] leading-none text-fc-cream">
          Tu talento también
          <br />
          es identidad
        </h2>
        <p className="m-0 max-w-[560px] text-lg leading-[1.65] text-white/92">
          Estudiantes, colectivos y docentes pueden inscribir sus propuestas hasta el {fechaLimite}. Súbete al escenario de FUCAIN 2026.
        </p>
        <div className="mt-3 flex w-full flex-col items-center justify-center gap-3.5 md:w-auto md:flex-row">
          <a href="#programacion" className={`${BTN_GOLD} w-full md:w-auto`}>
            Ver programación <span>→</span>
          </a>
          <a
            href="#top"
            className="inline-flex w-full items-center justify-center rounded-full border border-fc-cream/25 bg-fc-cream/10 px-8 py-4 text-base font-semibold text-fc-cream transition-[transform,background-color] duration-[400ms] fc-ease hover:scale-[1.04] hover:bg-fc-cream/18 md:w-auto"
          >
            Volver al inicio
          </a>
        </div>
      </Reveal>
    </section>
  )
}

/* ───────── 08 · Universidades (logos) ───────── */
export function Universidades() {
  return (
    <section id="universidades" className="bg-white px-6 pb-12 pt-14">
      <Reveal className="mx-auto flex max-w-[1040px] flex-col items-center gap-3.5 text-center">
        <Eyebrow color="#5E6474">UNIVERSIDADES</Eyebrow>
        <p className="m-0 mb-[18px] max-w-[520px] text-base leading-[1.6] text-fc-navy/72">
          Instituciones de educación superior que comparten escenario en FUCAIN.
        </p>
        <div className="flex flex-wrap justify-center gap-[18px]">
          {universidades.map((u) =>
            u.logo ? (
              <div
                key={u.name}
                className="flex h-24 w-[200px] items-center justify-center rounded-[18px] bg-white px-5 py-3.5 shadow-[0_14px_30px_-20px_rgba(11,22,49,.35)] transition-transform duration-[400ms] fc-ease hover:-translate-y-1"
              >
                <img src={u.logo} alt={u.name} className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div key={u.name} className="flex h-24 w-[200px] items-center justify-center rounded-[18px] border border-dashed border-fc-navy/20 text-sm font-semibold text-fc-gray">
                {u.name}
              </div>
            ),
          )}
        </div>
      </Reveal>
    </section>
  )
}
