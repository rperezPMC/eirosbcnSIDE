'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface FooterContextType {
  showGlobalFooter: boolean
  setShowGlobalFooter: (show: boolean) => void
}

const FooterContext = createContext<FooterContextType | undefined>(undefined)

export function FooterProvider({ children }: { children: ReactNode }) {
  const [showGlobalFooter, setShowGlobalFooter] = useState(true)

  return (
    <FooterContext.Provider value={{ showGlobalFooter, setShowGlobalFooter }}>
      {children}
    </FooterContext.Provider>
  )
}

export function useFooter() {
  const context = useContext(FooterContext)
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider')
  }
  return context
}