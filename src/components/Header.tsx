import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { nav, site } from '../data/site'

export default function Header() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="sticky top-0 z-20 border-b border-line bg-night/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 text-ink hover:text-ink">
          <motion.div whileHover={{ rotate: 180 }} className="grid size-9 place-items-center rounded-full bg-gold font-display text-[15px] font-extrabold text-night">F</motion.div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold tracking-wide">{site.short}</span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">{site.venue}</span>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-5 text-sm font-medium">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end className={({ isActive }) => `group relative hover:text-ink ${isActive && n.to === '/galeria' ? 'text-gold' : 'text-ink'}`}>
              {({ isActive }) => (
                <>
                  {n.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gold transition-transform duration-300 group-hover:scale-x-100 ${isActive && n.to === '/galeria' ? 'scale-x-100' : 'scale-x-0'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} href="/#cronogramas" className="rounded-full bg-gold px-[18px] py-2.5 text-sm font-semibold text-night hover:bg-gold-soft hover:text-night">
          Cronograma general
        </motion.a>
      </div>
    </motion.header>
  )
}
