import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Photo } from '../../data/galeria'

export type GridArrange = { kind: 'grid'; columns: number; fill: 'offset' | 'aligned'; rotateX: number; bulge: number; gap: number }

/** grid({ columns: 6, fill: 'offset', rotateX: 20, bulge: 120 }) */
export function grid(o: Partial<Omit<GridArrange, 'kind'>> = {}): GridArrange {
  return { kind: 'grid', columns: 6, fill: 'offset', rotateX: 20, bulge: 120, gap: 14, ...o }
}

type Props = { items: Photo[]; arrange?: GridArrange; onOpen?: (index: number) => void; height?: string }

export default function Gallery({ items, arrange = grid(), onOpen, height = 'min(78vh, 760px)' }: Props) {
  const { columns, fill, rotateX, bulge, gap } = arrange
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const rx = useTransform(sy, (v) => rotateX - v * 8)
  const ry = useTransform(sx, (v) => v * 10)

  const n = items.length
  const per = Math.max(4, Math.ceil(n / columns))
  const half = (columns - 1) / 2 || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 120, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => { px.set(0); py.set(0) }}
      className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_82%,transparent)]"
      style={{ height, perspective: 1400, perspectiveOrigin: '50% 40%' }}
    >
      <motion.div
        className="absolute -left-[6%] -right-[6%] -top-[30%] grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap, rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', transformOrigin: '50% 30%' }}
      >
        {Array.from({ length: columns }, (_, c) => {
          const nx = (c - (columns - 1) / 2) / half
          const z = bulge * (1 - nx * nx)
          const tiles = Array.from({ length: per }, (_, j) => (n ? (c + j * columns) % n : -1))
          const track = [...tiles, ...tiles]
          return (
            <div key={c} style={{ transform: `translateZ(${z}px) rotateY(${-nx * Math.min(28, bulge / 6)}deg)`, transformStyle: 'preserve-3d', paddingTop: fill === 'offset' && c % 2 ? '12%' : 0 }}>
              <motion.div
                className="flex flex-col"
                style={{ gap, paddingBottom: gap, transformStyle: 'preserve-3d' }}
                animate={{ y: c % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }}
                transition={{ duration: 36 + (c % 3) * 8, ease: 'linear', repeat: Infinity }}
              >
                {track.map((idx, k) => {
                  const p = idx >= 0 ? items[idx] : undefined
                  return (
                    <motion.button
                      key={k}
                      onClick={p ? () => onOpen?.(idx) : undefined}
                      whileHover={p ? { z: 40, scale: 1.06, boxShadow: '0 30px 60px rgba(0,0,0,.5)' } : undefined}
                      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                      className={`block aspect-[3/4] w-full shrink-0 overflow-hidden rounded-[14px] border border-line p-0 ${p ? 'cursor-zoom-in bg-night-2' : (k + c) % 3 ? 'bg-night-2' : 'bg-[#23143A]'}`}
                    >
                      {p && <img src={p.src} alt={p.alt} loading="lazy" draggable={false} className="block h-full w-full object-cover" />}
                    </motion.button>
                  )
                })}
              </motion.div>
            </div>
          )
        })}
      </motion.div>
      {n === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="rounded-full bg-night/85 px-6 py-3.5 font-display text-[clamp(28px,4vw,48px)] font-extrabold">Agrega fotos para llenar el muro</span>
        </div>
      )}
    </motion.div>
  )
}
