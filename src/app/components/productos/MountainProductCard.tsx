'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ProductHistorySection from './ProductHistorySection'
import OrderModal from './OrderModal'
import React from 'react'

function useIsIOSSafari() {
  const [isIOS, setIsIOS] = React.useState(false)
  React.useEffect(() => {
    const ua = navigator.userAgent
    const isiOS = /iP(ad|hone|od)/.test(ua)
    const isWebKit = /WebKit/.test(ua) && !/CriOS|FxiOS/.test(ua) // excluye Chrome/Firefox iOS
    setIsIOS(isiOS && isWebKit)
  }, [])
  return isIOS
}

export interface ProductVariant {
  id: string
  color: string
  colorId: number | null
  colorLogo: string | null
  colorName: string
  available: boolean
  imagenPrincipal: string | null
  galeriaImagenes: string[]
}

export interface ProductSize {
  id: string
  value: string
  available: boolean
}

export interface Product {
  id: string
  name: string
  nameSvgPath?: string
  subtitle: string
  weight: string
  alternativeWeight?: string
  mainImage: string
  detailImages: string[]
  historyImages: string[]
  historyDescription: string
  variants: ProductVariant[]
  sizes: ProductSize[]
  price: number
  inStock: boolean
  description: string
  material?: string
  specifications: {
    width: string
    rise: string
    backsweep: string
    upsweep: string
    clampDiameter: string
  }
}

interface MountainProductCardProps {
  product: Product
}

export default function MountainProductCard({ product }: MountainProductCardProps) {
  const t = useTranslations('Mountain.product')
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find(v => v.available)?.id || product.variants[0]?.id
  )
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find(s => s.available)?.value || product.sizes[0]?.value
  )
  const [selectedWeight, setSelectedWeight] = useState<'main' | 'alternative'>('main')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const isIOSSafari = useIsIOSSafari()

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant)
  
  const currentMainImage = selectedVariantData?.imagenPrincipal || product.mainImage
  const currentGalleryImages = selectedVariantData?.galeriaImagenes || []
  const currentGalleryImage = currentGalleryImages[galleryIndex] || currentMainImage
  
  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId)
    setGalleryIndex(0)
  }
  
  const handlePreviousGallery = () => {
    setGalleryIndex((prev) => 
      prev === 0 ? currentGalleryImages.length - 1 : prev - 1
    )
  }
  
  const handleNextGallery = () => {
    setGalleryIndex((prev) => 
      prev === currentGalleryImages.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="w-full bg-black text-white py-16">
      {/* Logo y Nombre */}
      <div className="flex flex-col items-center gap-3">
        <motion.div className="w-[17px] h-[19px] opacity-60 flex justify-center" initial={{ rotate: 0, scaleY: 1 }}>
          <svg width="25" height="25" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.744776 11.2144L8.36174 18.8313L15.9787 11.2144C16.9718 10.2213 16.9718 8.61003 15.9787 7.61697L8.36174 0L0.744776 7.61697C-0.248291 8.61003 -0.248291 10.2213 0.744776 11.2144Z"
              fill="#ffffffff"
            />
          </svg>
        </motion.div>

        {product.nameSvgPath ? (
          <div className="w-full max-w-md flex justify-center relative">
            <Image
              src={product.nameSvgPath}
              alt={product.name}
              width={200}
              height={20}
              className="w-[30%] h-[15%] md:w-[28%] md:h-[20%] object-contain"
              priority
            />
          </div>
        ) : (
          <h2
            className="text-8xl font-light tracking-wider text-gray-300 text-center"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            {product.name.toLowerCase()}
          </h2>
        )}

        <p
          className="text-[#50a1b0] text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "Montserrat", fontWeight: "400", letterSpacing: "0" }}
        >
          {product.subtitle}
        </p>
      </div>

      {/* Imagen principal grande */}
      <div className="flex justify-center mt-10 mb-8 px-0 md:px-8 md:mt-10">
        <div className="w-full md:w-[80%] lg:w-[85%]">
          <Image
            src={currentMainImage}
            alt={product.name}
            width={1500}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Nombre del color en móvil */}
      <div className="flex justify-center md:mb-8 mb-4">
        <span className="text-sm text-[#A7A7A7]" style={{ fontFamily: 'Montserrat' }}>
          {selectedVariantData?.colorName || 'Color'}
        </span>
      </div>

      {/* Selectores de color  */}
      <div className="flex justify-center gap-6 md:gap-6 mb-3 md:mb-16">
        {product.variants.map((variant) => (
          <motion.button
            key={variant.id}
            onClick={() => variant.available && handleVariantChange(variant.id)}
            disabled={!variant.available}
            className="relative w-7 h-7 md:w-10 md:h-10 group"
            whileHover={variant.available ? { scale: 1.1 } : {}}
            whileTap={variant.available ? { scale: 0.95 } : {}}
          >
            {variant.colorLogo ? (
              <>
                <Image
                  src={variant.colorLogo}
                  alt={variant.colorName}
                  width={40}
                  height={40}
                  className={`w-full h-full object-contain transition-all ${
                    !variant.available ? 'opacity-30 grayscale' : 'opacity-100'
                  }`}
                />
                {selectedVariant === variant.id && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600" />
                )}
              </>
            ) : (
              <>
                <div
                  className="absolute inset-[6px] transform rotate-45"
                  style={{
                    backgroundColor: variant.color,
                    opacity: variant.available ? 1 : 0.3
                  }}
                />
              </>
            )}
            
            {!variant.available && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 rotate-45" />
              </div>
            )}
          </motion.button>
        ))}
      </div>



      {/* Sección principal: Imagen + Detalles */}
      <div className="max-w-[1400px] mx-auto px-0 md:px-8 pl-4 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Columna Izquierda: Imagen con slider de galería */}
          <div className="relative flex items-center justify-center bg-gradient-to-b from-[#50a1b0]/90 to-transparent rounded-3xl md:rounded-3xl overflow-hidden">
            
            {/* Indicador de material dinámico */}
            {product.material && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="text-xs md:text-sm text-gray-400" style={{ fontFamily: 'Montserrat' }}>
                  {product.material}
                </span>
              </div>
            )}

            <div className="w-full aspect-[4/4] md:aspect-[4/3] relative">
              <Image
                src={currentGalleryImage}
                alt={`${product.name} gallery ${galleryIndex + 1}`}
                width={1200}
                height={900}
                className="object-cover md:object-cover rounded-3xl transition-all duration-300"
              />
            </div>

            {currentGalleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePreviousGallery}
                  className="absolute left-3 md:left-9 bottom-3 md:bottom-6 z-10 w-10 h-10 transition-colors flex items-center justify-center backdrop-blur-sm"
                  aria-label="Previous gallery image"
                >
                  <Image
                    src={isMobile ? "/images/addons/flecha_izquierda_mobile.svg" : "/images/addons/flecha_izquierda.svg"}
                    alt="Previous"
                    width={24}
                    height={24}
                    className={`w-6 h-6 ${isIOSSafari ? '[-webkit-transform:scaleX(-1)!important] [transform:scaleX(-1)!important]' : ''}`}
                  />
                </button>

                <button
                  onClick={handleNextGallery}
                  className="absolute right-3 md:right-9 bottom-3 md:bottom-6 z-10 w-10 h-10 transition-colors flex items-center justify-center backdrop-blur-sm"
                  aria-label="Next gallery image"
                >
                  <Image
                    src={isMobile ? "/images/addons/flecha_derecha_mobile.svg" : "/images/addons/flecha_derecha.svg"}
                    alt="Next"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>
              </>
            )}
          </div>

          {/* Columna Derecha: Información */}
          <div className="flex flex-col justify-center gap-6 mt-6 md:mt-0 px-6 md:px-0">
            {/* Nombre y Peso */}
            <div className="flex items-baseline gap-4">
              <h3 className="text-2xl md:text-3xl text-[#50a1b0] uppercase" style={{ fontFamily: 'Montserrat' }}>
                {product.name}
              </h3>

              {/* Opciones de peso 
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedWeight('main')}
                  className={`flex flex-col items-center transition-all ${selectedWeight === 'main' ? '' : 'opacity-50'}`}
                >
                  <span className={`text-xl md:text-2xl ${selectedWeight === 'main' ? 'text-[#50a1b0]' : 'text-gray-600'}`} style={{ fontFamily: 'Montserrat' }}>
                    {product.weight}
                  </span>
                  {selectedWeight === 'main' && <div className="w-9 h-0.5 bg-[#50a1b0] -mt-0.5 mr-7" />}
                </button>

                {product.alternativeWeight && (
                  <button
                    onClick={() => setSelectedWeight('alternative')}
                    className={`flex flex-col items-center transition-all ${selectedWeight === 'alternative' ? '' : 'opacity-50'}`}
                  >
                    <span className={`text-xl md:text-2xl ${selectedWeight === 'alternative' ? 'text-[#50a1b0]' : 'text-gray-600'}`} style={{ fontFamily: 'Montserrat' }}>
                      {product.alternativeWeight}
                    </span>
                    {selectedWeight === 'alternative' && <div className="w-10 h-0.5 bg-[#50a1b0] mt-1" />}
                  </button>
                )}
              </div>*/}
            </div>

            {/* Descripción */}
            <p className="text-[#50a1b0] text-sm md:text-base leading-relaxed text-justify md:text-left" style={{ fontFamily: 'Montserrat' }}>
              {product.description}
            </p>

            {/* Tipos de Potència 
            <div className="flex flex-col gap-3">
              <h4
                className="text-[14px] md:text-2xl text-[#50a1b0]"
                style={{ fontFamily: 'Montserrat' }}
              >
                Tipus de Potència
              </h4>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => size.available && setSelectedSize(size.value)}
                    disabled={!size.available}
                    className={`px-3 md:px-4 py-2 rounded-full border transition-all ${
                      selectedSize === size.value
                        ? 'border-[#93c5f2] text-white'
                        : 'border-[#93c5f2] text-gray-500 hover:text-white'
                    } ${!size.available && 'opacity-40 cursor-not-allowed'}`}
                    whileHover={size.available ? { scale: 1.05 } : {}}
                    whileTap={size.available ? { scale: 0.95 } : {}}
                  >
                    <span
                      className="text-sm md:text-base"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {size.value}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>*/}

            {/* Botón comprar + Precio + Stock */}
            <div className="flex items-center gap-4 md:gap-6 mt-4 flex-wrap">
              <motion.button
                onClick={() => setShowOrderModal(true)}
                disabled={!selectedSize || !selectedVariantData}
                className="flex items-center gap-0 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border-2 border-[#93c5f2] rounded-full hover:bg-[#93c5f2]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src="/images/logos/logo_small_azul.svg" alt="Logo" className='h-6 w-6'/>
                <span className="text-[16px] md:text-[24px] pl-2 font-semibold text-white" style={{ fontFamily: 'Poppins' }}>
                  {t('buy')}
                </span>
              </motion.button>

              {/*
              <div className="relative flex items-center">
                {product.inStock && (
                  <span className="absolute top-2.5 -right-4 w-2 h-2 rounded-full bg-luxury-green" />
                )}
                <span
                  className="text-xl md:text-2xl text-white"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  {product.price} €
                </span>
              </div>*/}

            </div>
          </div>
        </div>

        {/* Especificaciones técnicas 
        <div className="mt-16 md:mt-20 pt-8 border-t border-gray-800 px-4 md:px-0">
          <h4 className="text-sm md:text-base text-white mb-6 uppercase" style={{ fontFamily: 'Montserrat' }}>
            ESPECIFICACIONS TÈCNICAS:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm text-white" style={{ fontFamily: 'Montserrat', lineHeight: '1.8' }}>
            <div>
              {product.specifications.width && <p>Width: {product.specifications.width}</p>}
              {product.specifications.rise && <p>Rise: {product.specifications.rise}</p>}
              {product.specifications.backsweep && <p>Backsweep: {product.specifications.backsweep}</p>}
              {product.specifications.upsweep && <p>Upsweep: {product.specifications.upsweep}</p>}
              {product.specifications.clampDiameter && <p>Clamp Diameter: {product.specifications.clampDiameter}</p>}
            </div>
            <div>
              <p>Construction: Hephaestus-V Core Monocoque</p>
              <p className="mt-2">Autoclave Forged: For maximum strength-to-weight and resin perfection.</p>
            </div>
          </div>
        </div>*/}
      </div>

      {/* Sección de historia */}
      {product.historyDescription && product.historyImages.length > 0 && (
        <ProductHistorySection
          productName={product.name}
          historyDescription={product.historyDescription}
          images={product.historyImages}
        />
      )}

      {/* Modal de pedido */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          selectedColor: selectedVariantData?.colorName || '',
          selectedColorId: selectedVariantData?.colorId || null,
          selectedSize: selectedSize || '',
          selectedWeight: selectedWeight === 'main' ? product.weight : product.alternativeWeight || ''
        }}
      />
    </div>
  )
}