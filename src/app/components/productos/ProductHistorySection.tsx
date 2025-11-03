'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ProductHistorySectionProps {
  productName: string
  historyDescription: string
  images: string[]
}

export default function ProductHistorySection({
  productName,
  historyDescription,
  images
}: ProductHistorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive flag
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-avanzar carousel cada 4 s
  useEffect(() => {
    if (images.length <= 1) return
    const i = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(i)
  }, [images.length])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  // Imágenes visibles
  const getVisibleImages = () => {
    if (images.length === 0) return []
    if (images.length === 1) return [{ src: images[0], index: 0, position: 'center' as const }]
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    const nextIndex = (currentIndex + 1) % images.length
    return [
      { src: images[prevIndex], index: prevIndex, position: 'left' as const },
      { src: images[currentIndex], index: currentIndex, position: 'center' as const },
      { src: images[nextIndex], index: nextIndex, position: 'right' as const }
    ]
  }
  const visibleImages = getVisibleImages()
  if (!historyDescription || images.length === 0) return null

  // Dimensiones responsive del carrusel
  const CENTER_W = isMobile ? 220 : 270
  const CENTER_H = isMobile ? 320 : 380
  const SIDE_W   = isMobile ? 160 : 210
  const SIDE_H   = isMobile ? 225 : 295
  const OFFSET_X = isMobile ? 220 : 320
  const FRAME_W  = isMobile ? 360 : 440
  const FRAME_H  = isMobile ? 340 : 412
  const INNER_H  = isMobile ? 300 : 380
  const PAD      = isMobile ? 24  : 45

  return (
    <div className="w-full bg-black py-12 md:py-20 pl-4 pr-4">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Móvil: 1 col (slider arriba). Desktop: 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-12 items-center">

          {/* Carousel (arriba en móvil) */}
          <div className="order-1 md:order-2">
            <div
              className="relative rounded-[16px] md:rounded-[20px] overflow-hidden"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(80,161,176,0.44) 47%, rgba(0,0,0,0) 100%)',
                padding: PAD
              }}
            >
              {/* Marco del carrusel */}
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
                            className="bg-white rounded-[16px] md:rounded-[20px] overflow-hidden"
                            style={{
                              width: isCenter ? CENTER_W : SIDE_W,
                              height: isCenter ? CENTER_H : SIDE_H
                            }}
                          >
                            <Image
                              src={img.src}
                              alt={`${productName} history ${img.index + 1}`}
                              width={isCenter ? CENTER_W : SIDE_W}
                              height={isCenter ? CENTER_H : SIDE_H}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Texto (debajo en móvil) */}
          <div className="order-2 md:order-1 flex flex-col gap-4 md:gap-0 justify-center md:px-8 md:text-right md:pr-12">
            <h2
              className="text-[30px] leading-[38px] md:text-[32px] md:leading-[40px] font-bold text-white text-center md:text-right md:mb-4 md:mt-4 md:mt-10 px-4 md:px-0 md:pr-2"
              style={{ fontFamily: 'Poppins' }}
            >
              THE STORY OF {productName.toUpperCase()}
            </h2>

            <p
              className="text-[14px] md:text-[16px] text-[#f9f9f9] leading-[22px] md:leading-[26px] md:ml-10 text-justify md:text-right"
              style={{ fontFamily: 'Montserrat' }}
            >
              {historyDescription}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
