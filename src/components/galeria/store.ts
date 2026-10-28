import { diaDe, type DiaId, type Foto } from '../../data/galeria'

/** Fotos subidas por el visitante: se guardan en IndexedDB de su navegador. */
const DB = 'fucain-galeria', ST = 'fotos'

type Registro = { id: string; dia: DiaId; name: string; thumb: Blob; orig: Blob; w: number; h: number; created: number }

function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore(ST, { keyPath: 'id' })
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await idb()
  return new Promise((res, rej) => {
    const t = db.transaction(ST, mode)
    const q = fn(t.objectStore(ST))
    t.oncomplete = () => res(q ? q.result : undefined)
    t.onerror = () => rej(t.error)
  })
}

export const extOf = (t = '') => (/png/.test(t) ? 'png' : /webp/.test(t) ? 'webp' : /gif/.test(t) ? 'gif' : 'jpg')

function aFoto(r: Registro): Foto {
  const d = diaDe(r.dia)
  return {
    id: r.id, dia: d.id, w: r.w, h: r.h, local: true, ext: extOf(r.orig?.type), blob: r.orig,
    src: URL.createObjectURL(r.thumb), full: URL.createObjectURL(r.orig || r.thumb),
    alt: `${(r.name || 'Foto').replace(/\.[^.]+$/, '')} · ${d.label}`,
  }
}

export async function cargarLocales(): Promise<Foto[]> {
  const recs = ((await tx<Registro[]>('readonly', (s) => s.getAll())) || []) as Registro[]
  return recs.sort((a, b) => b.created - a.created).map(aFoto)
}

export async function borrarLocal(id: string) {
  await tx('readwrite', (s) => { s.delete(id) })
}

async function miniatura(file: File) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image()
      im.decoding = 'async'
      im.onload = () => res(im)
      im.onerror = rej
      im.src = url
    })
    const s = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.max(1, Math.round(img.naturalWidth * s))
    const h = Math.max(1, Math.round(img.naturalHeight * s))
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    cv.getContext('2d')!.drawImage(img, 0, 0, w, h)
    const blob = await new Promise<Blob>((r, j) => cv.toBlob((b) => (b ? r(b) : j(new Error('toBlob'))), 'image/jpeg', 0.86))
    return { blob, w, h }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function guardarLocal(file: File, dia: DiaId, orden: number): Promise<Foto> {
  const t = await miniatura(file)
  const rec: Registro = {
    id: 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    dia, name: file.name, thumb: t.blob, orig: file, w: t.w, h: t.h, created: Date.now() + orden,
  }
  await tx('readwrite', (s) => { s.put(rec) })
  return aFoto(rec)
}

export function guardarArchivo(blob: Blob, name: string) {
  const u = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = u
  a.download = name
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(u), 4000)
}

export async function obtenerBlob(p: Foto, signal?: AbortSignal) {
  if (p.blob) return p.blob
  const r = await fetch(p.full, { signal })
  if (!r.ok) throw new Error(String(r.status))
  return r.blob()
}
