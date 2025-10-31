'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline'
import { useCarrito } from '../context/CarritoContext'
import { CarritoModal } from '../ui/CarritoModal'
import { useRouter, usePathname } from 'next/navigation'

export function Header() {
  const t = useTranslations('Header')
  const locale = useLocale()
  const { carrito } = useCarrito()
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hover, setHover] = useState({ logo:false, cart:false, user:false })
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const languages = [
    { code: 'ca', label: 'CAT' },
    { code: 'es', label: 'ESP' },
    { code: 'en', label: 'ENG' }
  ]

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      const pathWithoutLocale = pathname.split('/').slice(2).join('/')
      router.replace(`/${newLocale}/${pathWithoutLocale}`)
      setIsLanguageOpen(false)
    })
  }


   try {
    const mountainText = t('navigation.mountain')
  } catch (error) {
    console.error('[HEADER] Error obteniendo traducción:', error)
  }

  const navigationLeft = [
    { name: t('navigation.mountain'), href: `/${locale}/mountain` },
    { name: t('navigation.gravel'), href: `/${locale}/gravel` },
    { name: t('navigation.road'), href: `/${locale}/road` },
  ]

  const navigationRight = [
    { name: t('navigation.gearup'), href: `/${locale}/gear-up` },
    { name: t('navigation.eiros'), href: `/${locale}/eiros` },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed mb-3 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-luxury-black bg-opacity-90 backdrop-blur-xl shadow-luxury'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
    {/* Desktop Header */}
    <div className="hidden lg:block w-[90%] max-w-[1600px] mx-auto px-8 pt-2 pb-4">
      <div className="flex items-center justify-between h-[56px]">
        {/* Logo Izquierda */}
       <motion.div
          className="flex-shrink-0 w-[136px]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setHover(h => ({...h, logo:true}))}
          onMouseLeave={() => setHover(h => ({...h, logo:false}))}
        >
          <Link href={`/${locale}`} className="flex items-center justify-start">
            <img
              src={hover.logo
                ? "/images/header/logo_header_azul.svg"
                : "/images/header/logo_header.svg"}
              alt="Eiros Logo"
              className="h-8 w-auto object-contain transition-opacity duration-150"
            />
          </Link>
        </motion.div>

        {/* Navigation Left */}
        <nav className="flex items-center gap-[40px]">
          {navigationLeft.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              >
              <Link
                href={item.href}
                className="text-[16px] font-poppins font-medium text-white hover:text-luxury-blue transition-all duration-200 tracking-wide"
                style={{ lineHeight: '35px' }}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Navigation Center Right */}
        <nav className="flex items-center gap-[40px]">
          {navigationRight.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                className="text-[16px] font-poppins font-medium text-white hover:text-luxury-blue transition-all duration-200 tracking-wide"
                style={{ lineHeight: '35px' }}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-[10px]">
          {/* Selector de idiomas vertical */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="bg-black rounded-[20px] px-3 py-1.5 flex items-center gap-2 text-xs font-montserrat hover:bg-luxury-teal transition-colors border border-white/20"
            >
              <span>{languages.find(l => l.code === locale)?.label}</span>
              <svg className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLanguageOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-black rounded-[20px] p-3 border border-white/20 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      disabled={isPending}
                      className={`block w-full text-center py-2 text-sm font-montserrat transition-colors ${
                        locale === lang.code 
                          ? 'text-luxury-teal' 
                          : 'text-white hover:text-luxury-teal'
                      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Header */}
    <div className="lg:hidden bg-black">
      <div className="flex items-center justify-between h-[40px] px-[10px]">
        {/* Menú hamburguesa izquierda */}
        <div className="flex items-center px-[10px]">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="text-white"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Logo centro */}
        <div className="flex-1 flex justify-center">
          <Link href={`/${locale}`}>
            <img
              src="/images/header/header_mobile.svg"
              alt="Eiros Logo"
              className="h-[15px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Iconos derecha */}
        <div className="flex items-center gap-[10px] px-[10px]">
          {/* Selector de idiomas vertical móvil */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="bg-black rounded-[20px] px-3 py-1.5 flex items-center gap-2 text-xs font-montserrat hover:bg-luxury-teal transition-colors border border-white/20"
            >
              <span>{languages.find(l => l.code === locale)?.label}</span>
              <svg className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLanguageOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-black rounded-[20px] p-3 border border-white/20 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      disabled={isPending}
                      className={`block w-full text-center py-2 text-sm font-montserrat transition-colors ${
                        locale === lang.code 
                          ? 'text-luxury-teal' 
                          : 'text-white hover:text-luxury-teal'
                      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>


      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-luxury-black bg-opacity-95 backdrop-blur-xl border-t border-white border-opacity-10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-[1420px] mx-auto px-4 py-6">
              <div className="space-y-4">
                {[{ name: 'HOME', href: `/${locale}` }, ...navigationLeft, ...navigationRight].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block text-lg font-poppins font-medium text-white hover:text-luxury-blue transition-colors duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CarritoModal 
        isOpen={carritoAbierto} 
        onClose={() => setCarritoAbierto(false)} 
      />
    </motion.header>
  )
}
