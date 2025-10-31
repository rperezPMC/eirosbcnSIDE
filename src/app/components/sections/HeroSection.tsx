'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Footer } from '../layout/Footer'
import { useFooter } from '../context/FooterContext'
import VideoCarousel from '../sections/home/VideoCarousel'
import ThreeCarousel from '../sections/home/ThreeCarousel'
import { AnimatedFeatureCard } from './home/AnimatedFeatureCards'
import { ImageGrid } from './home/ImageGrid'
import HeroPhotoSlider from '../sections/home/HeroPhotoSlider'

export default function HeroSection() {
  const t = useTranslations('Home')
  const locale = useLocale()
  
  const [showIntroText, setShowIntroText] = useState(true)
  const { setShowGlobalFooter } = useFooter()

  useEffect(() => {
    setShowGlobalFooter(false)
    return () => {
      setShowGlobalFooter(true)
    }
  }, [setShowGlobalFooter])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroText(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="w-full bg-luxury-black pt-16 md:pt-20">
        
        {/* HOME VIDEO */}
        <section id="home_video" className="w-full flex items-center justify-center bg-luxury-black">
          <div className="w-full">
            {/* Móvil */}
            <div className="md:hidden aspect-[350/511] py-0 ml-2 mr-2">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/videos/home/HeroSection_mobile.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Desktop/Tablet */}
            <div className="hidden md:block md:aspect-[1440/405]">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/videos/home/HeroSection_desktop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* FORGED BY GODS */}
        <section id='forged_by_gods' className="w-full flex flex-col items-center justify-center bg-luxury-black px-4 md:px-0">
          
          <div className="md:mb-2 pt-4 md:pb-6 pb-4 md:pt-10 md:pb-10">
            <img
              src="/images/home/logo_eiros.svg"
              alt="Eiros Logo"
              className="h-20 md:h-30 w-auto object-contain"
            />
          </div>

          <h2 
            className="text-[30px] leading-[38px] md:text-7xl font-bold text-white text-center md:mb-4 md:mt-4 md:mt-10 px-4 md:px-0"
            style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: 'inherit' }}
          >
            {t('hero.title')}
          </h2>

          <div
            className="w-full md:w-3/5 px-4 md:px-0 text-justify md:text-center"
            style={{ fontFamily: 'Montserrat', lineHeight: '22px', color: '#f9f9f9' }}
          >
            <p className="text-[13px] leading-[20px] md:text-base md:leading-[26px] mb-4">
              {t('hero.description')}
            </p>
            <p className="text-[13px] leading-[20px] md:text-base md:leading-[26px] mb-4">
              {t('hero.description2')}
            </p>
          </div>
        </section>

        {/* CARACTERÍSTICAS EIROS */}
        <section className="w-full flex flex-col items-center justify-center bg-luxury-black px-0 py-0 mb-4 md:px-6 md:py-16 md:gap-12 md:pb-40">
          
          {/* Fila 1 - Solo desktop */}
          <div className="hidden md:flex flex-wrap gap-14 items-center justify-center">
            <AnimatedFeatureCard
              variant="lightWeight"
              title={
                <>
                  <span className="font-bold">{t('features.lightWeight').split(' ')[0]}</span>{' '}
                  <span className="font-light">{t('features.lightWeight').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />

            <AnimatedFeatureCard
              variant="asymmetrical"
              title={
                <>
                  <span className="font-bold">{t('features.asymmetricalLaminates').split(' ')[0]}</span><br/>
                  <span className="font-light">{t('features.asymmetricalLaminates').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />

            <AnimatedFeatureCard
              variant="autoClave"
              title={
                <>
                  <span className="font-light">{t('features.autoClave').split(' ')[0]}</span>{' '}
                  <span className="font-bold">{t('features.autoClave').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />
          </div>

          {/* Imagen del manillar - Solo desktop */}
          <div className="hidden md:flex w-full px-4 h-48 overflow-hidden items-center justify-center">
            <img
              src="/images/home/manillar_forged_gods_blue_hover.png"
              alt="Manillar ATENA"
              className="w-[85%] h-auto object-contain"
            />
          </div>

          {/* Fila 2 - Solo desktop */}
          <div className="hidden md:flex flex-wrap gap-14 items-center justify-center">
            <AnimatedFeatureCard
              variant="impactResist"
              title={
                <>
                  <span className="font-light">{t('features.impactResist').split(' ')[0]}</span>{' '}
                  <span className="font-bold">{t('features.impactResist').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />

            <AnimatedFeatureCard
              variant="impactFlex"
              title={
                <>
                  <span className="font-light">{t('features.impactFlex').split(' ')[0]}</span>{' '}
                  <span className="font-bold">{t('features.impactFlex').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />

            <AnimatedFeatureCard
              variant="antiVibration"
              title={
                <>
                  <span className="font-light">{t('features.antiVibration').split(' ')[0]}</span>{' '}
                  <span className="font-bold">{t('features.antiVibration').split(' ').slice(1).join(' ')}</span>
                </>
              }
            />
          </div>

          {/* Layout móvil - Imagen arriba + Grid 2x3 */}
          <div className="w-full md:hidden flex flex-col pl-4 pr-4 mb-0">
            
            {/* Imagen del manillar - Móvil arriba */}
            <div className="w-full px-0 h-32 overflow-hidden flex items-center justify-center">
              <img
                src="/images/home/manillar_forged_gods.png"
                alt="Manillar ATENA"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-md">
              <AnimatedFeatureCard
                variant="lightWeight"
                title={
                  <>
                    <span className="font-bold">{t('features.lightWeight').split(' ')[0]}</span>{' '}
                    <span className="font-light">{t('features.lightWeight').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />

              <AnimatedFeatureCard
                variant="asymmetrical"
                title={
                  <>
                    <span className="font-bold">{t('features.asymmetricalLaminates').split(' ')[0]}</span><br/>
                    <span className="font-light">{t('features.asymmetricalLaminates').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />

              <AnimatedFeatureCard
                variant="autoClave"
                title={
                  <>
                    <span className="font-light">{t('features.autoClave').split(' ')[0]}</span>{' '}
                    <span className="font-bold">{t('features.autoClave').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />

              <AnimatedFeatureCard
                variant="impactResist"
                title={
                  <>
                    <span className="font-light">{t('features.impactResist').split(' ')[0]}</span>{' '}
                    <span className="font-bold">{t('features.impactResist').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />

              <AnimatedFeatureCard
                variant="impactFlex"
                title={
                  <>
                    <span className="font-light">{t('features.impactFlex').split(' ')[0]}</span>{' '}
                    <span className="font-bold">{t('features.impactFlex').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />

              <AnimatedFeatureCard
                variant="antiVibration"
                title={
                  <>
                    <span className="font-light">{t('features.antiVibration').split(' ')[0]}</span>{' '}
                    <span className="font-bold">{t('features.antiVibration').split(' ').slice(1).join(' ')}</span>
                  </>
                }
              />
            </div>
          </div>

        </section>

        {/* OUR UNIQUE TECHNIQUES */}
        <section className="w-full flex flex-col items-center justify-center bg-luxury-black md:px-6 md:py-10 md:px-6 md:py-16"> 
          <h2
          className="hidden md:block text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-1 px-4"
          style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: '1.2' }}
        >
            {t('techniques.title')}
          </h2>

            <div className="w-[80%] max-w-sm pt-8 h-25 md:w-full md:max-w-none md:h-100 overflow-hidden">
              <VideoCarousel />
            </div>
        </section>

        {/* SCULPED MOTION */}
        <section id='sculped_motion' className="w-full flex flex-col items-center justify-center bg-luxury-black px-4 py-6 md:px-6 md:py-16">
          <h2 
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white text-center md:mb-4 md:mb-8 px-0" 
            style={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: '1.2' }}
          >
            {t('sculpedMotion.title')}
          </h2>
          
          <div 
            className="max-w-3xl px-3 text-center px-4 md:px-0 text-justify md:text-center"
            style={{ fontFamily: 'Montserrat', fontSize: '14px', lineHeight: '22px', color: '#f9f9f9' }}
          >
            <p className="mb-4 md:mb-7 md:text-base md:leading-[26px]">
              {t('sculpedMotion.description')}
            </p>
          </div>

          <div className="w-full px-3 md:px-6 flex flex-col items-center justify-center gap-6 md:gap-10 rounded-[20px]">        
            {/* Video */}
            <motion.div 
              className="w-full max-w-[860px] aspect-[4/6] md:aspect-video rounded-[12px] md:rounded-[20px] overflow-hidden"
            >
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/videos/home/video_mountain_cta.mp4" type="video/mp4" />
              </video>
            </motion.div>


            {/* Texto */}
            <motion.div 
              className="max-w-4xl text-center px-3 md:px-0 text-justify md:text-center"
            >
              <div className="text-[#e9e9e9] text-[14px] md:text-[16px] text-justify md:text-center"
                style={{ fontFamily: 'Montserrat', fontWeight: 400, lineHeight: '22px' }}
              >
                <p className="mb-4 md:mb-7 md:text-base md:leading-[26px]">
                  {t('sculpedMotion.paragraph1')}
                </p>
                
                <p className="mb-4 md:mb-7 md:text-base md:leading-[26px]">
                  {t('sculpedMotion.paragraph2')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PHOTO SLIDER */}
        <section id='home_slider' className="w-full bg-luxury-black">
          <HeroPhotoSlider />
        </section>

        <section id="logo-section" className="md:w-full h-[60%] bg-luxury-black flex justify-center items-center mt-10 md:mt-20">
          <img
            src="./images/logos/logo_grande.svg"
            alt="Logo grande"
            className="w-18 md:w-30 lg:w-[12rem] h-auto"
          />
        </section>

        {/* IMAGE GRID */}
        <section className="w-full bg-luxury-black">
          <ImageGrid />
        </section>

        {/* Footer */}
        <section className="w-full bg-luxury-navy">
          <Footer />
        </section>

      </div>
    </>
  )
}