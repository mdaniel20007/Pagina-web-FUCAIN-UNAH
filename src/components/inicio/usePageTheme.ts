import { useEffect } from 'react'

/** Fondo del <body> y título mientras la página está montada (las otras páginas usan el tema oscuro). */
export function usePageTheme(bg: string, title: string) {
  useEffect(() => {
    const prevBg = document.body.style.background
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const prevMeta = meta?.getAttribute('content')
    document.body.style.background = bg
    document.title = title
    meta?.setAttribute('content', bg)
    return () => {
      document.body.style.background = prevBg
      document.title = prevTitle
      if (prevMeta) meta?.setAttribute('content', prevMeta)
    }
  }, [bg, title])
}
