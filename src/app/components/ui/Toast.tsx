'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ToastProps {
  mensaje: string
  visible: boolean
  onHide: () => void
}

const Toast: React.FC<ToastProps> = ({ mensaje, visible, onHide }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 2500)
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-24 right-4 z-50 bg-luxury-gold/95 backdrop-blur-sm border border-luxury-gold rounded-lg shadow-lg max-w-sm"
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="p-3 flex items-center space-x-3">
            <CheckIcon className="w-5 h-5 text-luxury-black flex-shrink-0" />
            <p className="text-sm font-medium text-luxury-black">
              {mensaje}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
