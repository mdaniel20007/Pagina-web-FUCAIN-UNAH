import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Photo } from '../../data/galeria'

const slide = {
  enter: (d: number) => ({ x: d > 0 ? '30%' : '-30%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0, scale: 0.96 }),
}

export default function Lightbox({ items, index, onClose, onChange }: { items: Photo[]; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const [dir, setDir] = useState(0)
  const thumbs = useRef<HTMLDivElement>(null)
  const photo = items[index]
  const go = useCallback((d: number) => { setDir(d); onChange((index + d + items.length) % items.length) }, [index, items.length, onChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [go, onClose])

  useEffect(() => {
    // precarga vecinas
    ;[1, -1].forEach((d) => { const n = items[(index + d + items.length) % items.length]; if (n) new Image().src = n.src })
    const el = thumbs.current?.children[index] as HTMLElement | undefined
    if (el && thumbs.current) thumbs.current.scrollTo({ left: el.offsetLeft - thumbs.current.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [index, items])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 80 || info.velocity.x > 400) go(-1)
  }

  if (!photo) return null
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-night-3/95 backdrop-blur-md"
      role="dialog" aria-modal="true" aria-label="Visor de fotos"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <span className="text-sm tabular-nums text-muted">{index + 1} / {items.length} · {photo.categoria}</span>
        <div className="flex gap-2">
          <a href={photo.src} download className="rounded-full border border-line-strong px-4 py-2 text-sm text-ink hover:border-gold hover:text-ink">Descargar</a>
          <button onClick={onClose} className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-semibold text-night">Cerrar ✕</button>
        </div>
      </div>

      <div className="relative grid min-h-0 grid-cols-[56px_minmax(0,1fr)_56px] items-center gap-2 px-3 sm:grid-cols-[72px_minmax(0,1fr)_72px]">
        <NavBtn label="Anterior" onClick={() => go(-1)}>←</NavBtn>
        <div className="relative h-full min-h-0 overflow-hidden" onClick={onClose}>
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.img
              key={photo.id}
              layoutId={`foto-${photo.id}`}
              src={photo.src}
              alt={photo.alt}
              custom={dir}
              variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6} onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 m-auto max-h-full max-w-full cursor-grab touch-pan-y select-none rounded-xl object-contain active:cursor-grabbing"
              draggable={false}
            />
          </AnimatePresence>
        </div>
        <NavBtn label="Siguiente" onClick={() => go(1)}>→</NavBtn>
      </div>

      <div ref={thumbs} className="flex gap-2 overflow-x-auto px-6 py-4 [scrollbar-width:none]">
        {items.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setDir(i > index ? 1 : -1); onChange(i) }}
            className={`h-14 w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-0 transition ${i === index ? 'border-gold opacity-100' : 'border-transparent opacity-45 hover:opacity-80'}`}
          >
            <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function NavBtn({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      aria-label={label} onClick={onClick}
      className="z-10 grid size-12 cursor-pointer place-items-center rounded-full border border-line-strong bg-transparent text-xl text-ink hover:border-gold sm:size-14"
    >
      {children}
    </motion.button>
  )
}
