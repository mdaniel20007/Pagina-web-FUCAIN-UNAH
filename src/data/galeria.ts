/**
 * Galería por días del festival.
 *
 * Fotos del sitio: colócalas en src/assets/galeria/dia-1/, dia-2/ o dia-3/
 * (jpg, png, webp, avif). Vite las detecta al compilar, no hay que tocar código.
 * Además, cualquier visitante puede subir fotos desde la página; esas se guardan
 * solo en su navegador.
 */

export const DIAS = [
  { id: 1, label: 'Día 1', fecha: '[DD mes]', color: '#FBC102', tint: '#FFF6D6', eyebrow: '#8A6A00' },
  { id: 2, label: 'Día 2', fecha: '[DD mes]', color: '#12AC9C', tint: '#DDF4F1', eyebrow: '#0B7A6F' },
  { id: 3, label: 'Día 3', fecha: '[DD mes]', color: '#E84E2B', tint: '#FDE3DC', eyebrow: '#C9391A' },
] as const

export type DiaId = (typeof DIAS)[number]['id']
export const diaDe = (id: number) => DIAS.find((d) => d.id === id) ?? DIAS[0]

/** Mientras no haya fotos, se muestran fotos de referencia para ver el diseño. Pon false para ocultarlas. */
export const mostrarFotosDeReferencia = true

export type Foto = {
  id: string
  dia: DiaId
  src: string
  full: string
  alt: string
  ext: string
  /** Tamaño si se conoce (si no, se toma al cargar la imagen). */
  w?: number
  h?: number
  /** Subida en este navegador: se puede eliminar. */
  local?: boolean
  blob?: Blob
}

const archivos = import.meta.glob('../assets/galeria/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const fotosDelSitio: Foto[] = Object.entries(archivos)
  .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }))
  .map(([path, src]) => {
    const rel = path.split('/assets/galeria/')[1]
    const m = rel.match(/^dia-?(\d)\//i)
    const dia = (m && DIAS.some((d) => d.id === +m[1]) ? +m[1] : 1) as DiaId
    const name = rel.split('/').pop()!.replace(/\.[^.]+$/, '')
    const ext = (rel.split('.').pop() || 'jpg').toLowerCase()
    return { id: rel, dia, src, full: src, alt: `${name} · ${diaDe(dia).label}`, ext }
  })

const HS = [800, 600, 900, 700, 1000, 640, 860]
export const fotosDeReferencia: Foto[] = Array.from({ length: 42 }, (_, i) => {
  const d = DIAS[i % 3]
  const h = HS[(i * 3) % HS.length]
  return {
    id: `demo-${i + 1}`,
    dia: d.id,
    w: 600,
    h,
    ext: 'jpg',
    src: `https://picsum.photos/seed/fucain-${i + 1}/600/${h}`,
    full: `https://picsum.photos/seed/fucain-${i + 1}/1800/${h * 3}`,
    alt: `Foto de referencia ${i + 1} · ${d.label}`,
  }
})
