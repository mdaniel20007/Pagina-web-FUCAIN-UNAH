import { motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import FooterInicio from '../components/inicio/FooterInicio'
import { Wave } from '../components/inicio/fx'
import { usePageTheme } from '../components/inicio/usePageTheme'
import GaleriaHeader from '../components/galeria/GaleriaHeader'
import MuroMomentos from '../components/galeria/MuroMomentos'
import Visor from '../components/galeria/Visor'
import { borrarLocal, cargarLocales, guardarArchivo, guardarLocal, obtenerBlob } from '../components/galeria/store'
import { DIAS, diaDe, fotosDeReferencia, fotosDelSitio, mostrarFotosDeReferencia, type DiaId, type Foto } from '../data/galeria'
import { inicio } from '../data/inicio'

const PAGE = 24
const INK = '#0B1631'
const ORO = 'fc-btn-gold text-fc-navy shadow-[0_12px_32px_-12px_rgba(245,161,47,.7)]'
const RAYA = ['#FBC102', '#66B32F', '#85328A', '#7ECBE3', '#12AC9C', '#E84E2B', '#F5A12F']
const DL = 'M12 4v11M7 10l5 5 5-5M5 20h14'
const VERDE = '#66B32F', ROJO = '#E84E2B', NARANJA = '#F5A12F'
type Filtro = 'all' | DiaId

function useWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

const IconoDl = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={DL} /></svg>
)

export default function GaleriaPage() {
  usePageTheme('#FFFFFF', `Galería · FUCAIN ${inicio.edicion}`)
  const w = useWidth()
  const [params, setParams] = useSearchParams()
  const q = Number(params.get('dia'))
  const filtro: Filtro = DIAS.some((d) => d.id === q) ? (q as DiaId) : 'all'

  const [locales, setLocales] = useState<Foto[]>([])
  const [cargado, setCargado] = useState(false)
  const [visibles, setVisibles] = useState(PAGE)
  const [lb, setLb] = useState(-1)
  const [origen, setOrigen] = useState<DOMRect | null>(null)
  const [dims, setDims] = useState<Record<string, number>>({})
  const [arrastrando, setArrastrando] = useState(false)
  const [pendientes, setPendientes] = useState<File[] | null>(null)
  const [upDia, setUpDia] = useState<DiaId>(filtro === 'all' ? 1 : filtro)
  const [progreso, setProgreso] = useState<{ done: number; total: number } | null>(null)
  const [confirmar, setConfirmar] = useState<string | null>(null)
  const [seleccionando, setSeleccionando] = useState(false)
  const [sel, setSel] = useState<Record<string, true>>({})
  const [job, setJob] = useState<{ done: number; total: number; phase: 'load' | 'fetch' | 'zip' } | null>(null)
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const indRef = useRef<HTMLSpanElement>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const zipCtrl = useRef<AbortController | null>(null)
  const toastT = useRef(0)
  const touch = window.matchMedia?.('(hover: none)').matches

  // Fotos subidas en este navegador
  useEffect(() => {
    cargarLocales().then(setLocales).catch(() => {}).finally(() => setCargado(true))
  }, [])
  const localesRef = useRef(locales)
  localesRef.current = locales
  useEffect(() => () => localesRef.current.forEach((p) => { URL.revokeObjectURL(p.src); URL.revokeObjectURL(p.full) }), [])

  const propias = useMemo(() => [...locales, ...fotosDelSitio], [locales])
  const demo = cargado && !propias.length && mostrarFotosDeReferencia
  const fuente = useMemo(() => (!cargado ? [] : propias.length ? propias : mostrarFotosDeReferencia ? fotosDeReferencia : []), [cargado, propias])
  const vista = useMemo(() => (filtro === 'all' ? fuente : fuente.filter((p) => p.dia === filtro)), [fuente, filtro])
  const fd = filtro === 'all' ? null : diaDe(filtro)

  const numeros = useMemo(() => {
    const c: Record<number, number> = {}, m: Record<string, number> = {}
    fuente.forEach((p) => { c[p.dia] = (c[p.dia] || 0) + 1; m[p.id] = c[p.dia] })
    return m
  }, [fuente])
  const nombre = (p: Foto) => `fucain-${inicio.edicion}_dia-${p.dia}_${String(numeros[p.id] || 0).padStart(4, '0')}.${p.ext || 'jpg'}`

  const aviso = useCallback((msg: string, color = VERDE) => {
    clearTimeout(toastT.current)
    setToast({ msg, color })
    toastT.current = window.setTimeout(() => setToast(null), 5000)
  }, [])

  // Indicador bajo el día activo
  useLayoutEffect(() => {
    const place = () => {
      const a = chipsRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      const b = indRef.current
      if (!a || !b) return
      b.style.width = `${Math.max(12, a.offsetWidth - 36)}px`
      b.style.transform = `translateX(${a.offsetLeft + 18}px)`
      b.style.backgroundColor = a.dataset.color || INK
    }
    place()
    document.fonts?.ready.then(place)
  }, [filtro, w, fuente.length])

  // Scroll infinito
  useEffect(() => setVisibles(PAGE), [filtro])
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setVisibles((v) => v + PAGE), { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [visibles, vista.length])

  // Arrastrar y soltar fotos en cualquier parte
  const encolar = useCallback((files: File[]) => {
    const imgs = files.filter((f) => /^image\//.test(f.type))
    if (!imgs.length) return
    setPendientes(imgs)
    if (filtro !== 'all') setUpDia(filtro)
  }, [filtro])
  useEffect(() => {
    let depth = 0
    const has = (e: DragEvent) => Array.from(e.dataTransfer?.types || []).includes('Files')
    const de = (e: DragEvent) => { if (!has(e)) return; e.preventDefault(); depth++; setArrastrando(true) }
    const dov = (e: DragEvent) => { if (has(e)) e.preventDefault() }
    const dl = (e: DragEvent) => { if (!has(e)) return; depth = Math.max(0, depth - 1); if (!depth) setArrastrando(false) }
    const dr = (e: DragEvent) => { if (!has(e)) return; e.preventDefault(); depth = 0; setArrastrando(false); encolar(Array.from(e.dataTransfer?.files || [])) }
    const ls: [string, EventListener][] = [['dragenter', de as EventListener], ['dragover', dov as EventListener], ['dragleave', dl as EventListener], ['drop', dr as EventListener]]
    ls.forEach(([t, f]) => window.addEventListener(t, f))
    return () => ls.forEach(([t, f]) => window.removeEventListener(t, f))
  }, [encolar])

  // Escape: cierra diálogos / selección
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || lb >= 0) return
      if (confirmar) setConfirmar(null)
      else if (pendientes && !progreso) setPendientes(null)
      else if (seleccionando) { setSeleccionando(false); setSel({}) }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [lb, confirmar, pendientes, progreso, seleccionando])

  useEffect(() => {
    document.body.style.overflow = lb >= 0 ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lb])

  const cambiarDia = (d: Filtro) => {
    if (d === filtro) return
    setSel({})
    setParams(d === 'all' ? {} : { dia: String(d) }, { replace: true })
  }

  const abrir = (i: number, el: HTMLElement) => {
    lastFocus.current = el
    setOrigen(el.getBoundingClientRect())
    setLb(i)
  }
  const cerrar = () => {
    setLb(-1)
    const f = lastFocus.current
    setTimeout(() => f?.focus({ preventScroll: true }), 0)
  }

  const descargarUna = async (p: Foto) => {
    try { guardarArchivo(await obtenerBlob(p), nombre(p)) } catch { aviso('No se pudo descargar la foto', ROJO) }
  }
  const descargarZip = async (lista: Foto[], zipName: string) => {
    if (!lista.length || job) return
    const ctrl = new AbortController()
    zipCtrl.current = ctrl
    const total = lista.length
    setJob({ done: 0, total, phase: 'load' })
    let JSZip
    try { JSZip = (await import('jszip')).default } catch { setJob(null); aviso('No se pudo preparar la descarga', ROJO); return }
    const zip = new JSZip()
    let fail = 0
    for (let i = 0; i < total; i++) {
      if (ctrl.signal.aborted) break
      try { zip.file(nombre(lista[i]), await obtenerBlob(lista[i], ctrl.signal)) } catch { if (ctrl.signal.aborted) break; fail++ }
      setJob({ done: i + 1, total, phase: 'fetch' })
    }
    if (ctrl.signal.aborted) { setJob(null); aviso('Descarga cancelada', NARANJA); return }
    if (fail === total) { setJob(null); aviso('No se pudo descargar ninguna foto', ROJO); return }
    setJob({ done: total, total, phase: 'zip' })
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' })
    if (ctrl.signal.aborted) { setJob(null); return }
    guardarArchivo(blob, zipName)
    setJob(null)
    aviso(fail ? `Listo · ${fail} ${fail === 1 ? 'foto no se pudo' : 'fotos no se pudieron'} incluir` : `Listo · ${total} fotos descargadas`, fail ? NARANJA : VERDE)
  }
  const descargarDia = () => descargarZip(vista, fd ? `fucain-${inicio.edicion}_dia-${fd.id}.zip` : `fucain-${inicio.edicion}_todas.zip`)
  const nSel = Object.keys(sel).length
  const descargarSel = () => {
    const lista = vista.filter((p) => sel[p.id])
    if (!lista.length) return
    if (lista.length === 1) descargarUna(lista[0])
    else descargarZip(lista, `fucain-${inicio.edicion}_seleccion-${lista.length}.zip`)
    setSeleccionando(false)
    setSel({})
  }
  const toggleSel = (id: string) => setSel((s) => { const n = { ...s }; if (n[id]) delete n[id]; else n[id] = true; return n })

  const subir = async () => {
    const files = pendientes
    if (!files || progreso) return
    setProgreso({ done: 0, total: files.length })
    let lote: Foto[] = [], fail = 0
    const flush = () => { if (!lote.length) return; const add = lote.reverse(); lote = []; setLocales((s) => [...add, ...s]) }
    for (let i = 0; i < files.length; i++) {
      try { lote.push(await guardarLocal(files[i], upDia, i)) } catch { fail++ }
      if (lote.length >= 6) flush()
      setProgreso({ done: i + 1, total: files.length })
    }
    flush()
    setPendientes(null)
    setProgreso(null)
    aviso(fail ? `${files.length - fail} fotos guardadas · ${fail} no se pudieron leer` : `${files.length} ${files.length === 1 ? 'foto guardada' : 'fotos guardadas'} en ${diaDe(upDia).label}`, fail ? NARANJA : VERDE)
  }
  const borrar = async () => {
    const id = confirmar
    setConfirmar(null)
    const it = locales.find((x) => x.id === id)
    if (!it) return
    try { await borrarLocal(it.id) } catch { /* ya no existe */ }
    URL.revokeObjectURL(it.src)
    URL.revokeObjectURL(it.full)
    const items = locales.filter((x) => x.id !== it.id)
    setLocales(items)
    const n = [...items, ...fotosDelSitio].filter((p) => filtro === 'all' || p.dia === filtro).length
    setLb((l) => (l < 0 || !n ? -1 : Math.min(l, n - 1)))
  }

  const m = w < 640
  const mcols = w < 560 ? 1 : w < 860 ? 2 : w < 1180 ? 3 : 4
  const blob = fd ? fd.color : '#FBC102'
  const chips = [{ id: 'all' as Filtro, label: 'Todos', fecha: '', color: INK, on: '#FFF8EE', count: fuente.length }].concat(
    DIAS.map((d) => ({ id: d.id as Filtro, label: d.label, fecha: d.fecha, color: d.color as string, on: INK, count: fuente.filter((p) => p.dia === d.id).length })),
  )
  const jobLabel = !job ? '' : job.phase === 'load' ? 'Preparando descarga…' : job.phase === 'zip' ? 'Comprimiendo ZIP…' : `Preparando ${job.done} / ${job.total}…`

  return (
    <div className="fc-page relative min-h-screen overflow-x-clip bg-white">
      <GaleriaHeader />

      <main>
        <section className="relative overflow-hidden bg-white">
          <div aria-hidden className="pointer-events-none absolute -left-[180px] top-[90px] size-[520px] rounded-full opacity-[.22] blur-[90px] transition-colors duration-[800ms] fc-ease" style={{ background: blob }} />
          <div aria-hidden className="pointer-events-none absolute -right-[160px] top-[30%] size-[460px] rounded-full bg-fc-purple opacity-[.14] blur-[90px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-[220px] left-[40%] size-[420px] rounded-full bg-fc-teal opacity-[.14] blur-[90px]" />

          <div className="relative mx-auto max-w-[1280px] px-6 pb-7" style={{ paddingTop: m ? 190 : 210 }}>
            <span className="text-xs font-black tracking-[0.3em] text-fc-purple">FUCAIN {inicio.edicion} · GALERÍA</span>
            <div className="mt-3.5 flex flex-wrap items-end justify-between gap-7">
              <div className="flex min-w-0 flex-col gap-[18px]">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  className="m-0 font-display text-[clamp(64px,12vw,160px)] font-extrabold leading-[.86] tracking-[-0.02em] text-fc-navy"
                >
                  Galería
                </motion.h1>
                <div aria-hidden className="flex h-2 w-[min(280px,70vw)] overflow-hidden rounded">
                  {RAYA.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
                </div>
                <p className="m-0 text-[17px] leading-[1.6] text-fc-navy/72">
                  <strong className="font-extrabold text-fc-navy">{!cargado ? 'Cargando…' : `${fuente.length} ${fuente.length === 1 ? 'foto' : 'fotos'} · ${DIAS.length} días`}</strong>
                  {' · '}
                  {demo ? 'Fotos de referencia: sube las tuyas para reemplazarlas' : 'Fotos del festival'}
                </p>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className={`${ORO} inline-flex cursor-pointer items-center gap-2.5 rounded-full border-0 px-[30px] py-4 text-[17px] font-extrabold transition-transform duration-[400ms] fc-ease hover:scale-[1.04] active:scale-[.98]`}
              >
                + Subir fotos
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                aria-label="Seleccionar fotos"
                className="hidden"
                onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; encolar(f) }}
              />
            </div>

            <div aria-label="Filtrar por día" className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div role="toolbar" aria-label="Días del festival" className="min-w-0 max-w-full overflow-x-auto px-0.5 pb-3.5 pt-1 [scrollbar-width:none]">
                <div ref={chipsRef} className="relative flex w-max flex-nowrap gap-2.5">
                  {chips.map((c) => {
                    const act = filtro === c.id
                    return (
                      <button
                        key={String(c.id)}
                        onClick={() => cambiarDia(c.id)}
                        aria-pressed={act}
                        data-active={act}
                        data-color={c.color}
                        className="inline-flex flex-none cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border-2 py-[11px] pl-[18px] pr-3.5 text-[15px] font-semibold shadow-[0_10px_24px_-18px_rgba(11,22,49,.5)] transition-[background-color,color,border-color,transform] duration-300 fc-ease hover:-translate-y-0.5"
                        style={{ borderColor: c.color, background: act ? c.color : '#FFFFFF', color: act ? c.on : INK }}
                      >
                        <span className="font-extrabold">{c.label}</span>
                        {c.fecha && <span className="opacity-80">· {c.fecha}</span>}
                        <span
                          className="min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-extrabold tabular-nums"
                          style={{ background: act ? (c.id === 'all' ? 'rgba(255,255,255,.18)' : 'rgba(11,22,49,.12)') : 'rgba(11,22,49,.07)' }}
                        >
                          {c.count}
                        </span>
                      </button>
                    )
                  })}
                  <span ref={indRef} aria-hidden className="absolute -bottom-2.5 left-0 h-1 w-0 rounded-sm bg-fc-navy transition-[transform,width,background-color] duration-500 fc-ease" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => { setSeleccionando((s) => !s); setSel({}) }}
                  aria-pressed={seleccionando}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-[18px] py-3 text-[15px] font-bold text-fc-navy"
                  style={{ borderColor: seleccionando ? INK : 'rgba(11,22,49,.18)', background: seleccionando ? '#FFF6D6' : '#FFFFFF' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12l3 3 5-6" /></svg>
                  {seleccionando ? 'Seleccionando' : 'Seleccionar'}
                </button>
                <button
                  onClick={descargarDia}
                  disabled={!!job}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-fc-navy px-5 py-3 text-[15px] font-bold text-fc-cream transition-transform duration-250 fc-ease hover:-translate-y-0.5"
                >
                  <IconoDl />
                  {fd ? `Descargar ${fd.label}` : 'Descargar todo'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <Wave fill="#0B1631" d="M0,46 C240,8 460,76 720,54 C980,32 1160,4 1440,38 L1440,90 L0,90 Z" />
        <section aria-label="Muro de fotos" className="relative overflow-hidden bg-fc-navy px-3 pb-7 pt-5">
          <div aria-hidden className="pointer-events-none absolute left-[10%] top-[10%] size-[420px] rounded-full opacity-[.18] blur-[100px] transition-colors duration-[800ms]" style={{ background: blob }} />
          <div className="relative mx-auto mb-[22px] flex max-w-[1280px] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-3">
            <span className="text-xs font-black tracking-[0.3em] text-fc-yellow">MURO DE MOMENTOS</span>
            <span className="text-sm text-fc-cream/72">Pasa el cursor y haz clic para ampliar</span>
          </div>
          {vista.length > 0 ? (
            <MuroMomentos key={String(filtro)} fotos={vista} width={w} onOpen={abrir} />
          ) : (
            <div className="mx-auto grid h-[280px] max-w-[1280px] place-items-center text-fc-cream/60">Sin fotos para mostrar</div>
          )}
        </section>
        <Wave bg="#0B1631" fill="#FFFFFF" d="M0,30 C200,70 420,10 680,38 C900,62 1120,80 1300,48 C1380,34 1420,32 1440,36 L1440,90 L0,90 Z" />

        <section aria-label="Todas las fotos" className="relative overflow-hidden bg-white">
          <div aria-hidden className="pointer-events-none absolute -right-[200px] top-[120px] size-[520px] rounded-full opacity-[.14] blur-[100px] transition-colors duration-[800ms]" style={{ background: blob }} />
          <div aria-hidden className="pointer-events-none absolute -left-[200px] top-1/2 size-[480px] rounded-full bg-fc-orange opacity-[.12] blur-[100px]" />
          <div className="relative mx-auto max-w-[1280px] px-6 pb-[120px] pt-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black tracking-[0.3em]" style={{ color: fd ? fd.eyebrow : '#85328A' }}>{fd ? `MOSAICO · ${fd.label.toUpperCase()}` : 'MOSAICO'}</span>
                <h2 className="m-0 font-display text-[clamp(36px,5vw,56px)] font-extrabold leading-none tracking-[-0.01em] text-fc-navy">{fd ? `${fd.label} · ${fd.fecha}` : 'Todas las fotos'}</h2>
              </div>
              <span className="text-[15px] text-fc-navy/72">{vista.length ? `Mostrando ${Math.min(visibles, vista.length)} de ${vista.length}` : ''}</span>
            </div>

            {cargado && !vista.length && (
              <div className="flex flex-col items-center gap-4 rounded-[28px] border-2 border-dashed border-fc-navy/18 bg-fc-cream px-6 py-16 text-center">
                <span className="font-display text-[28px] font-extrabold text-fc-navy">Aún no hay fotos de este día</span>
                <span className="text-base text-fc-navy/72">Arrastra imágenes a cualquier parte de la página o usa el botón.</span>
                <button onClick={() => fileRef.current?.click()} className={`${ORO} mt-2 cursor-pointer rounded-full border-0 px-[26px] py-3.5 text-base font-extrabold`}>+ Subir fotos</button>
              </div>
            )}

            <div key={String(filtro)} style={{ columnCount: mcols, columnGap: 18 }}>
              {vista.slice(0, visibles).map((p, i) => {
                const d = diaDe(p.dia)
                const on = !!sel[p.id]
                const ratio = p.w && p.h ? `${p.w} / ${p.h}` : dims[p.id] ? String(dims[p.id]) : '3 / 4'
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 0.65, delay: (i % 8) * 0.055, ease: [0.23, 1, 0.32, 1] }}
                    className="group relative mb-[18px] break-inside-avoid"
                  >
                    <button
                      onClick={(e) => (seleccionando ? toggleSel(p.id) : abrir(i, e.currentTarget))}
                      aria-label={seleccionando ? `${on ? 'Quitar de la selección' : 'Seleccionar'}: ${p.alt}` : `Ampliar: ${p.alt}`}
                      aria-pressed={seleccionando ? on : undefined}
                      className="relative block w-full overflow-hidden rounded-[20px] border-4 p-0 shadow-[0_20px_40px_-22px_rgba(11,22,49,.5)] transition-[border-color] duration-200"
                      style={{ borderColor: on ? '#FBC102' : 'transparent', aspectRatio: ratio, background: d.tint, cursor: seleccionando ? 'pointer' : 'zoom-in' }}
                    >
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        decoding="async"
                        onLoad={(e) => {
                          const im = e.currentTarget
                          im.style.opacity = '1'
                          if (!(p.w && p.h) && im.naturalWidth && !dims[p.id]) setDims((s) => ({ ...s, [p.id]: im.naturalWidth / im.naturalHeight }))
                        }}
                        className="block h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-[500ms,900ms] fc-ease group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                      />
                      <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/94 px-3 py-1.5 text-xs font-extrabold tracking-[0.04em] text-fc-navy">
                        <span className="size-2 rounded-full" style={{ background: d.color }} />
                        {d.label}
                      </span>
                    </button>
                    {seleccionando && (
                      <span aria-hidden className="pointer-events-none absolute left-3 top-3 flex size-[30px] items-center justify-center rounded-[9px] border-2 text-fc-navy transition-colors duration-200" style={{ borderColor: on ? '#FBC102' : '#FFFFFF', background: on ? '#FBC102' : 'rgba(11,22,49,.45)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0 }}><path d="M5 12l5 5 9-10" /></svg>
                      </span>
                    )}
                    {!seleccionando && (
                      <button
                        onClick={() => descargarUna(p)}
                        aria-label={`Descargar ${nombre(p)}`}
                        className={`absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-fc-navy px-3.5 py-[9px] text-[13px] font-bold text-fc-cream shadow-[0_8px_20px_-8px_rgba(0,0,0,.55)] transition-[opacity,transform] duration-250 fc-ease hover:scale-105 focus-visible:opacity-100 ${touch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <IconoDl />
                        Descargar
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {visibles < vista.length && (
              <div ref={sentinel} aria-label="Cargando más fotos" className="mt-1 grid gap-[18px]" style={{ gridTemplateColumns: `repeat(${mcols},minmax(0,1fr))` }}>
                {[260, 200, 300, 220].slice(0, mcols).map((h, i) => <div key={i} className="rounded-[20px]" style={{ height: h, background: i % 2 ? '#EEF6FB' : '#FFF8EE' }} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      <FooterInicio />

      {seleccionando && (
        <div role="region" aria-label="Fotos seleccionadas" className="fixed bottom-5 left-1/2 z-[60] flex w-[min(560px,calc(100vw-24px))] -translate-x-1/2 items-center gap-2.5 rounded-full bg-fc-navy py-2.5 pl-[22px] pr-2.5 text-fc-cream shadow-[0_24px_50px_-18px_rgba(11,22,49,.6)]">
          <span className="min-w-0 flex-1 text-[15px] font-bold tabular-nums">{nSel} {nSel === 1 ? 'seleccionada' : 'seleccionadas'}</span>
          <button
            onClick={descargarSel}
            disabled={!nSel}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-0 px-[18px] py-3 text-[15px] font-extrabold"
            style={{ background: nSel ? 'linear-gradient(135deg,#FBC102,#F5A12F)' : 'rgba(255,248,238,.14)', color: nSel ? INK : 'rgba(255,248,238,.6)' }}
          >
            <IconoDl />
            Descargar
          </button>
          <button onClick={() => { setSeleccionando(false); setSel({}) }} className="cursor-pointer rounded-full border border-fc-cream/30 bg-transparent px-4 py-3 text-[15px] font-semibold text-fc-cream">Cancelar</button>
        </div>
      )}

      {job && (
        <div role="status" aria-live="polite" className="fixed left-1/2 z-[80] flex w-[min(440px,calc(100vw-24px))] -translate-x-1/2 flex-col gap-3 rounded-[22px] border border-fc-navy/8 bg-white px-5 py-[18px] shadow-[0_30px_60px_-20px_rgba(11,22,49,.45)]" style={{ bottom: seleccionando ? 96 : 20 }}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] font-extrabold tabular-nums text-fc-navy">{jobLabel}</span>
            <button onClick={() => zipCtrl.current?.abort()} className="cursor-pointer rounded-full border border-fc-navy/18 bg-transparent px-3.5 py-2 text-sm font-semibold text-fc-navy">Cancelar</button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-fc-navy/8">
            <div className="fc-btn-gold h-full transition-[width] duration-300" style={{ width: `${Math.round((job.done / job.total) * 100)}%` }} />
          </div>
        </div>
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed left-1/2 top-[92px] z-[96] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2.5 rounded-full bg-fc-navy px-[22px] py-3.5 text-[15px] font-bold text-fc-cream shadow-[0_20px_40px_-16px_rgba(11,22,49,.6)]">
          <span className="size-2.5 flex-none rounded-full" style={{ background: toast.color }} />
          {toast.msg}
        </div>
      )}

      {arrastrando && (
        <div className="pointer-events-none fixed inset-0 z-[90] flex bg-fc-cream/96 p-5">
          <div className="flex flex-1 flex-col items-center justify-center gap-3.5 rounded-[28px] border-[3px] border-dashed border-fc-purple text-center">
            <span className="font-display text-[clamp(40px,7vw,80px)] font-extrabold leading-none text-fc-navy">Suelta tus fotos</span>
            <span className="text-[17px] text-fc-navy/72">Después eliges a qué día pertenecen</span>
          </div>
        </div>
      )}

      {pendientes && (
        <div role="dialog" aria-modal="true" aria-label="Subir fotos" className="fixed inset-0 z-[85] flex items-center justify-center bg-fc-navy/55 p-5 backdrop-blur-[6px]">
          <div className="flex w-full max-w-[540px] flex-col gap-5 rounded-[28px] bg-white p-8 text-fc-navy shadow-[0_40px_80px_-30px_rgba(11,22,49,.6)]">
            <div aria-hidden className="flex h-1.5 w-[120px] overflow-hidden rounded-[3px]">
              {RAYA.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
            </div>
            <h2 className="m-0 font-display text-[32px] font-extrabold leading-[1.05]">
              {progreso ? 'Guardando fotos…' : `Subir ${pendientes.length} ${pendientes.length === 1 ? 'foto' : 'fotos'}`}
            </h2>
            {!progreso ? (
              <div className="flex flex-col gap-3">
                <span className="text-[15px] text-fc-navy/72">¿De qué día son?</span>
                <div role="radiogroup" aria-label="Día" className="grid grid-cols-3 gap-2">
                  {DIAS.map((d) => {
                    const on = upDia === d.id
                    return (
                      <button
                        key={d.id}
                        role="radio"
                        aria-checked={on}
                        onClick={() => setUpDia(d.id)}
                        className="flex cursor-pointer flex-col items-start gap-0.5 rounded-2xl border-2 px-3.5 py-3 text-left text-fc-navy"
                        style={{ borderColor: on ? d.color : 'rgba(11,22,49,.15)', background: on ? d.tint : '#FFFFFF' }}
                      >
                        <span className="text-base font-extrabold">{d.label}</span>
                        <span className="text-[13px] opacity-80">{d.fecha}</span>
                      </button>
                    )
                  })}
                </div>
                <span className="text-[13px] text-fc-navy/60">Las fotos se guardan solo en este navegador.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <span className="text-[15px] text-fc-navy/72">Procesando {progreso.done} de {progreso.total}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-fc-navy/8">
                  <div className="fc-btn-gold h-full transition-[width] duration-300" style={{ width: `${Math.round((progreso.done / progreso.total) * 100)}%` }} />
                </div>
              </div>
            )}
            <div className="mt-1 flex flex-wrap justify-end gap-3">
              <button onClick={() => !progreso && setPendientes(null)} disabled={!!progreso} className="cursor-pointer rounded-full border border-fc-navy/18 bg-transparent px-[22px] py-[13px] text-[15px] font-semibold text-fc-navy">Cancelar</button>
              <button onClick={subir} disabled={!!progreso} className={`${ORO} cursor-pointer rounded-full border-0 px-[26px] py-[13px] text-base font-extrabold`}>{progreso ? 'Subiendo…' : 'Subir fotos'}</button>
            </div>
          </div>
        </div>
      )}

      {confirmar && (
        <div role="alertdialog" aria-modal="true" aria-label="Eliminar foto" className="fixed inset-0 z-[95] flex items-center justify-center bg-fc-navy/55 p-5 backdrop-blur-[6px]">
          <div className="flex w-full max-w-[420px] flex-col gap-3.5 rounded-[28px] bg-white p-7 text-fc-navy">
            <h2 className="m-0 font-display text-[28px] font-extrabold">¿Eliminar esta foto?</h2>
            <p className="m-0 text-base leading-[1.55] text-fc-navy/72">Se borrará de este navegador. Esta acción no se puede deshacer.</p>
            <div className="mt-2 flex justify-end gap-3">
              <button onClick={() => setConfirmar(null)} className="cursor-pointer rounded-full border border-fc-navy/18 bg-transparent px-5 py-3 text-[15px] font-semibold text-fc-navy">Cancelar</button>
              <button onClick={borrar} className="cursor-pointer rounded-full border-0 bg-fc-red px-[22px] py-3 text-[15px] font-bold text-white">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {lb >= 0 && vista[lb] && (
        <Visor
          fotos={vista}
          index={lb}
          origen={origen}
          onIndex={(i) => { setOrigen(null); setLb(i) }}
          onClose={cerrar}
          onDownload={descargarUna}
          onDelete={(p) => setConfirmar(p.id)}
        />
      )}
    </div>
  )
}
