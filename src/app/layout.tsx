import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Eiros | Premium Bike & Textile',
  description: 'Discover our exclusive collection of premium cycling and textile products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-luxury-black text-luxury-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
