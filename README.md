# FUCAIN 2026

React + Vite + React Router + Tailwind v4 + Framer Motion (TypeScript).

Rutas: `/` inicio, `/cronograma/:categoria`, `/galeria`.

```bash
npm install
npm run dev
```

- Página de inicio y cronogramas (diseño "FUCAIN Inicio", tema claro): contenido en `src/data/inicio.ts` — textos, fotos del hero, tarjetas de programación, contadores, carrusel, centros y universidades
- Cronograma por disciplina: `/cronograma/musica`, `/cronograma/escenicas`, `/cronograma/visuales` (eventos y PDF en `categorias[].items` de `src/data/inicio.ts`)
- Logos y gráficos del diseño: `public/img/`
- Colores y fuentes: bloque `@theme` en `src/index.css` (colores con prefijo `fc-`)
- PDF de cronogramas: `public/cronogramas/` (asigna la ruta en `pdf` de cada evento en `src/data/inicio.ts`)
- Galería (/galeria): fotos en `src/assets/galeria/dia-1/`, `dia-2/`, `dia-3/`; fechas de los días en `src/data/galeria.ts`. Muro 3D, filtros por día, visor, descargas (foto, día o selección en ZIP) y subida de fotos desde el navegador
- Fotos de inicio y cronogramas: colócalas en `public/img/` y asigna la ruta en `image` dentro de `src/data/inicio.ts`
- Animaciones respetan `prefers-reduced-motion` (MotionConfig en `App.tsx` y CSS)
