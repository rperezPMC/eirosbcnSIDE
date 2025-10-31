'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'

interface VideoSlide {
  id: number
  videoSrc: string
  title: string
  subtitle: string
}

const slides: VideoSlide[] = [
  { id: 1, videoSrc: '/videos/home/carousel/vacum.mp4',          title: 'VACUUM PACKED',         subtitle: 'Air removed and sealed' },
  { id: 2, videoSrc: '/videos/home/carousel/vacum_chamber.mp4',  title: 'AUTOCLAVES COMPOSITES', subtitle: 'Ensuring maximum performance' },
  { id: 3, videoSrc: '/videos/home/carousel/lightweight.mp4',   title: 'PERFECTION',            subtitle: 'In all the details' },
  { id: 4, videoSrc: '/videos/home/carousel/perfection.mp4',   title: 'QUALITY CONTROL',       subtitle: 'Every piece inspected' }
]

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(0)

  // Responsive container
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1440)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        setContainerWidth(Math.max(0, Math.min(1440, w)))
      }
    })
    ro.observe(el)
    setContainerWidth(Math.max(0, Math.min(1440, el.clientWidth)))
    return () => ro.disconnect()
  }, [])

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }
  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }
  const handleVideoEnd = () => goToNext()

  // Auto avance cada 6 s
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(goToNext, 6000)
    return () => clearInterval(timer)
  }, [isPaused, currentIndex])

  // Reproducir video cuando se selecciona
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [currentIndex])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80
    if (info.offset.x > threshold) goToPrevious()
    else if (info.offset.x < -threshold) goToNext()
    setIsPaused(false)
  }

  const slideWidth = containerWidth <= 768 ? containerWidth * 0.9 : 880
  const slideGap = containerWidth <= 768 ? 20 : 46
  const slideOffset = slideWidth + slideGap
  const centerPosition = (containerWidth - slideWidth) / 2
  

  const N = slides.length
  const HALF = Math.floor(N / 2)
  const normDelta = (d: number) => {
    if (d > HALF) d -= N
    else if (d < -HALF) d += N
    return d
  }

  const getSlidePosition = (i: number) => centerPosition + normDelta(i - currentIndex) * slideOffset
  const shouldRenderSlide = (i: number) => Math.abs(normDelta(i - currentIndex)) <= 1
  const getZIndex = (i: number) => (normDelta(i - currentIndex) === 0 ? 30 : 20 - Math.abs(normDelta(i - currentIndex)))

  const spring = { type: 'spring' as const, stiffness: 260, damping: 28 }

  return (
    <div className="w-full flex flex-col items-center py-4">
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-[1440px] h-[400px] md:h-[495px] overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        {slides.map((slide, i) => {
          if (!shouldRenderSlide(i)) return null
          const isCenter = i === currentIndex
          const position = getSlidePosition(i)
          const zIndex = getZIndex(i)

          return (
            <motion.div
              key={slide.id}
              className="absolute top-0"
              style={{ width: slideWidth, cursor: isCenter ? 'default' : 'pointer', zIndex }}
              animate={{
                left: position,
                scale: isCenter ? 1 : 0.9,
                filter: isCenter ? 'blur(0px)' : 'blur(2px)'
              }}
              transition={spring}
              onClick={() => {
                if (!isCenter) {
                  const delta = normDelta(i - currentIndex)
                  setDirection(delta > 0 ? 1 : -1)
                  setCurrentIndex(i)
                }
              }}
            >
              <div
                  className="relative w-full rounded-[20px] overflow-hidden transition-opacity duration-300 aspect-[3/4] md:aspect-[16/9]"
                  style={{ opacity: isCenter ? 1 : 0.6 }}
                >
                <video
                  ref={isCenter ? videoRef : null}
                  autoPlay={isCenter}
                  muted
                  playsInline
                  loop={!isCenter}
                  className="absolute inset-0 w-full h-full object-cover"
                  onEnded={isCenter ? handleVideoEnd : undefined}
                >
                  <source src={slide.videoSrc} type="video/mp4" />
                </video>

                {isCenter && (
                  <AnimatePresence mode="wait">
                    <div
                      key={slide.id}
                      className="
                        absolute inset-0 flex flex-col items-center justify-center 
                        md:justify-end pb-0 md:pb-12
                      "
                    >
                      <motion.h3
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="text-white text-[18px] md:text-[32px] font-bold text-center mb-1 md:mb-2 px-4"
                        style={{ fontFamily: 'Poppins', fontWeight: 700 }}
                      >
                        {slide.title}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: direction * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: direction * -20 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
                        className="text-white text-[14px] md:text-[24px] text-center px-4"
                        style={{ fontFamily: 'Montserrat', fontWeight: 400, letterSpacing: '-0.5px' }}
                      >
                        {slide.subtitle}
                      </motion.p>
                    </div>
                  </AnimatePresence>
                )}

              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
