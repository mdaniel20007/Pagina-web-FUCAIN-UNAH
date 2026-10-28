import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import FooterInicio from '../components/inicio/FooterInicio'
import PosterCard, { GLASS_BTN } from '../components/inicio/PosterCard'
import { ACC, EASE } from '../components/inicio/fx'
import { usePageTheme } from '../components/inicio/usePageTheme'
import { categorias, cronogramaOverlays } from '../data/inicio'

const CREMA = '#FFF8EE'

/** Franja de papel picado en SVG (arriba y abajo de la página). */
function Franja({ id }: { id: string }) {
  return (
    <svg width="100%" height="28" className="block" aria-hidden>
      <defs>
        <pattern id={id} width="112" height="28" patternUnits="userSpaceOnUse">
          <rect width="112" height="28" fill="#0B1631" />
          <polygon points="6,5 22,4 21,24 8,23" fill="#FBC102" />
          <rect x="6" y="10" width="16" height="2" fill="#0B1631" />
          <rect x="6" y="16" width="16" height="2" fill="#0B1631" />
          <rect x="28" y="4" width="3" height="20" fill="#12AC9C" />
          <rect x="34" y="4" width="3" height="20" fill="#E84E2B" />
          <polygon points="42,24 50,4 58,24" fill="#85328A" />
          <polygon points="64,4 80,5 78,24 66,23" fill="#E84E2B" />
          <rect x="64" y="10" width="16" height="2" fill="#0B1631" />
          <rect x="64" y="16" width="16" height="2" fill="#0B1631" />
          <rect x="86" y="4" width="3" height="20" fill="#7ECBE3" />
          <rect x="92" y="4" width="3" height="20" fill="#FBC102" />
          <polygon points="99,4 108,4 104,24" fill="#66B32F" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill={`url(#${id})`} />
    </svg>
  )
}

const RAYA = 'linear-gradient(90deg,#E84E2B 0 20%,#F5A12F 20% 40%,#FBC102 40% 60%,#12AC9C 60% 80%,#85328A 80% 100%)'

function Figuras() {
  const rm = useReducedMotion()
  const kids = useMemo(() => {
    let s = 29
    const r = () => ((s = (s * 9301 + 49297) % 233280), s / 233280)
    const out = []
    for (let i = 0; i < 16; i++) {
      const t = i % 3
      const size = 6 + r() * 7
      const c = ACC[Math.floor(r() * ACC.length)]
      const left = `${r() * 100}%`
      const top = `${r() * 100}%`
      const dur = 5 + r() * 6
      const del = -r() * 6
      out.push(
        <span key={i} className="absolute opacity-80" style={{ left, top, animation: rm ? 'none' : `fcFloat ${dur}s ease-in-out ${del}s infinite alternate` }}>
          <span className="block" style={{ width: size, height: size, background: c, borderRadius: t === 2 ? '50%' : 2, transform: t === 1 ? 'rotate(45deg)' : 'none' }} />
        </span>,
      )
    }
    ;[
      { l: '6%', t: '30%', w: 120, br: '50%', c: '#FBC102', rot: 0 },
      { l: '84%', t: '52%', w: 70, br: '50%', c: '#1F3C77', rot: 0 },
      { l: '74%', t: '18%', w: 54, br: '4px', c: '#E84E2B', rot: 45 },
    ].forEach((b, i) =>
      out.push(
        <span key={`b${i}`} className="absolute" style={{ left: b.l, top: b.t, animation: rm ? 'none' : `fcDrift ${12 + i * 3}s ease-in-out infinite alternate` }}>
          <span className="block opacity-70" style={{ width: b.w, height: b.w, border: `2px solid ${b.c}`, borderRadius: b.br, transform: `rotate(${b.rot}deg)` }} />
        </span>,
      ),
    )
    return out
  }, [rm])
  return <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">{kids}</div>
}

export default function CronogramaPage() {
  const { categoria } = useParams()
  const cat = categorias.find((c) => c.slug === categoria)
  usePageTheme(CREMA, cat ? `Cronograma · ${cat.label} · FUCAIN 2026` : 'Cronograma · FUCAIN 2026')
  if (!cat) return <Navigate to="/cronograma/musica" replace />

  return (
    <div className="fc-page min-h-screen overflow-x-clip" style={{ background: CREMA }}>
      <Franja id="cxTop" />
      <div className="h-[3px]" style={{ background: RAYA }} />

      <section className="relative overflow-hidden pb-[72px]">
        <Figuras />
        <img src="/img/fragmentos-1.png" alt="" aria-hidden className="pointer-events-none absolute -left-[60px] bottom-2.5 w-[340px] -rotate-[8deg] opacity-50" />
        <img src="/img/destellos.png" alt="" aria-hidden className="pointer-events-none absolute right-[6%] top-[120px] w-[90px] rotate-[14deg] opacity-90" />

        <div className="relative z-[3] mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 pt-[22px]">
          <Link to="/" className="flex" aria-label="FUCAIN · inicio">
            <img src="/img/fucain-color.png" alt="FUCAIN · UNAH" className="size-[88px] object-contain" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-fc-navy px-[22px] py-3 text-sm font-semibold text-fc-cream transition-transform duration-[350ms] fc-ease hover:scale-[1.04] hover:text-fc-cream">
            ← Volver al inicio
          </Link>
        </div>

        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative z-[3] mx-auto flex max-w-[900px] flex-col items-center gap-[18px] px-6 pt-14 text-center"
        >
          <span className="text-xs font-black tracking-[0.3em]" style={{ color: cat.eyebrowColor }}>{cat.eyebrow}</span>
          <h1 className="fc-display m-0 text-balance text-[clamp(44px,8vw,96px)] leading-[.94] text-fc-navy">
            Cronograma de
            <br />
            {cat.titulo}
          </h1>
          <p className="m-0 max-w-[600px] text-lg leading-[1.65] text-fc-navy/72">{cat.intro}</p>
          <nav className="mt-2.5 flex flex-wrap justify-center gap-2">
            {categorias.map((c) => {
              const on = c.slug === cat.slug
              return (
                <Link
                  key={c.slug}
                  to={`/cronograma/${c.slug}`}
                  replace
                  className="rounded-full border border-fc-navy/14 px-[18px] py-[9px] text-sm font-semibold transition-colors duration-300"
                  style={{ color: on ? CREMA : '#0B1631', background: on ? '#0B1631' : 'transparent' }}
                >
                  {c.label}
                </Link>
              )
            })}
          </nav>
        </motion.div>
      </section>

      <section key={cat.slug} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cat.items.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}>
            <PosterCard
              tag={it.tag}
              titulo={it.titulo}
              desc={it.desc}
              base="#1d2547"
              overlay={cronogramaOverlays[i % cronogramaOverlays.length]}
              shade="linear-gradient(180deg, rgba(11,22,49,0) 25%, rgba(11,22,49,.66) 100%)"
              image={it.image}
              className="h-[360px] md:h-[400px]"
              padding="p-8"
              action={
                it.pdf ? (
                  <a href={it.pdf} target="_blank" rel="noreferrer" className={GLASS_BTN}>Ver programación (PDF) ↗</a>
                ) : (
                  <span className={`${GLASS_BTN} cursor-default opacity-70 hover:scale-100`}>PDF próximamente</span>
                )
              }
            />
          </motion.div>
        ))}
      </section>

      <div className="pt-16">
        <FooterInicio bg={CREMA} />
      </div>
    </div>
  )
}
