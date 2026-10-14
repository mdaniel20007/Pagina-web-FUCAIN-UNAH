import { useEffect, useState, type RefObject } from 'react'

/** Nº de columnas según el ancho del contenedor (mín. 260 px por columna). */
export function useColumns(ref: RefObject<HTMLElement | null>, min = 260, max = 5) {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setCols(Math.max(1, Math.min(max, Math.floor(e.contentRect.width / min)))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, min, max])
  return cols
}
