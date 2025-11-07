'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { NewsletterForm } from './NewsletterForm'

export function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()

  return (
    <footer className="relative bg-luxury-navy text-white overflow-hidden">

      <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none md:hidden">
        <img 
          src="/images/home/manillar_forged_gods_blue_hover.png" 
          alt="Imagen manillar footer" 
          className="w-auto h-[33%] object-contain opacity-80"
        />
      </div>

      {/* Imagen de fondo para desktop - centrada */}
      <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none pb-12">
        <img 
          src="/images/home/manillar_forged_gods_blue_hover.png" 
          alt="Imagen manillar footer" 
          className="w-auto h-[140%] object-contain opacity-100"
        />
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10">
        {/* Logo y "SCULPED MOTION" */}
        <div className="flex flex-col items-center gap-1 pt-12 md:pt-6 pb-4">
          <div className="relative w-[80px] h-[75px] md:w-[115px] md:h-[107px]">
            <img 
              src="/images/footer/logo_footer.svg" 
              alt="Eiros BCN Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-luxury-teal text-sm font-montserrat tracking-wide">
            SCULPED MOTION
          </p>
        </div>

        {/* Sección de contenido principal */}
        <div className="relative z-10 pt-6 md:pt-11 pb-0">
          <div className="max-w-[1400px] min-w-[320px] mx-auto px-4">
            
            {/* Layout móvil - centrado y vertical */}
            <div className="flex flex-col md:hidden gap-6">
              
              {/* Newsletter y redes sociales primero en móvil */}
              <div className="flex flex-col items-center gap-6">
                
                {/* Input de newsletter */}
                <NewsletterForm />

                {/* Redes sociales */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-montserrat text-center">
                    {t('social.tagline')}
                  </p>
                  <div className="flex gap-1 opacity-90">
                    <a 
                      href="https://www.instagram.com/eiros.official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/insta.svg" alt="Instagram" className="w-[30px] h-[30px]" />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@eiros.official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/tik_tok.svg" alt="Tik Tok" className="w-[30px] h-[30px]" />
                    </a>
                    <a 
                      href="https://www.facebook.com/eirosbcn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/facebook.svg" alt="Facebook" className="w-[30px] h-[30px]" />
                    </a>
                    <a 
                      href="https://x.com/EIROS_official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/x.svg" alt="X" className="w-[30px] h-[30px]" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/eiros" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/linkedin.svg" alt="Linkedin" className="w-[30px] h-[30px]" />
                    </a>
                    <a 
                      href="https://www.youtube.com/@eiros.official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-100 transition-opacity"
                    >
                      <img src="/images/socials/youtube.svg" alt="YouTube" className="w-[30px] h-[30px]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Atención al cliente - centrado */}
              <div className="flex flex-col items-center gap-2.5 py-5">
                <p className="text-base font-saira font-bold italic mb-1">
                  {t('customerService.title')}
                </p>
                <a 
                  href={`mailto:${t('customerService.email')}`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.email')}
                </a>
                <a 
                  href={`tel:${t('customerService.phone')}`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.phone')}
                </a>
                <Link 
                  href={`/${locale}/garantia`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.warranty')}
                </Link>
                <Link 
                  href={`/${locale}/devolucions`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.returns')}
                </Link>
              </div>

              {/* Más información - centrado */}
              <div className="flex flex-col items-center gap-2.5 py-2 pb-7">
                <p className="text-base font-saira font-bold italic mb-1">
                  {t('moreInfo.title')}
                </p>
                <Link 
                  href={`/${locale}/mapa-web`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.sitemap')}
                </Link>
                <Link 
                  href={`/${locale}/faqs`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.faq')}
                </Link>
                <Link 
                  href={`/${locale}/punts-venda`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.stores')}
                </Link>
                <Link 
                  href={`/${locale}/manuals`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.manuals')}
                </Link>
              </div>
            </div>

            {/* Layout desktop - 3 columnas horizontal (mantener igual) */}
            <div className="hidden md:flex flex-row justify-between gap-8 md:gap-16">
              
              {/* Columna izquierda - Atención al cliente */}
              <div className="flex flex-col gap-2 md:flex-1">
                <p className="text-base font-saira font-bold italic mb-1">
                  {t('customerService.title')}
                </p>
                <a 
                  href={`mailto:${t('customerService.email')}`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.email')}
                </a>
                <a 
                  href={`tel:${t('customerService.phone')}`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.phone')}
                </a>
                <Link 
                  href={`/${locale}/garantia`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.warranty')}
                </Link>
                <Link 
                  href={`/${locale}/devolucions`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('customerService.returns')}
                </Link>
              </div>

              {/* Columna central - Redes sociales y newsletter */}
              <div className="flex flex-col items-center gap-2 md:flex-1 mt-12">


              {/* Input de newsletter */}
              <NewsletterForm />

                <p className="text-base font-montserrat font-medium justify-center text-center">
                  {t('social.tagline')}
                </p>

                {/* Iconos de redes sociales */}
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/eiros.official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/insta.svg" alt="Instagram" className="w-9 h-9" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@eiros.official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/tik_tok.svg" alt="Tik Tok" className="w-9 h-9" />
                  </a>
                  <a 
                    href="https://www.facebook.com/eirosbcn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/facebook.svg" alt="Facebook" className="w-9 h-9" />
                  </a>
                  <a 
                    href="https://x.com/EIROS_official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/x.svg" alt="X" className="w-9 h-9" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/eiros" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/linkedin.svg" alt="Linkedin" className="w-9 h-9" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@eiros.official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img src="/images/socials/youtube.svg" alt="YouTube" className="w-9 h-9" />
                  </a>
                </div>


              </div>

              {/* Columna derecha - Más información */}
              <div className="flex flex-col gap-2.5 md:flex-1 md:items-end text-right">
                <p className="text-base font-saira font-bold italic mb-1">
                  {t('moreInfo.title')}
                </p>
                <Link 
                  href={`/${locale}/mapa-web`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.sitemap')}
                </Link>
                <Link 
                  href={`/${locale}/faqs`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.faq')}
                </Link>
                <Link 
                  href={`/${locale}/punts-venda`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.stores')}
                </Link>
                <Link 
                  href={`/${locale}/manuals`}
                  className="text-base font-saira italic hover:text-luxury-teal transition-colors"
                >
                  {t('moreInfo.manuals')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior negra con enlaces legales */}
        <div className="bg-luxury-black mt-8 py-4 md:py-4 px-6 md:px-4">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Layout móvil - 2 columnas */}
            <div className="flex md:hidden flex-col gap-1 text-xs font-saira italic">
              <div className="flex justify-between">
                <Link href={`/${locale}/privacitat`} className="hover:text-luxury-teal transition-colors mb-2">
                  {t('legal.privacy')}
                </Link>
                <Link href={`/${locale}/reemborsament`} className="hover:text-luxury-teal transition-colors text-center">
                  {t('legal.refund')}
                </Link>
              </div>
              <div className="flex justify-between">
                <Link href={`/${locale}/condicions`} className="hover:text-luxury-teal transition-colors mb-2">
                  {t('legal.terms')}
                </Link>
                <Link href={`/${locale}/enviament`} className="hover:text-luxury-teal transition-colors text-right">
                  {t('legal.shipping')}
                </Link>
              </div>
              <div className="flex justify-between">
                <Link href={`/${locale}/avis-legal`} className="hover:text-luxury-teal transition-colors">
                  {t('legal.legal')}
                </Link>
                <Link href={`/${locale}/empresa`} className="hover:text-luxury-teal transition-colors text-right">
                  {t('legal.company')}
                </Link>
              </div>
              <div className="text-center mt-12 mb-8">
                <span>©EIROS BCN 2025</span>
              </div>
            </div>

            {/* Layout desktop - horizontal */}
            <div className="hidden md:flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-8 text-xs font-saira italic">
              <Link href={`/${locale}/privacitat`} className="hover:text-luxury-teal transition-colors mb-1">
                {t('legal.privacy')}
              </Link>
              <Link href={`/${locale}/reemborsament`} className="hover:text-luxury-teal transition-colors">
                {t('legal.refund')}
              </Link>
              <Link href={`/${locale}/condicions`} className="hover:text-luxury-teal transition-colors">
                {t('legal.terms')}
              </Link>
              <Link href={`/${locale}/enviament`} className="hover:text-luxury-teal transition-colors">
                {t('legal.shipping')}
              </Link>
              <Link href={`/${locale}/avis-legal`} className="hover:text-luxury-teal transition-colors">
                {t('legal.legal')}
              </Link>
              <Link href={`/${locale}/empresa`} className="hover:text-luxury-teal transition-colors">
                {t('legal.company')}
              </Link>
              <span className="text-center">©EIROS BCN 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}