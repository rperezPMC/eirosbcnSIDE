'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'

interface ProductHistorySectionProps {
  productName: string
  historyDescription: string
  images: string[]
}

export default function ProductHistorySection({ productName, historyDescription, images }: ProductHistorySectionProps) {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const isTinyScreen = typeof window !== 'undefined' && window.innerWidth <= 360

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      handlePrevious()
    } else if (info.offset.x < -threshold) {
      handleNext()
    }
  }

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

  const CENTER_W = isMobile ? 240 : 270
  const CENTER_H = isMobile ? 320 : 380
  const SIDE_W = isMobile ? 180 : 210
  const SIDE_H = isMobile ? 280 : 330
  const OFFSET_X = isMobile ? 220 : 240

  return (
    <div className="w-full bg-black py-12 md:py-20 pl-4 pr-4">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] pt-20 gap-10 md:gap-12 items-center">

          {/* Slider con estilos de HeroPhotoSlider */}
          <div className="order-1 md:order-2 relative flex items-center justify-center">
            <div className="relative w-[340px] lg:w-[400px] rounded-[20px] overflow-hidden p-1 bg-black border-2 border-[#50a1b0] mx-auto">
              <div className="relative w-full h-[330px] lg:h-[400px] overflow-hidden rounded-[16px]">
                <motion.div
                  className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  style={{ height: '100%' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
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
                            scale: isCenter ? 1 : 0.85,
                            opacity: 1,
                            zIndex: isCenter ? 10 : 5,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          onClick={() => {
                            if (isLeft) handlePrevious()
                            if (isRight) handleNext()
                          }}
                          style={{ cursor: isCenter ? 'default' : 'pointer' }}
                        >
                            <div
                              className="relative z-20 bg-white rounded-[16px] overflow-hidden"
                              style={{
                                width: isCenter
                                  ? isTinyScreen ? CENTER_W * 0.9 : CENTER_W
                                  : isTinyScreen ? SIDE_W * 0.4 : SIDE_W,
                                height: isCenter
                                  ? isTinyScreen ? CENTER_H * 0.9 : CENTER_H
                                  : isTinyScreen ? SIDE_H * 0.75 : SIDE_H,
                                boxShadow: '0 0 0 1px rgba(147,197,242,0.12) inset',
                              }}
                            >
                            <Image
                              src={img.src}
                              alt={`${productName} history ${img.index + 1}`}
                              width={isCenter ? CENTER_W : SIDE_W}
                              height={isCenter ? CENTER_H : SIDE_H}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Texto original mantenido */}
          <div className="order-2 md:order-1 flex flex-col gap-4 md:gap-0 justify-center mt-20 md:px-8 md:text-right md:pr-12">
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