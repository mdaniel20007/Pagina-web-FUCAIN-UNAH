# FUCAIN 2027

React + Vite + React Router + Tailwind v4 + Framer Motion (TypeScript).

```bash
npm install
npm run dev
```

- Página de inicio y cronogramas (diseño "FUCAIN Inicio", tema claro): contenido en `src/data/inicio.ts` — textos, fotos del hero, tarjetas de programación, contadores, carrusel, centros y universidades
- Cronograma por disciplina: `/cronograma/musica`, `/cronograma/escenicas`, `/cronograma/visuales` (eventos y PDF en `categorias[].items` de `src/data/inicio.ts`)
- Logos y gráficos del diseño: `public/img/`
- Contenido de la galería y su encabezado: `src/data/site.ts`
- Colores y fuentes: bloques `@theme` en `src/index.css` (los colores del diseño nuevo usan el prefijo `fc-`)
- PDF de cronogramas: `public/cronogramas/`
- Galería (/galeria): suelta las fotos en `src/assets/galeria/<categoria>/`; se detectan solas, con filtros, scroll infinito y visor (teclado, swipe, miniaturas)
- Imágenes: colócalas en `public/img/` y asigna la ruta (`image`, `src`, `logo`, `heroImage`) en `site.ts`
- Animaciones respetan `prefers-reduced-motion` (MotionConfig en `App.tsx`)
