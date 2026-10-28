/**
 * Contenido de la página de inicio (diseño "FUCAIN Inicio").
 * Las fotos son opcionales: coloca el archivo en public/img/ y asigna la ruta en `image`
 * (ej. image: '/img/hero-1.jpg'). Sin foto se muestra el degradado de color.
 */

export const inicio = {
  edicion: '2026',
  eyebrow: 'EDICIÓN 2026 · HONDURAS',
  titulo: ['Arte, cultura', 'e identidad'],
  subtitulo: 'Festival Universitario · UNAH 2026',
  nombreCompleto: '[Nombre completo del festival]',
  fechaLimite: '[fecha límite]',
}

export const navLinks = [
  { href: '/#programacion', label: 'Programación', id: 'programacion' },
  { href: '/galeria', label: 'Galería', id: 'galeria' },
  { href: '/#universidades', label: 'Participantes', id: 'universidades' },
]

/** Fotos del carrusel del hero (cambian cada 6 s). */
export const heroSlides: { bg: string; image?: string; alt: string }[] = [
  { bg: 'linear-gradient(135deg,#FBC102,#F5A12F 55%,#E84E2B)', alt: 'Escenario con público' },
  { bg: 'linear-gradient(135deg,#12AC9C,#7ECBE3)', alt: 'Danza o teatro' },
  { bg: 'linear-gradient(135deg,#85328A,#E84E2B)', alt: 'Músicos en tarima' },
]

export type Categoria = 'musica' | 'escenicas' | 'visuales'

export type CategoriaInfo = {
  slug: Categoria
  numero: string
  label: string
  titulo: string
  descripcion: string
  eyebrow: string
  eyebrowColor: string
  intro: string
  base: string
  overlay: string
  shade: string
  image?: string
  /** Eventos del cronograma: [etiqueta, título, descripción, pdf opcional] */
  items: { tag: string; titulo: string; desc: string; pdf?: string; image?: string }[]
}

const it = (tag: string, titulo: string, desc: string) => ({ tag, titulo, desc })

export const categorias: CategoriaInfo[] = [
  {
    slug: 'musica',
    numero: '01',
    label: 'Música',
    titulo: 'Música',
    descripcion: 'Conciertos, coros, ensambles y solistas de los centros regionales.',
    eyebrow: 'CRONOGRAMA 01 · MÚSICA',
    eyebrowColor: '#C9391A',
    intro: 'Horarios, escenarios y agrupaciones participantes en las jornadas musicales de FUCAIN 2026.',
    base: 'linear-gradient(135deg,#3b1f2a,#1d1a33)',
    overlay: 'linear-gradient(135deg, rgba(201,57,26,.86) 0%, rgba(245,161,47,.72) 100%)',
    shade: 'linear-gradient(180deg, rgba(11,22,49,0) 30%, rgba(11,22,49,.62) 100%)',
    items: [
      it('DÍA 1 · [FECHA]', 'Concierto inaugural', 'Orquesta y coro universitario en la noche de apertura.'),
      it('DÍA 2 · [FECHA]', 'Coros y ensambles', 'Encuentro coral de los centros regionales.'),
      it('DÍA 2 · [FECHA]', 'Música hondureña', 'Garífuna, punta y tradición popular en vivo.'),
      it('DÍA 3 · [FECHA]', 'Solistas', 'Voces e instrumentistas en formato acústico.'),
      it('DÍA 4 · [FECHA]', 'Bandas universitarias', 'Rock, fusión y propuestas emergentes.'),
      it('DÍA 5 · [FECHA]', 'Gran clausura', 'Presentación conjunta de todas las delegaciones.'),
    ],
  },
  {
    slug: 'escenicas',
    numero: '02',
    label: 'Artes escénicas',
    titulo: 'Artes escénicas',
    descripcion: 'Teatro, danza folclórica y contemporánea, y performance en salas y espacios abiertos.',
    eyebrow: 'CRONOGRAMA 02 · ARTES ESCÉNICAS',
    eyebrowColor: '#85328A',
    intro: 'Teatro, danza y performance: consulta funciones, salas y compañías participantes.',
    base: 'linear-gradient(135deg,#1b2346,#2a1838)',
    overlay: 'linear-gradient(135deg, rgba(31,60,119,.88) 0%, rgba(133,50,138,.8) 100%)',
    shade: 'linear-gradient(180deg, rgba(11,22,49,0) 30%, rgba(11,22,49,.55) 100%)',
    items: [
      it('DÍA 1 · [FECHA]', 'Danza folclórica', 'Cuadros tradicionales de las regiones del país.'),
      it('DÍA 2 · [FECHA]', 'Teatro universitario', 'Montajes de los grupos de teatro de la UNAH.'),
      it('DÍA 2 · [FECHA]', 'Danza contemporánea', 'Coreografías originales de estudiantes.'),
      it('DÍA 3 · [FECHA]', 'Teatro de calle', 'Funciones itinerantes en plazas y pasillos.'),
      it('DÍA 4 · [FECHA]', 'Performance', 'Propuestas escénicas experimentales.'),
      it('DÍA 5 · [FECHA]', 'Muestra final', 'Lo mejor de la semana en una sola función.'),
    ],
  },
  {
    slug: 'visuales',
    numero: '03',
    label: 'Artes visuales y cine',
    titulo: 'Artes visuales',
    descripcion: 'Exposiciones, muestras de cortometraje, muralismo y talleres abiertos.',
    eyebrow: 'CRONOGRAMA 03 · ARTES VISUALES Y CINE',
    eyebrowColor: '#0B7D71',
    intro: 'Exposiciones, proyecciones y talleres abiertos a toda la comunidad universitaria.',
    base: 'linear-gradient(135deg,#2c3318,#1a2a2a)',
    overlay: 'linear-gradient(135deg, rgba(214,160,0,.82) 0%, rgba(62,128,24,.86) 100%)',
    shade: 'linear-gradient(180deg, rgba(11,22,49,0) 20%, rgba(11,22,49,.7) 100%)',
    items: [
      it('DÍA 1 · [FECHA]', 'Exposición colectiva', 'Pintura, escultura y gráfica de estudiantes.'),
      it('DÍA 2 · [FECHA]', 'Muralismo en vivo', 'Intervención mural en el campus.'),
      it('DÍA 2 · [FECHA]', 'Fotografía', 'Muestra “Identidad en imágenes”.'),
      it('DÍA 3 · [FECHA]', 'Cortometrajes', 'Proyección y foro con realizadores.'),
      it('DÍA 4 · [FECHA]', 'Talleres abiertos', 'Máscaras, serigrafía y cerámica.'),
      it('DÍA 5 · [FECHA]', 'Premiación', 'Reconocimiento a las obras destacadas.'),
    ],
  },
]

/** Degradados de las tarjetas del cronograma (uno por evento). */
export const cronogramaOverlays = [
  'linear-gradient(135deg, rgba(201,57,26,.86), rgba(245,161,47,.72))',
  'linear-gradient(135deg, rgba(31,60,119,.88), rgba(133,50,138,.8))',
  'linear-gradient(135deg, rgba(214,160,0,.82), rgba(62,128,24,.86))',
  'linear-gradient(135deg, rgba(10,125,113,.88), rgba(31,60,119,.8))',
  'linear-gradient(135deg, rgba(133,50,138,.88), rgba(201,57,26,.78))',
  'linear-gradient(135deg, rgba(31,60,119,.86), rgba(18,172,156,.74))',
]

export const contadores = [
  { valor: 850, sufijo: '+', label: 'ARTISTAS', bg: '#C9391A', fg: '#FFF8EE', icon: 'mic' },
  { valor: 120, sufijo: '+', label: 'PRESENTACIONES', bg: '#FBC102', fg: '#0B1631', icon: 'ticket' },
  { valor: 12, sufijo: '', label: 'CENTROS UNIVERSITARIOS', bg: '#12AC9C', fg: '#0B1631', icon: 'pin' },
  { valor: 5, sufijo: '', label: 'DÍAS DE FESTIVAL', bg: '#85328A', fg: '#FFF8EE', icon: 'calendar' },
] as const

export const galeriaInicio = {
  titulo: 'Momentos de la edición 2025',
  texto: 'Revive las presentaciones, ensayos y encuentros que llenaron de color los campus.',
}

export const slides: { tag: string; cap: string; bg: string; image?: string }[] = [
  { tag: 'INAUGURACIÓN', cap: 'Noche de apertura', bg: 'linear-gradient(135deg,#3d1c2c,#0B1631)' },
  { tag: 'MÚSICA', cap: 'Coro universitario', bg: 'linear-gradient(135deg,#123f4a,#0B1631)' },
  { tag: 'DANZA', cap: 'Ballet folclórico', bg: 'linear-gradient(135deg,#4a2a10,#0B1631)' },
  { tag: 'TEATRO', cap: 'Función en el Paraninfo', bg: 'linear-gradient(135deg,#2c1a45,#0B1631)' },
  { tag: 'ARTES VISUALES', cap: 'Mural colectivo', bg: 'linear-gradient(135deg,#2d3a14,#0B1631)' },
  { tag: 'CINE', cap: 'Muestra de cortometrajes', bg: 'linear-gradient(135deg,#13294f,#0B1631)' },
  { tag: 'MÚSICA', cap: 'Banda de marcha', bg: 'linear-gradient(135deg,#4a1a14,#0B1631)' },
  { tag: 'TALLERES', cap: 'Taller de máscaras', bg: 'linear-gradient(135deg,#3a3010,#0B1631)' },
  { tag: 'CLAUSURA', cap: 'Gran cierre', bg: 'linear-gradient(135deg,#2a1438,#0B1631)' },
]

export const centros = [
  { code: 'CU', city: 'TEGUCIGALPA', name: 'Ciudad Universitaria', bg: '#85328A', fg: '#FFF8EE' },
  { code: 'VS', city: 'SAN PEDRO SULA', name: 'UNAH Valle de Sula', bg: '#12AC9C', fg: '#0B1631' },
  { code: 'CURLA', city: 'LA CEIBA', name: 'UNAH-CURLA', bg: '#C9391A', fg: '#FFF8EE' },
  { code: 'CURC', city: 'COMAYAGUA', name: 'UNAH-CURC', bg: '#FBC102', fg: '#0B1631' },
  { code: 'CURLP', city: 'CHOLUTECA', name: 'UNAH-CURLP', bg: '#1F3C77', fg: '#FFF8EE' },
  { code: 'CURNO', city: 'JUTICALPA', name: 'UNAH-CURNO', bg: '#66B32F', fg: '#0B1631' },
  { code: 'CUROC', city: 'SANTA ROSA DE COPÁN', name: 'UNAH-CUROC', bg: '#F5A12F', fg: '#0B1631' },
  { code: 'TEC', city: 'DANLÍ', name: 'UNAH-TEC Danlí', bg: '#7ECBE3', fg: '#0B1631' },
  { code: 'TEC', city: 'VALLE DEL AGUÁN', name: 'UNAH-TEC Aguán', bg: '#0B1631', fg: '#FBC102' },
]

/** Logos de universidades participantes. Sin `logo` se muestra un recuadro punteado. */
export const universidades: { name: string; logo?: string }[] = [
  { name: 'UNAH', logo: '/img/unah-horizontal.png' },
  { name: 'UNITEC', logo: '/img/unitec.jpg' },
  { name: '[Universidad 3]' },
  { name: '[Universidad 4]' },
  { name: '[Universidad 5]' },
  { name: '[Universidad 6]' },
  { name: '[Universidad 7]' },
  { name: '[Universidad 8]' },
]
