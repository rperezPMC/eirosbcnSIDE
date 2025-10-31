'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transformaciones para crear efecto parallax
  const logoTopY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const logoCenterY = useTransform(scrollYProgress, [0, 1], [150, -150])
  const manillarY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const productoLeftY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const productoRightY = useTransform(scrollYProgress, [0, 1], [120, -120])
  const diagramOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5])

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
      style={{ minHeight: '120vh' }}
    >
      <div className="relative w-full h-[900px] flex items-center justify-center">
        
        {/* Diagrama de fondo con líneas y cuadrados */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: diagramOpacity }}
        >
          <img 
            src="/images/home/parallax/diagram.svg" 
            alt="Techniques diagram"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Logo pequeño superior */}
        <motion.div 
          className="absolute top-[20px] left-[367px] w-[41px] h-[49px]"
          style={{ y: logoTopY }}
        >
          <img 
            src="/images/home/parallax/logo-small.svg" 
            alt="Eiros Logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Logo central con blur */}
        <motion.div 
          className="absolute top-[150px] left-[617px] w-[201px] h-[241px]"
          style={{ y: logoCenterY }}
        >
          <img 
            src="/images/home/parallax/logo-center.svg" 
            alt="Eiros Logo Center"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Diagrama mapa central */}
        <motion.div 
          className="absolute top-[152px] left-[497px] w-[446px]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <img 
            src="/images/home/parallax/atena-map.svg" 
            alt="Atena Techniques Map"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Manillar ATENA central */}
        <motion.div 
          className="absolute top-[77px] left-0 w-full h-[1024px] flex items-center justify-center"
          style={{ y: manillarY }}
        >
          <img 
            src="/images/home/parallax/manillar-atena.png" 
            alt="Manillar ATENA"
            className="h-full w-auto object-contain"
            style={{ aspectRatio: '2000/793' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Producto TIJA (izquierda) */}
        <motion.div 
          className="absolute top-[200px] left-[218px] w-[400px] h-[400px]"
          style={{ y: productoLeftY }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img 
            src="/images/home/parallax/tija.png" 
            alt="Tija"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Producto PLATO (derecha) */}
        <motion.div 
          className="absolute bottom-[150px] right-[121px] w-[400px] h-[400px]"
          style={{ y: productoRightY }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <img 
            src="/images/home/parallax/plato.png" 
            alt="Plato"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </motion.div>

        {/* Línea vertical central (decorativa) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-[765px] bg-[#1f1f1f]" />

      </div>

      {/* Título "OUR UNIQUE TECHNIQUES" */}
      <motion.div 
        className="w-full h-[191px] flex items-end justify-center pb-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 
          className="text-6xl md:text-7xl font-bold text-white text-center"
          style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: '70px' }}
        >
          OUR UNIQUE TECHNIQUES
        </h2>
      </motion.div>
    </section>
  )
}
