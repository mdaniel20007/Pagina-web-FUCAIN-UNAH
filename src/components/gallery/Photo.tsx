import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-night-2 ${loaded ? '' : 'min-h-56 animate-pulse'} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.08, filter: loaded ? 'blur(0px)' : 'blur(12px)' }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="block h-auto w-full"
      />
    </div>
  )
}
