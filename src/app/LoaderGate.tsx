'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'

function waitImg(el: HTMLImageElement) {
  if (el.complete) return Promise.resolve()
  return new Promise<void>((res) => {
    const done = () => { el.removeEventListener('load', done); el.removeEventListener('error', done); res() }
    el.addEventListener('load', done); el.addEventListener('error', done)
  })
}

function waitVideo(el: HTMLVideoElement) {
  if (el.readyState >= 3) return Promise.resolve()
  return new Promise<void>((res) => {
    const done = () => { 
      el.removeEventListener('canplaythrough', done)
      el.removeEventListener('loadeddata', done)
      el.removeEventListener('error', done)
      res()
    }
    el.addEventListener('canplaythrough', done)
    el.addEventListener('loadeddata', done)
    el.addEventListener('error', done)
    
    // Timeout específico por video para iOS (3 segundos)
    setTimeout(() => {
      console.warn('[LoaderGate] Video timeout individual alcanzado')
      done()
    }, 3000)
  })
}

// Detectar iOS/Safari
function isIOS() {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

async function waitPreloadedMedia() {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-preload="true"], picture img[data-preload="true"]'))
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-preload="true"]'))
  
  console.log('[LoaderGate] Esperando recursos:', { imagenes: imgs.length, videos: videos.length, isIOS: isIOS() })
  
  // En iOS, intentar forzar reproducción de videos
  if (isIOS()) {
    videos.forEach(video => {
      video.muted = true
      video.play().catch(e => console.warn('[LoaderGate] Error autoplay iOS:', e))
    })
  }
  
  // Timeout reducido para iOS (5s) vs otros navegadores (10s)
  const timeoutDuration = isIOS() ? 5000 : 10000
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.warn('[LoaderGate] Timeout alcanzado - cargando página de todos modos')
      resolve()
    }, timeoutDuration)
  })
  
  const loadPromise = Promise.all([...imgs.map(waitImg), ...videos.map(waitVideo)])
    .then(() => {
      console.log('[LoaderGate] Todos los recursos cargados correctamente')
    })
  
  await Promise.race([loadPromise, timeoutPromise])
}

export default function LoaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [show, setShow] = useState(true)
  const first = useRef(true)
  const minDelay = 350
  const videoRef = useRef<HTMLVideoElement>(null)

  const run = useMemo(() => {
    return async () => {
      setShow(true)
      const t0 = performance.now()
      await new Promise(r => setTimeout(r, 0))
      await waitPreloadedMedia()
      const elapsed = performance.now() - t0
      const remaining = Math.max(0, minDelay - elapsed)
      if (remaining) await new Promise(r => setTimeout(r, remaining))
      setShow(false)
    }
  }, [])

  useEffect(() => {
    if (first.current) { first.current = false; run() }
  }, [run])

  useEffect(() => { if (!first.current) run() }, [pathname, run])
  
  // Intentar forzar reproducción del video del loader en iOS
  useEffect(() => {
    if (show && videoRef.current && isIOS()) {
      videoRef.current.muted = true
      videoRef.current.play().catch(e => {
        console.warn('[LoaderGate] No se pudo reproducir video del loader:', e)
      })
    }
  }, [show])

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-[1000] bg-black">
          <div className="w-full h-full relative flex items-center justify-center">
            
            {/* Video de fondo */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/loading/poster.jpg"
              aria-hidden="true"
              style={{
                WebkitTransform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <source src="/videos/loader.mp4#t=0.001" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
