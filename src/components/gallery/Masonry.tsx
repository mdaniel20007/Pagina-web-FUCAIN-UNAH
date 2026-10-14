import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { Photo as PhotoT } from '../../data/galeria'
import Photo from './Photo'
import { useColumns } from './useColumns'

export default function Masonry({ items, onOpen }: { items: PhotoT[]; onOpen: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cols = useColumns(ref)
  const columns = useMemo(() => {
    const out: { photo: PhotoT; index: number }[][] = Array.from({ length: cols }, () => [])
    items.forEach((photo, index) => out[index % cols].push({ photo, index }))
    return out
  }, [items, cols])

  return (
    <div ref={ref} className="flex items-start gap-4">
      {columns.map((col, c) => (
        <div key={c} className="flex min-w-0 flex-1 flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {col.map(({ photo, index }) => (
              <motion.button
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: (index % 12) * 0.04 }}
                whileHover="hover"
                onClick={() => onOpen(index)}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-night-2 p-0 text-left"
              >
                <motion.div layoutId={`foto-${photo.id}`} variants={{ hover: { scale: 1.05 } }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
                  <Photo src={photo.src} alt={photo.alt} />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 rounded-full bg-night/85 px-2.5 py-1 text-xs font-semibold text-ink opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.categoria}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
