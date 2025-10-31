import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // Obtener locale de forma confiable
  let locale = await requestLocale
  
  // Fallback a español si es undefined
  if (!locale) {
    locale = 'es'
  }

  try {
    const messages = (await import(`./translation/${locale}.json`)).default
    
    return {
      locale,
      messages
    }
  } catch (error) {
    console.error('[I18N] Error cargando traducciones:', error)
    throw error
  }
})
