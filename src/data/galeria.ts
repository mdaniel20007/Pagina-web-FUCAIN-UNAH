export type Photo = { id: string; src: string; categoria: string; alt: string }

/**
 * Carga automática: coloca las fotos en src/assets/galeria/<categoria>/archivo.jpg
 * El nombre de la carpeta se usa como categoría (ej. "categoria-1" → "Categoría 1").
 * Las fotos sueltas en src/assets/galeria/ quedan en "General".
 */
const files = import.meta.glob('../assets/galeria/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const label = (folder: string) =>
  folder.replace(/[-_]+/g, ' ').replace(/\bcategoria\b/i, 'Categoría').replace(/^./, (c) => c.toUpperCase())

/** Fotos alojadas fuera del proyecto (CDN, Drive público, etc.) */
const remotas: Omit<Photo, 'id'>[] = [
  // { src: 'https://…/foto.jpg', categoria: 'Categoría 1', alt: 'Descripción' },
]

export const fotos: Photo[] = [
  ...Object.entries(files)
    .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }))
    .map(([path, src]) => {
      const rel = path.split('/assets/galeria/')[1]
      const parts = rel.split('/')
      const categoria = parts.length > 1 ? label(parts[0]) : 'General'
      const name = parts[parts.length - 1].replace(/\.[^.]+$/, '')
      return { id: rel, src, categoria, alt: `${categoria} — ${name}` }
    }),
  ...remotas.map((r, i) => ({ ...r, id: `remota-${i}` })),
]

export const categorias = ['Todas', ...Array.from(new Set(fotos.map((f) => f.categoria)))]
