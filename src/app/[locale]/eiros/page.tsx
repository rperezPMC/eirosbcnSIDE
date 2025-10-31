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
            >
              <source src="/videos/about/heroSection_about_mobile.mp4" type="video/mp4" />
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
            >
              <source src="/videos/about/heroSection_about.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>


      {/* SOBRE NOSOTROS */}
      <section id='about-content' className="w-full flex flex-col items-center justify-center bg-luxury-black">
        {/* Título */}
        <h2 
          className="text-[30px] leading-[38px] md:text-7xl font-bold text-white text-center px-4 md:px-0 m-0 md:mt-10"
          style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: '70px' }}
        >
          {t('hero.title')}
        </h2>
        <h2 
          className="text-[30px] leading-[38px] md:text-7xl font-bold text-white text-center px-4 md:px-0 m-0"
          style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: '70px' }}
        >
          {t('hero.title2')}
        </h2>

        {/* Descripción */}
        <div className="px-8 justify-content md:w-[55%] md:justify-center md:mt-10" style={{ fontFamily: 'Montserrat', fontSize: '16px', lineHeight: '26px', color: '#f9f9f9' }}>
          <p className="mb-4">
            {t('content.parragraph1')}
          </p>
        </div>
      </section>
      
      
      {/* HOVER SECTION SOBRE NOSOTROS*/}
      <section
            id="hover-section-about"
            className="w-full h-full flex justify-center bg-black mt-4 md:mt-4 mb-4"
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
          >
            <div
              className={`w-[85%] rounded-[20px] overflow-hidden relative ${
                isMobile ? 'aspect-[6/9]' : ''
              }`}
              style={!isMobile ? { aspectRatio: '17/6' } : undefined}
            >
              {/* Versión móvil */}
              {isMobile ? (
                <img
                  src="/images/about/inspired_about_mobile.png"
                  alt="Inspired About Mobile"
                  className="w-full h-full object-cover absolute top-0 left-0"
                />
              ) : (
                <>
                  {/* Imagen por defecto */}
                  <img
                    src="/images/about/inspired_about.png"
                    alt="Inspired About"
                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                  />

                  {/* Imagen al hacer hover */}
                  <img
                    src="/images/about/inspired2_about.png"
                    alt="Inspired About Hover"
                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
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
          className="w-full md:w-[55%] px-8 md:px-0 text-left md:text-center mt-4 md:mt-10"
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
          className="w-full md:w-[55%] px-8 md:px-0 text-left md:text-center mt-6"
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

    </div>
  )
}
