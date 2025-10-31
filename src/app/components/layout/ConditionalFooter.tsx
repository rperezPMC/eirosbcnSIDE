'use client'

import { useFooter } from '../context/FooterContext'
import { Footer } from './Footer'

export function ConditionalFooter() {
  const { showGlobalFooter } = useFooter()

  if (!showGlobalFooter) {
    return null
  }

  return <Footer />
}