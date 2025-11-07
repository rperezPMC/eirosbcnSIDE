'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ImageGrid() {
  const t = useTranslations('Home')
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="w-full bg-luxury-black py-2 md:py-16 flex flex-col items-center">
      {/* Cabecera móvil con redes (visible SOLO en móvil) */}
      <div className="md:hidden w-full flex flex-col items-center mb-6">
        <p className="text-white text-[14px] md:text-[24px] text-center px-4">
          {t('contact.subtitle')}
        </p>
        <div className="flex gap-0">
          <a
            href="https://www.instagram.com/eiros.official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
          >
            <img src="/images/socials/insta.svg" alt="Instagram" className="w-8 h-8" data-preload="true"/>
          </a>
          <a
            href="https://www.tiktok.com/@eiros.official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
          >
            <img src="/images/socials/tik_tok.svg" alt="TikTok" className="w-8 h-8" data-preload="true"/>
          </a>
          <a
            href="https://www.facebook.com/eirosbcn"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
          >
            <img src="/images/socials/facebook.svg" alt="Facebook" className="w-8 h-8" data-preload="true"/>
          </a>
          <a
            href="https://x.com/EIROS_official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
          >
            <img src="/images/socials/x.svg" alt="X" className="w-8 h-8" data-preload="true"/>
          </a>
          <a
            href="https://www.linkedin.com/company/eiros"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
          >
            <img src="/images/socials/linkedin.svg" alt="LinkedIn" className="w-8 h-8" data-preload="true"/>
          </a>
          <a
            href="https://www.youtube.com/@eiros.official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center opacity-90 transition-all hover:opacity-100 hover:scale-110"
            data-preload="true"
          >
            <img src="/images/socials/youtube.svg" alt="YouTube" className="w-8 h-8" data-preload="true"/>
          </a>
          
        </div>
      </div>

      {/* Contenedor principal */}
      <div
        className="relative w-full max-w-[1300px] h-[480px] md:h-[690px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Grid de fotos responsive*/}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-4 md:grid-cols-3 md:grid-rows-3 gap-[8px] md:gap-[15px] pb-6 px-4 md:px-16">

          {/* 1 */}
          <div
            className={`relative overflow-hidden rounded-tl-[12px] md:rounded-tl-[20px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:-translate-x-8 md:-translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_1.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 2 (TR en móvil, sin TR en desktop) */}
          <div
            className={`relative overflow-hidden rounded-tr-[12px] md:rounded-tr-[0px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:-translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_2.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 3 (TR en desktop) */}
          <div
            className={`relative overflow-hidden md:rounded-tr-[20px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:translate-x-8 md:-translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_3.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 4 */}
          <div
            className={`relative overflow-hidden opacity-60 transition-transform duration-700 ease-out ${
              isHovered ? 'md:-translate-x-8' : ''
            }`}
          >
            <img src="/images/grid/bici_4.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 5 (OCULTA en móvil) */}
          <div
            className={`relative overflow-hidden opacity-60 transition-transform duration-700 ease-out hidden md:block ${
              isHovered ? 'md:scale-95' : ''
            }`}
          >
            <img src="/images/grid/bici_5.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 6 */}
          <div
            className={`relative overflow-hidden opacity-60 transition-transform duration-700 ease-out ${
              isHovered ? 'md:translate-x-8' : ''
            }`}
          >
            <img src="/images/grid/bici_6.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 7 (BL en desktop) */}
          <div
            className={`relative overflow-hidden md:rounded-bl-[20px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:-translate-x-8 md:translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_7.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 8 (BL en móvil, no en desktop) */}
          <div
            className={`relative overflow-hidden rounded-bl-[12px] md:rounded-bl-[0px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_8.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>

          {/* 9 (BR en ambos modos; más grande en desktop) */}
          <div
            className={`relative overflow-hidden rounded-br-[12px] md:rounded-br-[20px] transition-transform duration-700 ease-out ${
              isHovered ? 'md:translate-x-8 md:translate-y-8' : ''
            }`}
          >
            <img src="/images/grid/bici_9.jpg" alt="" className="w-full h-full object-cover opacity-[0.98]" data-preload="true"/>
          </div>
        </div>


        {/* Overlay central */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Texto - visible cuando NO hay hover (solo desktop) */}
          <div
            className={`hidden md:block text-center transition-all duration-500 ${
              isHovered ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            <h2 className="font-poppins font-bold text-3xl md:text-[64px] leading-tight md:leading-[70px] text-[#e9e9e9] mb-0 px-4">
              {t('contact.title')}
            </h2>
            <p className="font-poppins font-bold text-lg md:text-[32px] leading-tight md:leading-[35px] text-[#e9e9e9] px-4">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Redes sociales - visibles con hover (solo desktop en overlay) */}
          <div
            className={`hidden md:block absolute transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Iconos de redes sociales */}
              <div className="flex gap-1">
                <a
                  href="https://www.instagram.com/eiros.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/insta.svg" alt="Instagram" className="w-10 h-10" data-preload="true"/>
                </a>
                <a
                  href="https://www.tiktok.com/@eiros.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/tik_tok.svg" alt="TikTok" className="w-10 h-10" data-preload="true"/>
                </a>
                <a
                  href="https://www.facebook.com/eirosbcn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/facebook.svg" alt="Facebook" className="w-10 h-10" data-preload="true"/>
                </a>                
                <a
                  href="https://x.com/EIROS_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/x.svg" alt="X" className="w-10 h-10" data-preload="true"/>
                </a>
                <a
                  href="https://www.linkedin.com/company/eiros"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/linkedin.svg" alt="LinkedIn" className="w-10 h-10" data-preload="true"/>
                </a>
                <a
                  href="https://www.youtube.com/@eiros.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-120 transition-all duration-300 pointer-events-auto"
                >
                  <img src="/images/socials/youtube.svg" alt="YouTube" className="w-10 h-10" data-preload="true"/>
                </a>
              </div>

              {/* Texto "Pedala amb nosaltres" */}
              <p className="text-white text-base font-montserrat font-medium px-4">
                {t('contact.followText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
