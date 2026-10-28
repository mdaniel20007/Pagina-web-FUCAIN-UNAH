import { useEffect, useRef } from 'react'
import { diaDe, type Foto } from '../../data/galeria'

type Props = { fotos: Foto[]; width: number; onOpen: (index: number, el: HTMLElement) => void }

/** Muro 3D de fotos: columnas curvas que se desplazan solas y se inclinan con el cursor. */
export default function MuroMomentos({ fotos, width, onOpen }: Props) {
  const m = width < 640
  const columns = m ? 3 : width < 1024 ? 4 : 6
  const rotateX = 20
  const bulge = m ? 60 : 120
  const gap = m ? 10 : 16
  const turn = 16
  const per = 7

  const wallRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const tilt = useRef({ cx: 0, cy: 0, vx: 0, vy: 0, tx: 0, ty: 0 })
  const raf = useRef(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const loop = () => {
    if (raf.current) return
    const f = () => {
      const t = tilt.current
      t.vx = (t.vx + (t.tx - t.cx) * 0.06) * 0.82
      t.vy = (t.vy + (t.ty - t.cy) * 0.06) * 0.82
      t.cx += t.vx
      t.cy += t.vy
      if (planeRef.current) planeRef.current.style.transform = `rotateX(${(rotateX + t.cy).toFixed(3)}deg) rotateY(${t.cx.toFixed(3)}deg)`
      if (Math.abs(t.vx) + Math.abs(t.vy) < 0.002 && Math.abs(t.tx - t.cx) + Math.abs(t.ty - t.cy) < 0.01) {
        raf.current = 0
        return
      }
      raf.current = requestAnimationFrame(f)
    }
    raf.current = requestAnimationFrame(f)
  }

  const need = columns * per
  let pool = fotos.map((p, i) => ({ p, i }))
  if (pool.length && pool.length < need) {
    const base = pool
    pool = Array.from({ length: need }, (_, j) => base[j % base.length])
  }
  pool = pool.slice(0, need)

  return (
    <div
      ref={wallRef}
      onPointerMove={(e) => {
        if (reduced || e.pointerType === 'touch' || !wallRef.current) return
        const r = wallRef.current.getBoundingClientRect()
        tilt.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 12
        tilt.current.ty = -((e.clientY - r.top) / r.height - 0.5) * 10
        loop()
      }}
      onPointerLeave={() => {
        tilt.current.tx = 0
        tilt.current.ty = 0
        loop()
      }}
      className="relative mx-auto max-w-[1440px] overflow-hidden [mask-image:linear-gradient(180deg,transparent_0,#000_16%,#000_84%,transparent_100%)] [perspective:1400px]"
      style={{ height: m ? 480 : 680 }}
    >
      <div
        ref={planeRef}
        className="absolute inset-x-0 -bottom-[22%] -top-[22%] grid px-4 [transform-style:preserve-3d]"
        style={{ gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`, gap, transform: `rotateX(${rotateX}deg)` }}
      >
        {Array.from({ length: columns }, (_, c) => {
          const x = columns > 1 ? (c - (columns - 1) / 2) / ((columns - 1) / 2) : 0
          const z = bulge * (1 - x * x)
          const ry = -x * turn
          const ty = c % 2 === 0 ? '12%' : '0%'
          const own = pool.filter((_, j) => j % columns === c)
          const dur = 38 + c * 7 + (c % 2) * 5
          return (
            <div key={`${c}-${columns}`} className="relative [transform-style:preserve-3d]" style={{ transform: `translateY(${ty}) translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)` }}>
              <div
                className="flex flex-col will-change-transform [transform-style:preserve-3d]"
                style={{ animation: reduced ? 'none' : `${c % 2 === 0 ? 'fxColUp' : 'fxColDown'} ${dur}s linear infinite` }}
              >
                {[...own, ...own].map(({ p, i }, j) => (
                  <button
                    key={j}
                    onClick={(e) => onOpen(i, e.currentTarget)}
                    aria-label={`Ampliar: ${p.alt}`}
                    tabIndex={j < own.length ? 0 : -1}
                    className="block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-2xl border-[3px] bg-[#14244A] p-0 transition-[transform,box-shadow] duration-[450ms] fc-ease [transform-style:preserve-3d] hover:[transform:translateZ(90px)_scale(1.12)] hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,.65)]"
                    style={{ borderColor: diaDe(p.dia).color, marginBottom: gap }}
                  >
                    <img src={p.src} alt={j < own.length ? p.alt : ''} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
