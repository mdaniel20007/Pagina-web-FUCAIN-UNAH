import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PapelPicado } from '../inicio/fx'

const FRANJA =
  'linear-gradient(90deg,#E84E2B 0 10%,#F5A12F 10% 20%,#FBC102 20% 30%,#12AC9C 30% 40%,#85328A 40% 50%,#E84E2B 50% 60%,#F5A12F 60% 70%,#FBC102 70% 80%,#12AC9C 80% 90%,#85328A 90% 100%)'

const LINK = 'rounded-full px-4 py-[9px] text-sm font-semibold transition-colors duration-300'

export default function GaleriaHeader() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 120)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="h-[68px] bg-fc-navy/94 backdrop-blur-[14px] backdrop-saturate-[140%]">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-5 px-6">
          <Link to="/" aria-label="FUCAIN · Ir al inicio" className="flex items-center gap-3.5">
            <img src="/img/unah-blanco.png" alt="UNAH" className="block h-[42px] w-auto" />
            <span className="h-[26px] w-px bg-fc-cream/30" />
            <span className="hidden items-center gap-3.5 wide:flex">
              <img src="/img/voae-blanco.png" alt="VOAE" className="block h-[34px] w-auto" />
              <span className="h-[26px] w-px bg-fc-cream/30" />
            </span>
            <span className="flex size-[46px] items-center justify-center rounded-xl bg-fc-cream shadow-[0_6px_18px_-6px_rgba(0,0,0,.4)]">
              <img src="/img/fucain-color.png" alt="FUCAIN UNAH" className="size-[42px] object-contain" />
            </span>
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-1.5 min-[900px]:flex">
            <Link to="/#programacion" className={`${LINK} text-fc-cream/85 hover:text-fc-yellow`}>Programación</Link>
            <Link to="/galeria" aria-current="page" className={`${LINK} bg-white/6 text-fc-yellow`}>Galería</Link>
            <Link to="/#universidades" className={`${LINK} text-fc-cream/85 hover:text-fc-yellow`}>Participantes</Link>
          </nav>
          <Link
            to="/"
            className="fc-btn-gold inline-flex items-center gap-2 whitespace-nowrap rounded-full px-[22px] py-[11px] text-sm font-bold text-fc-navy shadow-[0_12px_32px_-12px_rgba(245,161,47,.7)] transition-transform duration-[350ms] fc-ease hover:scale-[1.04]"
          >
            ← <span className="min-[520px]:hidden">Inicio</span><span className="hidden min-[520px]:inline">Volver al inicio</span>
          </Link>
        </div>
      </div>
      <div className="h-[3px]" style={{ background: FRANJA }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-[130px] overflow-hidden transition-opacity duration-500 fc-ease" style={{ opacity: scrolled ? 0 : 1 }}>
        <div className="sm:hidden"><PapelPicado count={16} top={0} /></div>
        <div className="hidden sm:block"><PapelPicado count={30} top={0} /></div>
      </div>
    </header>
  )
}
