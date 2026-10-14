# FUCAIN 2027

React + Vite + React Router + Tailwind v4 + Framer Motion (TypeScript).

```bash
npm install
npm run dev
```

- Contenido (textos, fechas, disciplinas, fotos, patrocinadores): `src/data/site.ts`
- Colores y fuentes: bloque `@theme` en `src/index.css`
- PDF de cronogramas: `public/cronogramas/`
- Galería (/galeria): suelta las fotos en `src/assets/galeria/<categoria>/`; se detectan solas, con filtros, scroll infinito y visor (teclado, swipe, miniaturas)
- Imágenes: colócalas en `public/img/` y asigna la ruta (`image`, `src`, `logo`, `heroImage`) en `site.ts`
- Animaciones respetan `prefers-reduced-motion` (MotionConfig en `App.tsx`)
