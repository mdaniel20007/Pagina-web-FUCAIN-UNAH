import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react'

export const EASE = [0.23, 1, 0.32, 1] as const
export const ACC = ['#E84E2B', '#FBC102', '#12AC9C', '#85328A', '#F5A12F', '#7ECBE3', '#66B32F']

/** Generador pseudoaleatorio con semilla (mismas formas en cada render). */
const rng = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** Contenedor decorativo que pausa sus animaciones cuando sale de pantalla. */
function FxLayer({ children, z = 2 }: { children: ReactNode; z?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${inView ? '' : 'fx-paused'}`} style={{ zIndex: z }}>
      {children}
    </div>
  )
}

type ConfettiOpts = { seed: number; n: number; fall?: 'vh' | 'px'; op?: number; z?: number; burst?: number; big?: boolean }

/** Confeti que cae (cintas, cuadros, triángulos y serpentinas). */
export function Confetti({ seed, n, fall = 'px', op = 0.95, z = 2, burst = 0, big = false }: ConfettiOpts) {
  const rm = useReducedMotion()
  const kids = useMemo(() => {
    const r = rng(seed)
    const piece = (k: number, c: string): CSSProperties => {
      const kind = k % 5
      if (kind === 0 || kind === 3) return { width: 6 + r() * 3, height: 13 + r() * 8, background: c, borderRadius: 1.5 }
      if (kind === 1) {
        const s = 8 + r() * 4
        return { width: s, height: s, background: c, borderRadius: 1 }
      }
      if (kind === 2) {
        const s = 10 + r() * 5
        return { width: s, height: s, background: c, clipPath: 'polygon(50% 0,100% 100%,0 100%)' }
      }
      return { width: 16 + r() * 6, height: 8, borderTop: `3px solid ${c}`, borderRadius: '50% 50% 0 0' }
    }
    const out: ReactNode[] = []
    const fallKf = fall === 'vh' ? 'cfFallV' : 'cfFallP'
    for (let i = 0; i < n; i++) {
      const c = ACC[Math.floor(r() * ACC.length)]
      const st = piece(i, c)
      const dur = 8 + r() * 7
      const flip = 1.2 + r() * 1.6
      const rot = Math.round(r() * 360)
      const left = `${r() * 100}%`
      const topR = `${r() * 100}%`
      const delay = (-r() * dur).toFixed(2)
      out.push(
        <span key={`c${i}`} style={{ position: 'absolute', left, top: rm ? topR : '-30px', opacity: op, animation: rm ? 'none' : `${fallKf} ${dur}s linear ${delay}s infinite` }}>
          <span style={{ display: 'block', ...st, transform: `rotate(${rot}deg)`, animation: rm ? 'none' : `${i % 2 ? 'cfFlipA' : 'cfFlipB'} ${flip}s linear infinite` }} />
        </span>,
      )
    }
    if (burst && !rm) {
      for (let i = 0; i < burst; i++) {
        const c = ACC[i % ACC.length]
        const st = piece(i + 2, c)
        const a = r() * Math.PI * 2
        const d = 28 + r() * 30
        const vars = {
          '--dx': `${(Math.cos(a) * d).toFixed(1)}vw`,
          '--dy': `${(Math.sin(a) * d * 0.7 + 12).toFixed(1)}vh`,
          '--rr': `${Math.round(r() * 720 - 360)}deg`,
        } as CSSProperties
        const dur = 1.6 + r() * 1.2
        const del = 0.35 + r() * 0.25
        out.push(
          <span key={`x${i}`} style={{ position: 'absolute', left: '50%', top: '46%', opacity: 0, ...st, ...vars, animation: `cfBurst ${dur.toFixed(2)}s cubic-bezier(.15,.75,.3,1) ${del.toFixed(2)}s both` }} />,
        )
      }
    }
    if (big) {
      const bigs = [
        { l: '7%', t: '24%', w: 130, br: '50%', c: '#FBC102', bs: 'dashed', spin: 38 },
        { l: '86%', t: '18%', w: 76, br: '50%', c: '#7ECBE3', bs: 'solid', spin: 0 },
        { l: '80%', t: '68%', w: 58, br: 4, c: '#E84E2B', bs: 'solid', spin: -26 },
      ]
      bigs.forEach((b, i) =>
        out.push(
          <span key={`b${i}`} style={{ position: 'absolute', left: b.l, top: b.t, animation: rm ? 'none' : `fcDrift ${10 + i * 3}s ease-in-out ${-i * 2}s infinite alternate` }}>
            <span
              style={{
                display: 'block', width: b.w, height: b.w, border: `2px ${b.bs} ${b.c}`, borderRadius: b.br, opacity: 0.8, transform: 'rotate(45deg)',
                animation: rm || !b.spin ? 'none' : `cfSpin ${Math.abs(b.spin)}s linear infinite ${b.spin < 0 ? 'reverse' : 'normal'}`,
              }}
            />
          </span>,
        ),
      )
    }
    return out
  }, [seed, n, fall, op, burst, big, rm])
  return <FxLayer z={z}>{kids}</FxLayer>
}

const PP_COLORS = ['#E84E2A', '#66B22F', '#853288', '#FBC300', '#12AC9D', '#F5A12F', '#7FCBE5']
const PP_SHAPES = [
  'polygon(0 0,100% 0,82% 100%,12% 96%)',
  'polygon(0 0,100% 0,55% 100%)',
  'polygon(8% 0,100% 0,100% 92%,0 100%)',
  'polygon(0 0,100% 0,74% 100%,30% 100%)',
  'polygon(0 0,100% 0,100% 100%,18% 86%)',
]

/** Banderines de papel picado colgando bajo la barra de navegación. */
export function PapelPicado({ count = 30, seed = 5, top = 68 }: { count?: number; seed?: number; top?: number }) {
  const rm = useReducedMotion()
  const kids = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, (_, i) => {
      const w = Math.round(16 + r() * 22)
      const hh = Math.round(34 + r() * 78)
      const tilt = (r() * 14 - 7).toFixed(2)
      const x = Math.min(98, Math.max(0.5, ((i + 0.5) / count) * 100 + (r() - 0.5) * (60 / count)))
      const dur = (3.2 + r() * 2.4).toFixed(2)
      const dly = i * 0.05
      return (
        <div key={i} style={{ position: 'absolute', top: 0, left: `${x}%`, marginLeft: -w / 2, animation: rm ? 'none' : `ppDrop .9s cubic-bezier(.2,.8,.2,1) ${dly.toFixed(2)}s both` }}>
          <div
            style={{
              ['--t' as string]: `${tilt}deg`, width: w, height: hh, background: PP_COLORS[i % PP_COLORS.length], clipPath: PP_SHAPES[i % PP_SHAPES.length],
              transformOrigin: '50% 0', transform: `rotate(${tilt}deg)`,
              animation: rm ? 'none' : `ppSwing ${dur}s ease-in-out ${(dly + 0.9).toFixed(2)}s infinite alternate`,
            }}
          />
        </div>
      )
    })
  }, [count, seed, rm])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[2] h-[130px] overflow-hidden" style={{ top }}>
      {kids}
    </div>
  )
}

/** Destello decorativo (asset destellos.png) que gira lentamente. */
export function Destello({ spin, className = '', style }: { spin: number; className?: string; style?: CSSProperties }) {
  return (
    <img
      src="/img/destellos.png"
      alt=""
      aria-hidden
      className={`fx-spin pointer-events-none absolute ${spin < 0 ? 'fx-spin-rev' : ''} ${className}`}
      style={{ ['--dur' as string]: `${Math.abs(spin)}s`, ...style }}
    />
  )
}

/** Onda SVG que separa secciones. */
export function Wave({ d, fill, bg = '#FFFFFF' }: { d: string; fill: string; bg?: string }) {
  return (
    <div className="leading-none" style={{ background: bg }}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-[90px] w-full" aria-hidden>
        <path d={d} fill={fill} />
      </svg>
    </div>
  )
}

/** Aparece al entrar en pantalla (fade + subida). */
export function Reveal({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Foto a pantalla completa dentro de su contenedor; si no hay foto no pinta nada (queda el degradado). */
export function Foto({ src, alt, className = '', style }: { src?: string; alt: string; className?: string; style?: CSSProperties }) {
  if (!src) return null
  return <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${className}`} style={style} />
}

export function Eyebrow({ children, color, className = '' }: { children: ReactNode; color: string; className?: string }) {
  return (
    <span className={`text-xs font-black tracking-[0.3em] ${className}`} style={{ color }}>
      {children}
    </span>
  )
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`fc-display m-0 text-balance text-[clamp(36px,5vw,56px)] leading-none text-fc-navy ${className}`}>{children}</h2>
}

export const BTN_GOLD =
  'fc-btn-gold inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-bold text-fc-navy! shadow-[0_12px_32px_-10px_rgba(245,161,47,.65)] transition-transform duration-[400ms] fc-ease hover:scale-[1.04]'
