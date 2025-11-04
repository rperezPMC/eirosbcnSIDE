'use client'

import { useState } from 'react'
import { motion, PanInfo, type Transition } from 'framer-motion'
import Link from 'next/link'

// Tipos
interface SliderItem {
  id: string
  name: string
  images: string[]
}

interface CarouselBoxProps {
  slider: SliderItem
}

interface ProductButtonProps {
  name: string
}

// Datos de los sliders
const sliderData: SliderItem[] = [
  {
    id: 'atena',
    name: 'ATENA',
    images: [
      '/images/home/ThreeSlider/image_1.png',
      '/images/home/ThreeSlider/image_2.png',
      '/images/home/ThreeSlider/image_3.png',
      '/images/home/ThreeSlider/image_4.png',
      '/images/home/ThreeSlider/image_5.png'
    ]
  }
]

export default function HeroPhotoSlider() {
  return (
    <div className="w-full bg-luxury-black py-0 md:py-20 flex justify-center">
      <div className="w-full max-w-[1300px]">
        {/* Desktop - Tres boxes */}
        <div className="hidden md:flex gap-6 lg:gap-12 items-start justify-center px-6 mb-20">
          {sliderData.map((slider) => (
            <CarouselBox key={slider.id} slider={slider} />
          ))}
        </div>

        {/* Mobile - Un box por vez */}
        <div className="md:hidden px-4">
          <MobileView sliders={sliderData} />
        </div>
      </div>
    </div>
  )
}

// Box individual con slider interno tipo peek
function CarouselBox({ slider }: CarouselBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const goToPrevious = () => setCurrentIndex(p => Math.max(0, p - 1))
  const goToNext = () => setCurrentIndex(p => Math.min(slider.images.length - 1, p + 1))

  // Drag handlers
  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = info.offset.x + info.velocity.x * 180
    const threshold = 80

    if (swipePower > threshold && currentIndex > 0) {
      goToPrevious()
    } else if (swipePower < -threshold && currentIndex < slider.images.length - 1) {
      goToNext()
    }
    setIsDragging(false)
  }

  // Dimensiones
  const CENTER_W = 240
  const CENTER_H = 320
  const SIDE_W = 80
  const GAP = 10

  // Posiciones con peek
  const getX = (i: number) => {
    const d = i - currentIndex
    if (d === 0) return 0
    if (d === 1) return CENTER_W + GAP
    if (d === -1) return -(SIDE_W + GAP)
    return 0
  }

  const shouldRender = (i: number) => {
    const d = i - currentIndex
    return d >= -1 && d <= 1
  }

  const spring: Transition = { type: 'spring', stiffness: 200, damping: 30, mass: 0.9 }

  return (
    <div className="flex flex-col items-center gap-0 md:gap-6">
      {/* Slider box con fondo negro */}
      <div className="relative w-[380px] lg:w-[350px] rounded-[20px] overflow-hidden p-4 bg-black md:border-2 border-[#50a1b0] md:border-0">
        <div className="relative w-full h-[360px] lg:h-[330px] overflow-hidden rounded-[16px]">
          <motion.div
            className="relative w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
          >
            {slider.images.map((image, i) => {
              if (!shouldRender(i)) return null

              const d = i - currentIndex
              const isCenter = d === 0
              const x = getX(i)
              const activeScale = isDragging && isCenter ? 0.985 : 1

              return (
                <motion.div
                  key={i}
                  className="absolute top-0"
                  style={{
                    width: isCenter ? CENTER_W : SIDE_W,
                    left: '50%',
                    zIndex: isCenter ? 30 : 20,
                    cursor: isCenter ? 'grab' : 'default'
                  }}
                  animate={{
                    x: x - CENTER_W / 2,
                    y: isCenter ? 0 : 30,
                    opacity: isCenter ? 1 : 0.7,
                    scale: activeScale
                  }}
                  transition={spring}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: isCenter ? CENTER_W : SIDE_W,
                      height: isCenter ? CENTER_H : 250,
                      borderRadius: d === 0 ? '16px' : d === 1 ? '16px 0 0 16px' : '0 16px 16px 0',
                      boxShadow: '0 0 0 1px rgba(147,197,242,0.12) inset'
                    }}
                  >
                    <img
                      src={image}
                      alt={`${slider.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Botón */}
      <ProductButton name={slider.name} />
    </div>
  )
}

// Vista mobile
function MobileView({ sliders }: { sliders: SliderItem[] }) {
  const [activeCarousel, setActiveCarousel] = useState(0)

  return (
    <div className="flex flex-col items-center">
      <CarouselBox slider={sliders[activeCarousel]} />
      
      {/* Indicadores de carousel más grandes y separados 
      <div className="flex gap-5 justify-center mt-8">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCarousel(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              idx === activeCarousel ? 'w-12 bg-luxury-teal' : 'w-3 bg-white/30'
            }`}
          />
        ))}
      </div>
      */}
    </div>
  )
}

const MotionLink = motion(Link)

function ProductButton({ name }: { name: string }) {
  return (
    <MotionLink
      href="/mountain"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-1 rounded-[24px] border border-[#93c5f2] bg-transparent md:gap-3 md:px-8 md:py-3 md:rounded-[30px] md:border-[1.5px]"
    >
      <div className="w-5 h-5 md:w-7 md:h-7">
        <img src="/images/logos/logo_small_azul.svg" alt="Eiros Logo" className="w-full h-full object-contain" />
      </div>
      <span className="text-[#f9f9f9] text-1xl md:text-2xl lg:text-[28px] font-semibold whitespace-nowrap" style={{ fontFamily: 'Poppins' }}>
        {name}
      </span>
    </MotionLink>
  )
}
