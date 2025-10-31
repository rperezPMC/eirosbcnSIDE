'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  alt: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/about/slider_about.png',
    title: 'MADE IN BARCELONA',
    subtitle: 'Mediterranean style',
    alt: 'Made in Barcelona'
  },
  {
    id: 2,
    image: '/images/about/slider_about2.png',
    title: 'NATURE INSPIRED',
    subtitle: 'Pieces make sense',
    alt: 'Nature inspired'
  },
  {
    id: 3,
    image: '/images/about/slider_about3.png',
    title: 'TEXTURES',
    subtitle: 'Are out there',
    alt: 'Textures'
  },
  {
    id: 4,
    image: '/images/about/slider_about4.png',
    title: 'BACK TO THE ROOTS',
    subtitle: 'Modern classic',
    alt: 'Back to the roots'
  },
  {
    id: 5,
    image: '/images/about/slider_about5.png',
    title: 'CARBON FIBER',
    subtitle: 'Lightweight performance',
    alt: 'Carbon fiber'
  }
]

export default function AboutSlider() {
  const [currentIndex, setCurrentIndex] = useState(2)
  const [direction, setDirection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detección de móvil
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-avanzar carousel cada 4 s en móvil
  useEffect(() => {
    if (!isMobile || slides.length <= 1) return
    const i = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(i)
  }, [isMobile])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  // Imágenes visibles para móvil
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
    
    if (diff > totalSlides / 2) {
      return diff - totalSlides
    } else if (diff < -totalSlides / 2) {
      return diff + totalSlides
    }
    
    return diff
  }

  const getSlideScale = (slideIndex: number) => {
    return 1
  }

  const getSlideOpacity = (slideIndex: number) => {
    return 1
  }

  const shouldRenderSlide = (slideIndex: number) => {
    const position = Math.abs(getSlidePosition(slideIndex))
    return position <= 2
  }

  // Dimensiones responsive
  const CENTER_W = isMobile ? 280 : 850
  const CENTER_H = isMobile ? 400 : 484
  const SIDE_W   = isMobile ? 200 : 0
  const SIDE_H   = isMobile ? 290 : 0
  const OFFSET_X = isMobile ? 240 : 110
  const FRAME_W  = isMobile ? 400 : 0
  const FRAME_H  = isMobile ? 420 : 0
  const INNER_H  = isMobile ? 400 : 600
  const PAD      = isMobile ? 0  : 0

  const visibleImages = getVisibleImages()

  return (
    <div className="w-full bg-black py-20 overflow-hidden">
      <div className="relative flex items-center justify-center" style={{ height: isMobile ? FRAME_H : 600 }}>
        {/* Versión móvil: estilo ProductHistorySection */}
        {isMobile ? (
          <div
            className="relative rounded-[16px] overflow-hidden"
            style={{
              padding: PAD
            }}
          >
            <div
              className="relative flex items-center justify-center overflow-hidden mx-auto"
              style={{ width: FRAME_W, height: FRAME_H }}
            >
              <div
                className="relative w-full flex items-center justify-center"
                style={{ height: INNER_H }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleImages.map((img) => {
                    const isCenter = img.position === 'center'
                    const isLeft = img.position === 'left'
                    const isRight = img.position === 'right'
                    return (
                      <motion.div
                        key={img.index}
                        className="absolute"
                        initial={false}
                        animate={{
                          x: isLeft ? -OFFSET_X : isRight ? OFFSET_X : 0,
                          scale: isCenter ? 1 : 0.78,
                          opacity: isCenter ? 1 : 0.6,
                          zIndex: isCenter ? 10 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <div
                          className="bg-white rounded-[16px] overflow-hidden"
                          style={{
                            width: isCenter ? CENTER_W : SIDE_W,
                            height: isCenter ? CENTER_H : SIDE_H
                          }}
                        >
                          <Image
                            src={img.slide.image}
                            alt={img.slide.alt}
                            width={isCenter ? CENTER_W : SIDE_W}
                            height={isCenter ? CENTER_H : SIDE_H}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Texto superpuesto solo en slide central */}
                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
                          >
                            <h2 className="font-bold text-[20px] leading-[24px] mb-1">
                              {img.slide.title}
                            </h2>
                            <p className="font-normal text-[16px] leading-[18px] tracking-[-0.5px]">
                              {img.slide.subtitle}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          /* Versión desktop: mantener slider original */
          <div className="relative w-full h-full flex items-center justify-center">
            {slides.map((slide, index) => {
              if (!shouldRenderSlide(index)) return null
              
              const position = getSlidePosition(index)
              const scale = getSlideScale(index)
              const opacity = getSlideOpacity(index)
              const isCenter = position === 0
              
              return (
                <motion.div
                  key={slide.id}
                  className="absolute"
                  animate={{
                    x: `${position * 110}%`,
                    scale: scale,
                    opacity: opacity,
                    zIndex: isCenter ? 20 : 10 - Math.abs(position)
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      goToSlide(index)
                    }
                  }}
                  style={{
                    cursor: isCenter ? 'default' : 'pointer'
                  }}
                >
                  <div className="relative w-[850px] h-[484px] rounded-[20px] overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Texto superpuesto solo en slide central */}
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
                        >
                          <h2 className="font-bold text-[32px] leading-[35px] mb-2">
                            {slide.title}
                          </h2>
                          <p className="font-normal text-[24px] leading-[25px] tracking-[-0.5px]">
                            {slide.subtitle}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Indicadores circulares */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex" style={{ gap: '25px' }}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className="w-[15px] h-[15px] rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === currentIndex ? '#797979' : '#F9F9F9'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}