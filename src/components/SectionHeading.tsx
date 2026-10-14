import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <Reveal className="flex flex-col gap-3">
      <span className={`text-[13px] font-semibold uppercase tracking-[0.14em] ${light ? 'text-rust' : 'text-gold'}`}>{eyebrow}</span>
      <h2 className="m-0 font-display text-[clamp(36px,5vw,56px)] font-extrabold leading-none tracking-tight text-balance">{title}</h2>
    </Reveal>
  )
}
