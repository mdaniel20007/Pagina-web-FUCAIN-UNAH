export default function ImageBox({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />
  ) : (
    <div className={`grid h-full w-full place-items-center bg-night-2 text-sm text-muted ${className}`} aria-label={alt}>
      {alt}
    </div>
  )
}
