'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useTransition } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const languages = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'ca', label: 'CA', name: 'Català' },
  { code: 'en', label: 'EN', name: 'English' },
]

interface LanguageSwitcherProps {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  // Extraer ruta sin locale
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/').filter(Boolean)
    
    if (segments.length > 0 && languages.some(lang => lang.code === segments[0])) {
      segments.shift()
    }
    
    const result = segments.length > 0 ? segments.join('/') : ''
    return result
  }

  const handleLanguageChange = (newLocale: string) => {
    
    const pathWithoutLocale = getPathWithoutLocale()
    const newPath = `/${newLocale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`
    
    startTransition(() => {
      router.push(newPath)
      router.refresh()
    })
  }

  if (compact) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className="flex items-center gap-1 px-2 py-1 text-sm font-montserrat font-normal text-white hover:text-luxury-blue transition-colors duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentLanguage.label}
          <ChevronDownIcon className="w-3 h-3" />
        </motion.button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute top-full right-0 mt-2 bg-luxury-black border border-white border-opacity-10 rounded-lg shadow-luxury overflow-hidden z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isPending}
                  className={`block w-full text-left px-4 py-2 text-sm font-montserrat transition-colors duration-300 disabled:opacity-50 ${
                    locale === lang.code
                      ? 'bg-luxury-gold text-luxury-black'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => {
        const isActive = locale === lang.code
        
        return (
          <motion.div
            key={lang.code}
            whileHover={{ scale: isActive ? 1 : 1.05 }}
            whileTap={{ scale: isActive ? 1 : 0.95 }}
          >
            <button
              onClick={() => !isActive && handleLanguageChange(lang.code)}
              disabled={isPending || isActive}
              className={`block px-3 py-1 text-sm font-medium rounded transition-colors duration-300 disabled:opacity-50 ${
                isActive
                  ? 'bg-luxury-gold text-luxury-black cursor-default'
                  : 'text-luxury-white hover:text-luxury-gold cursor-pointer'
              }`}
              title={lang.name}
            >
              {lang.label}
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}