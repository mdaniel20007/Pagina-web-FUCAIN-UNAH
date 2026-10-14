import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Masonry from '../components/gallery/Masonry'
import Lightbox from '../components/gallery/Lightbox'
import Gallery, { grid } from '../components/gallery/Gallery'
import { categorias, fotos } from '../data/galeria'
import { ease } from '../components/Reveal'

const PAGE = 30

export default function GaleriaPage() {
  const [params, setParams] = useSearchParams()
  const filtro = params.get('categoria') ?? 'Todas'
  const [visible, setVisible] = useState(PAGE)
  const [open, setOpen] = useState<number | null>(null)
  const sentinel = useRef<HTMLDivElement>(null)

  const lista = useMemo(() => (filtro === 'Todas' ? fotos : fotos.filter((f) => f.categoria === filtro)), [filtro])
  const shown = lista.slice(0, visible)

  useEffect(() => setVisible(PAGE), [filtro])

  // scroll infinito
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible((v) => Math.min(v + PAGE, lista.length)), { rootMargin: '800px' })
    io.observe(el)
    return () => io.disconnect()
  }, [lista.length])

  const setFiltro = (c: string) => setParams(c === 'Todas' ? {} : { categoria: c }, { replace: true })

  return (
    <div id="top" className="min-h-screen overflow-x-clip">
      <Header />
      <main className="mx-auto max-w-[1400px] px-6 pb-24">
        <section className="flex flex-col gap-8 pb-8 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <Link to="/" className="text-sm font-semibold">← Volver al inicio</Link>
              <h1 className="m-0 overflow-hidden font-display text-[clamp(56px,10vw,140px)] font-extrabold leading-[0.88] tracking-[-0.03em]">
                <motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }} className="block">Galería</motion.span>
              </h1>
              <motion.span key={filtro} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[17px] text-muted">
                {lista.length} {lista.length === 1 ? 'foto' : 'fotos'}{filtro !== 'Todas' && ` en ${filtro}`}
              </motion.span>
            </div>
          </div>

          <LayoutGroup>
            <div className="flex flex-wrap gap-2 border-b border-line pb-5">
              {categorias.map((c) => {
                const active = c === filtro
                const n = c === 'Todas' ? fotos.length : fotos.filter((f) => f.categoria === c).length
                return (
                  <button key={c} onClick={() => setFiltro(c)} className={`relative flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${active ? 'border-transparent font-semibold text-night' : 'border-line-strong text-ink hover:border-gold'}`}>
                    {active && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative">{c}</span>
                    <span className={`relative text-xs ${active ? 'opacity-70' : 'text-muted'}`}>{n}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
        </section>

        <div className="-mx-6 pb-16">
          <Gallery items={lista} arrange={grid({ columns: 6, fill: 'offset', rotateX: 20, bulge: 120 })} onOpen={setOpen} />
        </div>

        {lista.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-line-strong px-8 py-24 text-center">
            <div className="flex max-w-md flex-col gap-3">
              <span className="font-display text-3xl font-extrabold">Aún no hay fotos</span>
              <span className="text-muted">Agrega imágenes en <code className="text-gold">src/assets/galeria/&lt;categoria&gt;/</code> y se mostrarán automáticamente.</span>
            </div>
          </div>
        ) : (
          <Masonry items={shown} onOpen={setOpen} />
        )}
        <div ref={sentinel} className="h-px" />
        {visible < lista.length && (
          <div className="flex justify-center pt-6">
            <button onClick={() => setVisible((v) => v + PAGE)} className="cursor-pointer rounded-full border border-line-strong px-7 py-3.5 font-semibold text-ink hover:border-gold">
              Cargar más ({lista.length - visible} restantes)
            </button>
          </div>
        )}
      </main>
      <Footer />
      <AnimatePresence>
        {open !== null && <Lightbox items={lista} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
      </AnimatePresence>
    </div>
  )
}
