'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import AboutSlider from '@/app/components/sections/home/AboutSlider'
import { ImageGrid } from '@/app/components/sections/home/ImageGrid'

export default function EirosPage() {
    const t = useTranslations('About')
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkSize = () => setIsMobile(window.innerWidth < 768)
      checkSize()
      window.addEventListener('resize', checkSize)
      return () => window.removeEventListener('resize', checkSize)
    }, [])

  return (
    <div className="w-full bg-luxury-black">

      {/* ABOUT HERO VIDEO */}
      <section id="about-hero-section-video" className="w-full flex justify-center bg-black px-4 mt-16 md:mt-20">
        <div className="w-[92%] h-[80%] md:w-[85%] overflow-hidden rounded-xl">
          {/* Móvil */}
          <div className="md:hidden aspect-[4/5]">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              data-preload="true"
            >
              <source src="/videos/about/heroSection_about_mobile.mp4#t=0.001" type="video/mp4" />
            </video>
          </div>

          {/* Desktop/Tablet */}
          <div className="hidden md:block md:aspect-[4/2]">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              data-preload="true"
            >
              <source src="/videos/about/heroSection_about.mp4#t=0.001" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id='about-content' className="w-full flex flex-col mt-4 items-center justify-center bg-luxury-black">
        {/* Título */}
        <h2 className="text-[30px] md:text-7xl font-bold text-white text-center px-4 md:px-0 m-0 leading-none">
          {t('hero.title')}
        </h2>
        <h2 className="text-[30px] md:text-7xl font-bold text-white text-center mb-4 px-4 md:px-0 m-0 leading-none">
          {t('hero.title2')}
        </h2>

        {/* Descripción */}
        <div className="px-8 text-justify md:w-[55%] md:mt-10" style={{ fontFamily: 'Montserrat', fontSize: '16px', lineHeight: '26px', color: '#f9f9f9' }}>
          <p className="mb-4">
            {t('content.parragraph1')}
          </p>
        </div>
      </section>

     {/* HOVER SECTION SOBRE NOSOTROS */}
      <section
        id="hover-section-about"
        className={`
          w-full flex justify-center bg-black 
          ${isMobile ? '-mt-5 -mb-5' : 'mt-4 mb-4'} 
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div
          className={`w-[95%] md:w-[85%] rounded-[20px] overflow-hidden relative ${
            isMobile ? 'h-[100dvh] max-h-[90vh]' : ''
          }`}
          style={!isMobile ? { aspectRatio: '17/6' } : undefined}
        >
          {isMobile ? (
            <div className="relative w-full h-full bg-black">
              <img
                src="/images/about/inspired_about_mobile.png"
                alt="Inspired About Mobile"
                className="absolute inset-0 w-full h-full object-contain object-center"
                style={{
                  WebkitTransform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
            </div>
          ) : (
            <>
              <img
                src="/images/about/inspired_about.png"
                alt="Inspired About"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ${
                  isHovered ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  WebkitTransform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
              <img
                src="/images/about/inspired2_about.png"
                alt="Inspired About Hover"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  WebkitTransform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
            </>
          )}
        </div>
      </section>
      
      {/* SOBRE NOSOTROS */}
      <section
        id="about-content"
        className="w-full flex flex-col md:items-center md:justify-center bg-luxury-black"
      >
        {/* Párrafos iniciales */}
        <div
          className="w-full md:w-[55%] px-8 text-justify md:px-0 text-left md:text-center mt-4 md:mt-10"
          style={{
            fontFamily: 'Montserrat',
            fontSize: '16px',
            lineHeight: '26px',
            color: '#f9f9f9'
          }}
        >
          <p className="mb-4">{t('content.parragraph2')}</p>
        </div>

        <div
          className="w-full md:w-[55%] px-8 text-justify md:px-0 text-left md:text-center mt-6"
          style={{
            fontFamily: 'Montserrat',
            fontSize: '16px',
            lineHeight: '26px',
            color: '#f9f9f9'
          }}
        >
          <p className="mb-4">{t('content.parragraph3')}</p>
        </div>

        {/* Subtítulo */}
        <h4
          className="w-full px-8 md:px-0 text-left md:w-[55%] md:text-right text-base font-normal text-white md:text-3xl md:font-bold"
          style={{ fontFamily: 'Poppins', lineHeight: '70px' }}
        >
          {t('content.subtitle')}
        </h4>
        <div
          className="w-full px-8 md:px-0 text-left md:w-[55%] md:text-right"
          style={{
            fontFamily: 'Montserrat',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#f9f9f9'
          }}
        >
          <p className="mb-4 md:text-[22px] md:leading-[26px]">
            {t('content.subtitle2')}
          </p>
        </div>
      </section>

      {/* SLIDER SOBRE NOSOTROS */}
      <AboutSlider />

      <section id="logo-section" className="md:w-full h-[60%] bg-luxury-black flex justify-center items-center mt-10 md:mt-20">
        <img
          src="/images/logos/logo_grande.svg"
          alt="Logo grande"
          className="w-18 md:w-30 lg:w-[12rem] h-auto"
        />
      </section>

      {/* IMAGE GRID */}
      <section className="w-full bg-luxury-black">
        <ImageGrid />
      </section>
      

    </div>
  )
}
