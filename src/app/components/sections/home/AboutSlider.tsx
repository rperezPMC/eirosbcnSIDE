'use client'

import { useState, useEffect } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
  type Transition
} from 'framer-motion'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  alt: string
}

const slides: Slide[] = [
  { id: 1, image: '/images/about/slider_about.png',  title: 'MADE IN BARCELONA', subtitle: 'Mediterranean style', alt: 'Made in Barcelona' },
  { id: 2, image: '/images/about/slider_about2.png', title: 'NATURE INSPIRED',   subtitle: 'Pieces make sense',  alt: 'Nature inspired' },
  { id: 3, image: '/images/about/slider_about3.png', title: 'TEXTURES',          subtitle: 'Are out there',      alt: 'Textures' },
  { id: 4, image: '/images/about/slider_about4.png', title: 'BACK TO THE ROOTS', subtitle: 'Modern classic',      alt: 'Back to the roots' },
  { id: 5, image: '/images/about/slider_about5.png', title: 'CARBON FIBER',      subtitle: 'Lightweight performance', alt: 'Carbon fiber' }
]

// ---- Ajustes de animación suaves ----
const SLIDE_SPRING = { type: 'spring', stiffness: 140, damping: 24, mass: 0.8 } as const
const TEXT_TWEEN: Transition = {
  duration: 0.45,
  ease: [0.22, 0.61, 0.36, 1] as const // tupla BezierDefinition
}

// Swipe más natural
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity
const SWIPE_CONF = { delta: 60, velocity: 300, power: 800 } as const

export default function AboutSlider() {
  const [currentIndex, setCurrentIndex] = useState(2)
  const [direction, setDirection] = useState(0) // -1 izquierda, 1 derecha
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-slide móvil suave
  useEffect(() => {
    if (!isMobile || slides.length <= 1 || isDragging) return
    const i = setInterval(() => {
      setDirection(1)
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(i)
  }, [isMobile, isDragging])

  const goToSlide = (index: number) => {
    const diff = index - currentIndex
    setDirection(diff > 0 ? 1 : -1)
    setCurrentIndex(index)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)
  }
  const handleNext = () => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % slides.length)
  }

  const onDragStart = () => setIsDragging(true)
  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const power = swipePower(offset.x, velocity.x)

    if (offset.x < -SWIPE_CONF.delta || velocity.x < -SWIPE_CONF.velocity || (power > SWIPE_CONF.power && velocity.x < 0)) {
      handleNext()
    } else if (offset.x > SWIPE_CONF.delta || velocity.x > SWIPE_CONF.velocity || (power > SWIPE_CONF.power && velocity.x > 0)) {
      handlePrevious()
    }
    setIsDragging(false)
  }

  // Helpers de layout
  const getVisibleImages = () => {
    if (slides.length === 0) return []
    if (slides.length === 1) return [{ slide: slides[0], index: 0, position: 'center' as const }]
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length
    const nextIndex = (currentIndex + 1) % slides.length
    return [
      { slide: slides[prevIndex], index: prevIndex, position: 'left' as const },
      { slide: slides[currentIndex], index: currentIndex, position: 'center' as const },
      { slide: slides[nextIndex], index: nextIndex, position: 'right' as const }
    ]
  }

  const getSlidePosition = (slideIndex: number) => {
    const diff = slideIndex - currentIndex
    const totalSlides = slides.length
    if (diff > totalSlides / 2) return diff - totalSlides
    if (diff < -totalSlides / 2) return diff + totalSlides
    return diff
  }

  const shouldRenderSlide = (slideIndex: number) => Math.abs(getSlidePosition(slideIndex)) <= 2

  // Dimensiones responsive
  const CENTER_W = isMobile ? 280 : 850
  const CENTER_H = isMobile ? 400 : 484
  const SIDE_W = isMobile ? 200 : 0
  const SIDE_H = isMobile ? 290 : 0
  const OFFSET_X = isMobile ? 240 : 110
  const FRAME_W = isMobile ? 400 : 0
  const FRAME_H = isMobile ? 420 : 0
  const INNER_H = isMobile ? 400 : 600
  const PAD = 0

  const visibleImages = getVisibleImages()

  // Variants para entrada según dirección (suaviza el “swap”)
  const centerVariants = {
    enter: (dir: number) => ({ x: reduceMotion ? 0 : dir * 20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: reduceMotion ? 0 : -dir * 20, opacity: 0 })
  }

  return (
    <div className="w-full bg-black py-20 overflow-hidden">
      <div className="relative flex items-center justify-center" style={{ height: isMobile ? FRAME_H : 600 }}>
        {/* Versión móvil */}
        {isMobile ? (
          <div className="relative rounded-[16px] overflow-hidden" style={{ padding: PAD }}>
            <div className="relative flex items-center justify-center overflow-hidden mx-auto" style={{ width: FRAME_W, height: FRAME_H }}>
              <motion.div
                className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ height: INNER_H, touchAction: 'pan-x' }}
                drag="x"
                dragConstraints={{ left: -120, right: 120 }}
                dragSnapToOrigin
                dragElastic={0.22}
                dragMomentum={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                  {visibleImages.map((img) => {
                    const isCenter = img.position === 'center'
                    const isLeft = img.position === 'left'
                    const isRight = img.position === 'right'
                    return (
                      <motion.div
                        key={img.index}
                        className="absolute"
                        layout
                        layoutDependency={currentIndex}
                        initial={false}
                        animate={{
                          x: isLeft ? -OFFSET_X : isRight ? OFFSET_X : 0,
                          scale: isCenter ? 1 : 0.78,
                          opacity: isCenter ? 1 : 0.6,
                          zIndex: isCenter ? 10 : 1
                        }}
                        transition={SLIDE_SPRING}
                      >
                        <div
                          className="rounded-[16px] overflow-hidden"
                          style={{ width: isCenter ? CENTER_W : SIDE_W, height: isCenter ? CENTER_H : SIDE_H }}
                        >
                          <img
                            src={img.slide.image}
                            alt={img.slide.alt}
                            className="w-full h-full object-cover"
                            data-preload="true"
                          />
                        </div>

                        {/* Texto central */}
                        {isCenter && (
                          <motion.div
                            variants={centerVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            custom={direction}
                            transition={TEXT_TWEEN}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10"
                          >
                            <h2 className="font-bold text-[20px] leading-[24px] mb-1 drop-shadow-lg">{img.slide.title}</h2>
                            <p className="font-normal text-[16px] leading-[18px] tracking-[-0.5px] drop-shadow-lg">{img.slide.subtitle}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Versión desktop */
          <motion.div
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-x' }}
            drag="x"
            dragConstraints={{ left: -120, right: 120 }}
            dragSnapToOrigin
            dragElastic={0.18}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {slides.map((slide, index) => {
              if (!shouldRenderSlide(index)) return null
              const position = getSlidePosition(index)
              const isCenter = position === 0
              return (
                <motion.div
                  key={slide.id}
                  className="absolute"
                  layout
                  layoutDependency={currentIndex}
                  animate={{
                    x: `${position * 110}%`,
                    scale: 1,
                    opacity: 1,
                    zIndex: isCenter ? 20 : 10 - Math.abs(position)
                  }}
                  transition={SLIDE_SPRING}
                  onClick={() => !isCenter && goToSlide(index)}
                  style={{ cursor: isCenter ? 'default' : 'pointer' }}
                >
                  <div className="relative w-[850px] h-[484px] rounded-[20px] overflow-hidden">
                    <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" data-preload="true"/>
                    <AnimatePresence mode="wait" custom={direction}>
                      {isCenter && (
                        <motion.div
                          variants={centerVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          custom={direction}
                          transition={TEXT_TWEEN}
                          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
                        >
                          <h2 className="font-bold text-[32px] leading-[35px] mb-2">{slide.title}</h2>
                          <p className="font-normal text-[24px] leading-[25px] tracking-[-0.5px]">{slide.subtitle}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Indicadores (solo desktop) */}
        {!isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex" style={{ gap: '25px' }}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="w-[15px] h-[15px] rounded-full transition-all duration-300"
                style={{ backgroundColor: index === currentIndex ? '#797979' : '#F9F9F9' }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
