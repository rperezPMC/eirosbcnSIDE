import type { Metadata } from 'next'
import { Inter, Playfair_Display, Orbitron, Poppins, Montserrat, Saira } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import { Header } from '../components/layout/Header'
import { FooterProvider } from '../components/context/FooterContext'
import { CarritoProvider } from '../components/context/CarritoContext'
import { CheckoutProvider } from '../components/context/CheckoutContext'
import { ConditionalFooter } from '../components/layout/ConditionalFooter'
import AuthProvider from '../components/providers/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900']
})

const poppins = Poppins({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700']
})

const saira = Saira({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-saira',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Eiros | Premium Bike & Textile',
  description: 'Discover our exclusive collection of premium cycling and textile products. Innovation meets elegance.',
  keywords: ['premium bikes', 'luxury textiles', 'cycling gear', 'exclusive collection'],
  authors: [{ name: 'Eiros' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Eiros | Premium Bike & Textile',
    description: 'Discover our exclusive collection of premium cycling and textile products.',
    siteName: 'Eiros',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: "device-width",
  themeColor: '#0A0A0A',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  const messages = await getMessages()

  return (
    <div className={`${inter.variable} ${playfair.variable} ${orbitron.variable} ${poppins.variable} ${montserrat.variable} ${saira.variable}`}>
      <AuthProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CarritoProvider>
            <CheckoutProvider>
              <FooterProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <ConditionalFooter />
                </div>
              </FooterProvider>
            </CheckoutProvider>
          </CarritoProvider>
        </NextIntlClientProvider>
      </AuthProvider>
    </div>
  )
}
