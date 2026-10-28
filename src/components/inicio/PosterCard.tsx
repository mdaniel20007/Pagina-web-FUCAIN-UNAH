import type { ReactNode } from 'react'
import { Foto } from './fx'

/** Tarjeta-póster con foto, degradado de color, figuras y texto abajo. */
export default function PosterCard({
  tag, titulo, desc, base, overlay, shade, image, action, className = 'h-[380px] md:h-[420px]', padding = 'p-9',
}: {
  tag: string
  titulo: string
  desc: string
  base: string
  overlay: string
  shade: string
  image?: string
  action: ReactNode
  className?: string
  padding?: string
}) {
  return (
    <article
      className={`relative z-[1] overflow-hidden transition-[transform,box-shadow] duration-500 fc-ease hover:z-[2] hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(11,22,49,.55)] ${className}`}
      style={{ background: base }}
    >
      <Foto src={image} alt={titulo} />
      <div className="pointer-events-none absolute inset-0" style={{ background: overlay }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: shade }} />
      <div className="pointer-events-none absolute -right-[46px] -top-[46px] size-[170px] rounded-full border-2 border-fc-cream/35" />
      <div className="pointer-events-none absolute -bottom-[34px] right-12 size-24 rotate-45 bg-fc-cream/14" />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 ${padding}`}>
        <span className="text-[11.5px] font-black tracking-[0.25em] text-fc-cream opacity-90">{tag}</span>
        <h3 className="fc-display m-0 text-[30px] leading-[1.05] text-fc-cream">{titulo}</h3>
        <p className="m-0 max-w-[320px] text-base leading-[1.55] text-fc-cream/90">{desc}</p>
        <div className="pointer-events-auto mt-1.5">{action}</div>
      </div>
    </article>
  )
}

export const GLASS_BTN =
  'inline-flex items-center gap-2.5 rounded-full border border-fc-cream/30 bg-fc-cream/12 px-5 py-2.5 text-sm font-semibold text-fc-cream backdrop-blur-[8px] transition-[transform,background-color] duration-[350ms] fc-ease hover:scale-105 hover:bg-fc-cream/22 hover:text-fc-cream'
