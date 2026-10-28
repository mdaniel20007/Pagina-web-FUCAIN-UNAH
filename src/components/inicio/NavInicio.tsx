import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { navLinks } from '../../data/inicio'
import { EASE } from './fx'

const SECCIONES = ['programacion', 'galeria', 'universidades']

function NavA({ href, className, style, onClick, children }: { href: string; className?: string; style?: React.CSSProperties; onClick?: () => void; children: React.ReactNode }) {
  // Las anclas de esta página usan <a>; las rutas usan <Link>.
  if (href.startsWith('/#')) return <a href={href.slice(1)} className={className} style={style} onClick={onClick}>{children}</a>
  return <Link to={href} className={className} style={style} onClick={onClick}>{children}</Link>
}

export default function NavInicio() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let a = ''
      SECCIONES.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 140) a = id
      })
      setActive(a)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-fc-navy/8 shadow-[0_10px_30px_-24px_rgba(11,22,49,.5)] backdrop-blur-[14px] backdrop-saturate-[140%] transition-colors duration-300 fc-ease"
        style={{ background: scrolled ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.78)' }}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-6">
          <a href="#top" className="flex items-center gap-3.5" aria-label="FUCAIN · inicio">
            <img src="/img/unah-horizontal.png" alt="UNAH · Universidad Nacional Autónoma de Honduras" className="block h-[42px] w-auto" />
            <span className="h-[26px] w-px bg-fc-navy/15" />
            <span className="hidden items-center gap-3.5 wide:flex">
              <img src="/img/voae.png" alt="VOAE · Vicerrectoría de Orientación y Asuntos Estudiantiles" className="block h-[34px] w-auto" />
              <span className="h-[26px] w-px bg-fc-navy/15" />
            </span>
            <span className="flex size-[46px] items-center justify-center rounded-xl bg-white shadow-[0_6px_18px_-8px_rgba(11,22,49,.35)]">
              <img src="/img/fucain-color.png" alt="FUCAIN UNAH" className="size-[42px] object-contain" />
            </span>
          </a>

          <nav className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((l) => {
              const on = active === l.id
              return (
                <NavA
                  key={l.id}
                  href={l.href}
                  className="rounded-full px-4 py-[9px] text-sm font-semibold transition-colors duration-300 hover:text-fc-purple!"
                  style={{ color: on ? '#85328A' : '#0B1631', background: on ? 'rgba(133,50,138,.08)' : 'transparent' }}
                >
                  {l.label}
                </NavA>
              )
            })}
            <a href="#programacion" className="fc-btn-gold ml-2.5 inline-flex items-center gap-2 rounded-full px-[22px] py-[11px] text-sm font-bold text-fc-navy! shadow-[0_8px_24px_-10px_rgba(245,161,47,.7)] transition-transform duration-[350ms] fc-ease hover:scale-[1.04]">
              Ver programación
            </a>
          </nav>

          <button
            onClick={() => setMenu(true)}
            aria-label="Abrir menú"
            className="flex size-[46px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-fc-navy/15 bg-white md:hidden"
          >
            <span className="h-0.5 w-[18px] rounded-sm bg-fc-navy" />
            <span className="h-0.5 w-[18px] rounded-sm bg-fc-navy" />
            <span className="ml-1.5 h-0.5 w-3 rounded-sm bg-fc-navy" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col bg-white/98 px-7 pb-10 pt-7 backdrop-blur-[10px]"
          >
            <div className="flex items-center justify-between">
              <img src="/img/fucain-color.png" alt="FUCAIN" className="size-16 object-contain" />
              <button onClick={() => setMenu(false)} aria-label="Cerrar menú" className="size-[46px] cursor-pointer rounded-full border border-fc-navy/15 bg-white text-[22px] text-fc-navy">
                ×
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: EASE }}>
                  <NavA href={l.href} onClick={() => setMenu(false)} className="fc-display block py-2 text-[40px] text-fc-navy!">
                    {l.label}
                  </NavA>
                </motion.div>
              ))}
            </nav>
            <a href="#programacion" onClick={() => setMenu(false)} className="fc-btn-gold mt-auto flex justify-center rounded-full px-8 py-4 text-base font-bold text-fc-navy!">
              Ver programación
            </a>
            <div className="mt-6 flex items-center justify-center gap-5">
              <img src="/img/unah-horizontal.png" alt="UNAH" className="h-11 w-auto" />
              <img src="/img/voae.png" alt="VOAE" className="h-9 w-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
