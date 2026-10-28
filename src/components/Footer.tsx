import { Link } from 'react-router'
import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-night-3">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[22px] font-extrabold">{site.short}</span>
          <span className="text-sm leading-normal text-muted">{site.name}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.1em] text-muted">Organiza</span>
          <span className="text-[15px]">{site.organiza}</span>
          <span className="text-sm text-muted">{site.marco}</span>
        </div>
        <div className="flex flex-col gap-2 text-[15px]">
          <span className="text-xs uppercase tracking-[0.1em] text-muted">Navegación</span>
          <Link to="/#programacion">Programación</Link>
          <Link to="/#universidades">Participantes</Link>
          <Link to="/galeria">Galería</Link>
          <a href="#top">Volver arriba ↑</a>
        </div>
      </div>
      <div className="mx-auto max-w-[1240px] border-t border-line px-6 py-[18px] text-[13px] text-muted">© 2027 Fucain</div>
    </footer>
  )
}
