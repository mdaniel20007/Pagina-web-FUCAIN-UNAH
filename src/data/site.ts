export type Disciplina = { slug: string; name: string; image?: string }
export type Cronograma = { label: string; href: string }
export type Cifra = { value: number | string; label: string }
export type Patrocinador = { name: string; logo?: string; href?: string }

export const site = {
  short: 'FUCAIN 2027',
  name: '[Nombre completo del evento]',
  tagline: '[Descripción breve del evento en una o dos líneas.]',
  dates: '[DD — DD mes 2027]',
  venue: '[Sede, Ciudad]',
  heroImage: undefined as string | undefined,
  about: {
    title: '[Titular que resume el propósito de Fucain]',
    body: '[Párrafo sobre el evento: quién organiza, a quién convoca y qué ocurre durante esos días.]',
  },
  organiza: '[Institución organizadora]',
  marco: '[Coorganizadores / marco institucional]',
}

export const nav = [
  { to: '/#evento', label: 'Evento' },
  { to: '/#disciplinas', label: 'Disciplinas' },
  { to: '/#cronogramas', label: 'Cronogramas' },
  { to: '/galeria', label: 'Galería' },
  { to: '/#patrocinadores', label: 'Patrocinadores' },
]

export const disciplinas: Disciplina[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `categoria-${i + 1}`,
  name: `Categoría ${i + 1}`,
}))

export const cronogramas: Cronograma[] = [
  { label: 'Cronograma general', href: '/cronogramas/general.pdf' },
  ...disciplinas.map((d) => ({ label: d.name, href: `/cronogramas/${d.slug}.pdf` })),
]

export const cifras: Cifra[] = [
  { value: '[N]', label: 'días' },
  { value: '[N]', label: 'participantes' },
  { value: disciplinas.length, label: 'disciplinas' },
]


export const patrocinadores: Patrocinador[] = Array.from({ length: 8 }, (_, i) => ({ name: `Patrocinador ${i + 1}` }))
