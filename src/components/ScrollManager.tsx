import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Al cambiar de ruta: va al ancla (#evento…) o al inicio de la página. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}
