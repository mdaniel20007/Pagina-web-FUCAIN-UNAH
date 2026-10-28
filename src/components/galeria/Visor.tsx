import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { diaDe, type Foto } from '../../data/galeria'

type Props = {
  fotos: Foto[]
  index: number
  origen: DOMRect | null
  onIndex: (i: number) => void
  onClose: () => void
  onDownload: (p: Foto) => void
  onDelete: (p: Foto) => void
}

const DL = 'M12 4v11M7 10l5 5 5-5M5 20h14'
const EASE = 'cubic-bezier(.23,1,.32,1)'

/** Visor a pantalla completa: flechas, teclado, deslizar, tira de miniaturas, descarga y borrado. */
export default function Visor({ fotos, index, origen, onIndex, onClose, onDownload, onDelete }: Props) {
  const cur = fotos[index]
  const d = diaDe(cur.dia)
  const boxRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const sw = useRef<number | null>(null)
  const [ratio, setRatio] = useState<number>(cur.w && cur.h ? cur.w / cur.h : 0.75)
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const step = (k: number) => onIndex((index + k + fotos.length) % fotos.length)

  useEffect(() => setRatio(cur.w && cur.h ? cur.w / cur.h : 0.75), [cur])

  // Animación desde la miniatura (FLIP)
  useLayoutEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const box = boxRef.current
    if (!box || !origen || reduced) return
    const r = box.getBoundingClientRect()
    if (!r.width) return
    box.animate(
      [
        { transformOrigin: '0 0', transform: `translate(${origen.left - r.left}px,${origen.top - r.top}px) scale(${origen.width / r.width},${origen.height / r.height})` },
        { transformOrigin: '0 0', transform: 'none' },
      ],
      { duration: 520, easing: EASE },
    )
    // solo al abrir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const s = stripRef.current
    const a = s?.querySelector<HTMLElement>('[data-active="true"]')
    if (s && a) s.scrollTo({ left: a.offsetLeft - s.clientWidth / 2 + a.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' })
  }, [index, reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div role="dialog" aria-modal="true" aria-label="Visor de fotos" className="fixed inset-0 z-[70] flex flex-col bg-fc-navy/97 text-white">
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3.5">
        <span className="rounded-full bg-white/10 px-3.5 py-2 text-sm font-bold tabular-nums">{index + 1} / {fotos.length}</span>
        <span className="inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-[7px] text-sm font-semibold" style={{ borderColor: d.color }}>
          <span className="size-2.5 rounded-full" style={{ background: d.color }} />
          {d.label} · {d.fecha}
        </span>
        <span className="flex-1" />
        <button
          onClick={() => onDownload(cur)}
          aria-label="Descargar foto original"
          className="fc-btn-gold inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-full border-0 px-[22px] text-base font-bold text-fc-navy shadow-[0_10px_24px_-10px_rgba(245,161,47,.7)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={DL} /></svg>
          Descargar
        </button>
        {cur.local && (
          <button onClick={() => onDelete(cur)} aria-label="Eliminar foto" className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/22 bg-white/8 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
          </button>
        )}
        <button ref={closeRef} onClick={onClose} aria-label="Cerrar visor" className="size-12 cursor-pointer rounded-full border-0 bg-white text-2xl text-fc-navy">×</button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          sw.current = e.clientX
        }}
        onPointerMove={(e) => {
          if (sw.current === null || !boxRef.current) return
          const dx = e.clientX - sw.current
          boxRef.current.style.transform = `translateX(${dx}px) rotate(${dx / 60}deg)`
        }}
        onPointerUp={(e) => {
          if (sw.current === null) return
          const dx = e.clientX - sw.current
          sw.current = null
          const box = boxRef.current
          if (box) {
            box.style.transition = `transform .35s ${EASE}`
            box.style.transform = ''
            setTimeout(() => { box.style.transition = '' }, 360)
          }
          if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1)
        }}
        onPointerCancel={() => {
          sw.current = null
          if (boxRef.current) boxRef.current.style.transform = ''
        }}
      >
        <div
          ref={boxRef}
          className="relative overflow-hidden rounded-[14px] bg-[#14244A] shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
          style={{ width: `min(92vw, calc((100svh - 240px) * ${ratio.toFixed(4)}))`, aspectRatio: ratio.toFixed(4) }}
        >
          <img src={cur.src} alt={cur.alt} draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
          <img
            key={cur.full}
            src={cur.full}
            alt=""
            aria-hidden
            draggable={false}
            onLoad={(e) => {
              const im = e.currentTarget
              im.style.opacity = '1'
              if (!(cur.w && cur.h) && im.naturalWidth) setRatio(im.naturalWidth / im.naturalHeight)
            }}
            className="absolute inset-0 h-full w-full select-none object-cover opacity-0 transition-opacity duration-[400ms]"
          />
        </div>
        {[
          { k: -1, label: 'Foto anterior', pos: 'left-4', icon: '←' },
          { k: 1, label: 'Foto siguiente', pos: 'right-4', icon: '→' },
        ].map((b) => (
          <button
            key={b.k}
            onClick={() => step(b.k)}
            aria-label={b.label}
            className={`absolute top-1/2 size-[52px] -translate-y-1/2 cursor-pointer rounded-full border-0 bg-white text-xl text-fc-navy shadow-[0_10px_24px_-8px_rgba(0,0,0,.5)] ${b.pos}`}
          >
            {b.icon}
          </button>
        ))}
      </div>

      <div ref={stripRef} className="flex gap-2 overflow-x-auto px-4 pb-[18px] pt-3.5">
        {fotos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onIndex(i)}
            aria-label={`Ver foto ${i + 1}`}
            data-active={i === index}
            className="h-[54px] w-[72px] flex-none cursor-pointer overflow-hidden rounded-[10px] border-[3px] bg-[#14244A] p-0 transition-[opacity,border-color] duration-250"
            style={{ borderColor: i === index ? diaDe(p.dia).color : 'transparent', opacity: i === index ? 1 : 0.55 }}
          >
            <img src={p.src} alt="" loading="lazy" decoding="async" className="block h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
