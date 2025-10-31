'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

// Componente de rombo para el organigrama
function DiamondShape({ active = false }: { active?: boolean }) {
  return (
    <div className="relative w-[50px] h-[54px]">
      <svg viewBox="0 0 50 54" fill="none" className="w-full h-full">
        <path
          d="M25 0L50 27L25 54L0 27L25 0Z"
          fill="none"
          stroke={active ? "#50a1b0" : "#50a1b0"}
          strokeWidth="1"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  )
}

// Componente de botón del organigrama
function OrgButton({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <button className={`
      px-3 py-1 rounded-full text-sm font-medium italic
      transition-all duration-300
      ${active ? 'text-luxury-blue' : 'text-gray-400'}
      hover:text-luxury-blue
    `}
    style={{ fontFamily: 'Saira' }}
    >
      {text}
    </button>
  )
}

// Componente de categoría del organigrama
function OrgCategory({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg className="w-[132px] h-[1px]" viewBox="0 0 132 1">
        <line x1="0" y1="0.5" x2="132" y2="0.5" stroke="#50a1b0" strokeWidth="1" />
      </svg>
    
      <svg className="w-[1px] h-[40px]" viewBox="0 0 1 40">
        <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="#50a1b0" strokeWidth="1" />
      </svg>
      
      <DiamondShape />
      
      <OrgButton text={categoryName} />
      
      <div className="rotate-90">
        <svg className="w-[132px] h-[1px]" viewBox="0 0 132 1">
          <line x1="0" y1="0.5" x2="132" y2="0.5" stroke="#50a1b0" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}

// Componente principal del organigrama
function Organigrama() {
  const t = useTranslations('GearUp.organigrama')
  
  return (
    <div className="flex flex-col items-center gap-8 py-20">
      {/* Logo central */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-[91px] h-[85px] relative">
          <img 
            src="/images/header/logo_header.svg" 
            alt="Eiros Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-luxury-blue text-base font-medium italic" style={{ fontFamily: 'Saira', lineHeight: '70px' }}>
          {t('logoText')}
        </p>
      </div>
      
      {/* Línea vertical */}
      <svg className="w-[1px] h-[40px]" viewBox="0 0 1 40">
        <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="#50a1b0" strokeWidth="1" />
      </svg>
      
      {/* Categorías */}
      <div className="flex gap-16 items-start">
        <OrgCategory categoryName={t('categories.cycling')} />
        <OrgCategory categoryName={t('categories.street')} />
        <OrgCategory categoryName={t('categories.complements')} />
        <OrgCategory categoryName={t('categories.accessories')} />
      </div>
    </div>
  )
}

// Sección de imagen doble con texto central
function DoubleImageSection({ 
  leftImage, 
  rightImage, 
  centerText,
  backgroundColor = 'transparent' 
}: { 
  leftImage: string
  rightImage: string
  centerText?: string
  backgroundColor?: string
}) {
  return (
    <section 
      className="w-full py-12 px-[87px]"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        {/* Imagen izquierda */}
        <div className="w-[587px] h-[734px] rounded-[20px] overflow-hidden">
          <img 
            src={leftImage} 
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Texto central */}
        {centerText && (
          <div className="w-[185px] flex items-center justify-center">
            <p 
              className="text-2xl font-medium italic text-[#a68456]"
              style={{ fontFamily: 'Saira' }}
            >
              {centerText}
            </p>
          </div>
        )}
        
        {/* Imagen derecha */}
        <div className="w-[587px] h-[734px] rounded-[20px] overflow-hidden">
          <img 
            src={rightImage} 
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default function GearUpPage() {
  const t = useTranslations('GearUp')

  return (
    <div className="w-full bg-white text-gray-900">
      {/* Video hero section */}
      <section className="w-full flex justify-center mt-20 px-10">
        <div className="w-full max-w-[1920px] rounded-[20px] overflow-hidden" style={{ aspectRatio: '1920/810' }}>
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/videos/gear_up/heroSection_video_gearup.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Organigrama */}
      <Organigrama />

      {/* Texto descriptivo */}
      <section className="w-full flex justify-center py-12">
        <p className="text-center max-w-[838px] text-base font-montserrat leading-relaxed text-gray-800">
          {t('hero.description')}
        </p>
      </section>

      {/* Imagen horizontal grande */}
      <section className="w-full px-[85px] py-0">
        <div className="max-w-[1750px] mx-auto h-[840px] rounded-[20px] overflow-hidden">
          <img 
            src="/images/gear_up/imagen1_gear_up.png" 
            alt="Product showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Sección doble de imágenes - Colección Peloton */}
      <DoubleImageSection
        leftImage="/images/gear_up/imagen2_gear_up.png"
        rightImage="/images/gear_up/imagen3_gear_up.png"
        centerText={t('collections.peloton')}
      />

      {/* Sección doble de imágenes - Hombre */}
      <DoubleImageSection
        leftImage="/images/gear_up/imagen4_gear_up.png"
        rightImage="/images/gear_up/imagen5_gear_up.png"
      />

      {/* Sección doble de imágenes - Ciclismo */}
      <DoubleImageSection
        leftImage="/images/gear_up/imagen6_gear_up.png"
        rightImage="/images/gear_up/imagen7_gear_up.png"
      />

      {/* Imagen horizontal grande final */}
      <section className="w-full px-[85px] py-12">
        <div className="max-w-[1750px] mx-auto h-[840px] rounded-[20px] overflow-hidden">
          <img 
            src="/images/gear_up/imagen8_gear_up.png" 
            alt="Product showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  )
}