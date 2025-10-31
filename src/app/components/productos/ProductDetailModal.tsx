'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// Interfaz de producto desde BD
interface ProductVariant {
  id: number
  color: string
  codigoHex: string
  stock: number
  disponible: boolean
}

interface ProductSize {
  id: number
  valor: string
  stock: number
  disponible: boolean
}

interface ProductImage {
  id: number
  rutaArchivo: string
  tipoImagen: string
  varianteId?: number
  orden: number
}

interface ProductDetail {
  id: number
  nombre: string
  subtitulo: string
  descripcion: string
  precio: number
  peso: number
  pesoAlternativo?: number
  stock: number
  material: string
  variantes: ProductVariant[]
  tallas: ProductSize[]
  imagenes: ProductImage[]
  especificaciones: {
    width?: string
    rise?: string
    backsweep?: string
    upsweep?: string
    clampDiameter?: string
    construction?: string
    features?: string[]
  }
}

interface ProductDetailModalProps {
  product: ProductDetail
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedWeight, setSelectedWeight] = useState<'main' | 'alternative'>('main')

  // Filtrar imágenes por variante seleccionada
  const filteredImages = selectedVariant
    ? product.imagenes.filter((img: ProductImage) => 
        img.varianteId === selectedVariant.id || img.varianteId === null
      )
    : product.imagenes.filter((img: ProductImage) => img.varianteId === null)

  // Resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setSelectedVariant(product.variantes.find((v: ProductVariant) => v.disponible) || null)
      setSelectedSize(product.tallas.find((t: ProductSize) => t.disponible) || null)
      setCurrentImageIndex(0)
      setSelectedWeight('main')
    }
  }, [isOpen, product])

  // Navegación de imágenes
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  // Calcular si hay stock
  const hasStock = product.stock > 0 && (selectedVariant?.stock || 0) > 0

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-[1440px] max-h-[90vh] bg-luxury-black rounded-lg overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 text-white hover:text-luxury-blue transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          {/* Header con logo */}
          <div className="flex flex-col items-center pt-10 pb-6 gap-3">
            <motion.div
              className="w-7 h-8 opacity-60"
              initial={{ rotate: 180, scaleY: -1 }}
            >
              <svg viewBox="0 0 28 32" fill="currentColor" className="text-luxury-blue">
                <path d="M14 0L28 8L14 16L0 8L14 0Z" />
                <path d="M14 16L28 24L14 32L0 24L14 16Z" />
              </svg>
            </motion.div>

            <h2 className="text-4xl font-saira font-bold text-white uppercase tracking-wider">
              {product.nombre}
            </h2>

            <p className="text-xl font-montserrat text-luxury-blue tracking-tight">
              {product.subtitulo}
            </p>
          </div>

          {/* Contenedor principal */}
          <div className="px-20 pb-16">
            {/* Imagen principal con slider */}
            <div className="relative w-full mb-8">
              <div className="relative w-full h-[360px] bg-gradient-to-b from-luxury-blue/10 to-transparent rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={filteredImages[currentImageIndex]?.rutaArchivo || '/images/placeholder.png'}
                      alt={product.nombre}
                      width={1200}
                      height={400}
                      className="object-contain max-h-full"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Controles del slider */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Indicador de color actual */}
              {selectedVariant && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <p className="text-sm font-montserrat text-gray-400 text-center">
                    {selectedVariant.color}
                  </p>
                </div>
              )}
            </div>

            {/* Selectores de color */}
            <div className="flex justify-center gap-6 mb-12">
              {product.variantes.map((variant: ProductVariant) => (
                <motion.button
                  key={variant.id}
                  onClick={() => variant.disponible && setSelectedVariant(variant)}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'border-luxury-blue scale-110'
                      : 'border-gray-600 hover:border-gray-400'
                  } ${!variant.disponible && 'opacity-40 cursor-not-allowed'}`}
                  style={{ backgroundColor: variant.codigoHex }}
                  whileHover={variant.disponible ? { scale: 1.15 } : {}}
                  whileTap={variant.disponible ? { scale: 1.05 } : {}}
                >
                  {!variant.disponible && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Información del producto */}
            <div className="grid grid-cols-2 gap-12">
              {/* Imagen secundaria */}
              <div className="bg-gradient-to-b from-luxury-blue/10 to-transparent rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src={filteredImages[1]?.rutaArchivo || filteredImages[0]?.rutaArchivo || '/images/placeholder.png'}
                  alt={`${product.nombre} detail`}
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>

              {/* Detalles */}
              <div className="flex flex-col gap-6">
                {/* Nombre y peso */}
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-montserrat text-luxury-blue uppercase">
                    {product.nombre}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedWeight('main')}
                      className={`px-3 py-1 border-b-2 transition-colors ${
                        selectedWeight === 'main'
                          ? 'border-luxury-blue text-luxury-blue'
                          : 'border-transparent text-gray-600'
                      }`}
                    >
                      <span className="text-2xl font-montserrat">{product.peso} gr</span>
                    </button>
                    {product.pesoAlternativo && (
                      <button
                        onClick={() => setSelectedWeight('alternative')}
                        className={`px-3 py-1 border-b-2 transition-colors ${
                          selectedWeight === 'alternative'
                            ? 'border-luxury-blue text-luxury-blue'
                            : 'border-transparent text-gray-600'
                        }`}
                      >
                        <span className="text-2xl font-montserrat">{product.pesoAlternativo} gr</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-base font-montserrat text-luxury-blue leading-relaxed">
                  {product.descripcion}
                </p>

                {/* Selector de tallas */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-2xl font-montserrat text-luxury-blue">
                    Tipus de Potència
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {product.tallas.map((size: ProductSize) => (
                      <motion.button
                        key={size.id}
                        onClick={() => size.disponible && setSelectedSize(size)}
                        disabled={!size.disponible}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          selectedSize?.id === size.id
                            ? 'border-luxury-blue text-luxury-blue'
                            : 'border-gray-600 text-gray-400 hover:border-gray-400'
                        } ${!size.disponible && 'opacity-40 cursor-not-allowed'}`}
                        whileHover={size.disponible ? { scale: 1.05 } : {}}
                        whileTap={size.disponible ? { scale: 0.95 } : {}}
                      >
                        <span className="text-base font-montserrat">{size.valor}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Botón comprar y precio */}
                <div className="flex items-center gap-6 mt-4">
                  <motion.button
                    className="flex items-center gap-3 px-6 py-3 border-2 border-luxury-blue rounded-full hover:bg-luxury-blue/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    </svg>
                    <span className="text-2xl font-poppins font-semibold text-white">
                      COMPRAR
                    </span>
                  </motion.button>

                  <span className="text-2xl font-montserrat text-white">
                    {product.precio} €
                  </span>

                  {hasStock ? (
                    <span className="text-sm font-montserrat text-green-500">
                      stock
                    </span>
                  ) : (
                    <span className="text-sm font-montserrat text-red-500">
                      sin stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            <div className="mt-16 pt-8 border-t border-gray-800">
              <h4 className="text-base font-montserrat text-white mb-4">
                ESPECIFICACIONS TÈCNICAS:
              </h4>
              <div className="grid grid-cols-2 gap-8 text-sm font-montserrat text-white leading-relaxed">
                <div>
                  {product.especificaciones.width && (
                    <p>Width: {product.especificaciones.width}</p>
                  )}
                  {product.especificaciones.rise && (
                    <p>Rise: {product.especificaciones.rise}</p>
                  )}
                  {product.especificaciones.backsweep && (
                    <p>Backsweep: {product.especificaciones.backsweep}</p>
                  )}
                  {product.especificaciones.upsweep && (
                    <p>Upsweep: {product.especificaciones.upsweep}</p>
                  )}
                  {product.especificaciones.clampDiameter && (
                    <p>Clamp Diameter: {product.especificaciones.clampDiameter}</p>
                  )}
                </div>
                <div>
                  {product.especificaciones.construction && (
                    <p>Construction: {product.especificaciones.construction}</p>
                  )}
                  {product.especificaciones.features?.map((feature: string, idx: number) => (
                    <p key={idx} className="mt-2">{feature}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
