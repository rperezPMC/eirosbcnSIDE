'use client'

import { useState } from 'react'
import { motion, PanInfo, type Transition } from 'framer-motion'

/* ===== Tipos ===== */
interface ImageSlide {
  id: number
  src: string
  alt: string
}

/* ===== Datos ===== */
const images: ImageSlide[] = [
  { id: 1, src: './images/home/ThreeSlider/image_1.png', alt: 'Photo 1' },
  { id: 2, src: './images/home/ThreeSlider/image_2.png', alt: 'Photo 2' },
  { id: 3, src: './images/home/ThreeSlider/image_3.png', alt: 'Photo 3' },
  { id: 4, src: './images/home/ThreeSlider/image_4.png', alt: 'Photo 4' },
  { id: 5, src: './images/home/ThreeSlider/image_5.png', alt: 'Photo 5' }
]

/* ===== Carrusel SIN infinito, drag-only ===== */
function ImageCarousel({ images }: { images: ImageSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const goToPrevious = () => setCurrentIndex(p => Math.max(0, p - 1))
  const goToNext     = () => setCurrentIndex(p => Math.min(images.length - 1, p + 1))

  // ===== Swipe sin saltos: offset + inercia (velocidad) =====
  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = info.offset.x + info.velocity.x * 180
    const threshold = 120

    if (swipePower > threshold && currentIndex > 0) {
      goToPrevious()
    } else if (swipePower < -threshold && currentIndex < images.length - 1) {
      goToNext()
    }
    setIsDragging(false)
  }

  // Tamaños responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const CENTER_W = isMobile ? 180 : 270
  const CENTER_H = isMobile ? 254 : 380

  const SIDE_H = isMobile ? 197 : 295
  const SIDE_W = Math.round((SIDE_H * 3) / 4)

  const PEEK = Math.round(SIDE_W * 0.3)
  const GAP  = isMobile ? 8 : 10

  // Posiciones (contenedor con overflow hidden)
  const getX = (i: number) => {
    const d = i - currentIndex
    if (d === 0)  return 0                        // centro
    if (d === 1)  return CENTER_W + GAP           // derecha (siguiente)
    if (d === -1) return -(PEEK + GAP)            // izquierda inmediata (peek)
    if (d === -2) return -(PEEK + GAP + PEEK/2)   // más a la izquierda, apilada
    return 0
  }

  // Render centro, vecinos y hasta 2 imágenes anteriores a la izquierda
  const shouldRender = (i: number) => {
    const d = i - currentIndex
    return d >= -2 && d <= 1  // muestra 2 anteriores, centro y 1 siguiente
  }

  // ===== Transición más suave (sin rebotes bruscos) =====
  const spring: Transition = { type: 'spring' as const, stiffness: 200, damping: 30, mass: 0.9 }

  // Feedback visual durante el drag
  const LATERAL_Y_OFFSET = 40
  const borderRadiusByDelta = (d: number) => {
    if (d === 0) return '16px'              // centro: bordes completos
    if (d === 1) return '16px 0 0 16px'     // derecha: bordes izquierdos
    return '0 16px 16px 0'                  // izquierda: bordes derechos
  }

  return (
    <div className="relative w-full h-[254px] md:h-[380px] overflow-hidden">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        {images.map((image, i) => {
          if (!shouldRender(i)) return null

          const d = i - currentIndex
          const isCenter = d === 0
          const x = getX(i)

          const cardW = isCenter ? CENTER_W : PEEK
          const cardH = isCenter ? CENTER_H : SIDE_H
          
          // Todas las imágenes laterales muestran su inicio (primeros PEEK píxeles)
          const imgShift = 0
          const activeScale = isDragging && isCenter ? 0.985 : 1

          return (
            <motion.div
              key={image.id}
              className="absolute top-1 -translate-y-1/2"
              style={{
                width: cardW,
                left: isMobile ? '20%' : '28%',
                zIndex: isCenter ? 30 : 20,
                cursor: isCenter ? 'default' : 'grab'
              }}
              animate={{
                x: x - CENTER_W / 2,  // Centrar en base a la imagen del centro
                y: isCenter ? 0 : LATERAL_Y_OFFSET,
                opacity: isCenter ? 1 : 0.9,
                scale: activeScale
              }}
              transition={spring}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: cardW,
                  height: cardH,
                  borderRadius: borderRadiusByDelta(d),
                  boxShadow: '0 0 0 1px rgba(147,197,242,0.12) inset'
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute top-0 left-0 h-full object-cover"
                  style={{
                    width: isCenter ? CENTER_W : SIDE_W,
                    transform: `translateX(${imgShift}px)`
                  }}
                  draggable={false}
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default function ThreeCarouselsSection() {
  return (
    <section className="w-full bg-luxury-black py-8 md:py-16 px-4 flex justify-center">
      <div className="w-full max-w-[1270px] rounded-[12px] md:rounded-[20px] ring-1 ring-[#50a1b0] bg-black p-4 md:p-6">
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1">
            <ImageCarousel images={images} />
          </div>
          <div className="flex-1">
            <ImageCarousel images={images} />
          </div>
          <div className="flex-1">
            <ImageCarousel images={images} />
          </div>
        </div>
      </div>
    </section>
  )
}
