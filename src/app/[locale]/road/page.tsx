import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'


export default function RoadPage() {
  const t = useTranslations('Road')

  return (
    <div className="w-full bg-luxury-black">

      {/* Video Hero Section */}
      <section id='mountain-hero-section-video' className="w-full flex justify-center bg-black mt-16 md:mt-20">
        <div className="w-[92%] md:w-[85%] overflow-hidden rounded-xl">
          <div className="aspect-[4/5] md:aspect-[5/2]">
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="/videos/road/heroSection_road.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="w-full bg-luxury-black flex items-center justify-center py-0 -mt-4">
        <div className="w-[350px] h-[320px] md:w-[528px] md:h-[400px] rounded-[16px] overflow-hidden">
          <img
            src="/images/road/organigrama_menu_road.svg"
            alt="Road menu"
            className="w-full h-full object-contain bg-black"
            style={{ clipPath: 'inset(60px 0 40px 0)' }}
          />
        </div>
      </section>

      {/* Imagen inferior también más cerca */}
      <section className="w-full bg-luxury-black flex items-center justify-center py-0 -mt-3">
        <div className="w-full h-[240px] md:h-[426px] rounded-[16px] overflow-hidden">
          <img
            src="/images/gravel/coming_soon_gravel.png"
            alt="Gravel coming soon"
            className="w-full h-full object-contain bg-black"
          />
        </div>
      </section>

      {/* FORGED BY GODS */}
      <section id="forged_by_gods" className="w-full flex flex-col items-center md:justify-center bg-luxury-black px-0 pb-16 -mt-2">
        <div
          className="max-w-4xl  justify-content md:text-center"
          style={{ fontFamily: 'Montserrat', fontSize: '16px', lineHeight: '26px', color: '#f9f9f9' }}
        >
          <p className="mb-4 px-6 md:mb-4">
            {t('hero.description')}
          </p>
        </div>
      </section>
    </div>
  )
}
