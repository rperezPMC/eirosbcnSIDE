'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NotificacionCarritoProps {
  mensaje: string
  tipo: 'success' | 'error' | 'info'
  duracion?: number
  onClose?: () => void
}

export const NotificacionCarrito: React.FC<NotificacionCarritoProps> = ({
  mensaje,
  tipo = 'success',
  duracion = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Tiempo para la animación de salida
    }, duracion)

    return () => clearTimeout(timer)
  }, [duracion, onClose])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const getStyles = () => {
    switch (tipo) {
      case 'success':
        return {
          bg: 'bg-green-600/90',
          border: 'border-green-500',
          icon: <CheckIcon className="w-5 h-5 text-white" />
        }
      case 'error':
        return {
          bg: 'bg-red-600/90',
          border: 'border-red-500',
          icon: <XMarkIcon className="w-5 h-5 text-white" />
        }
      default:
        return {
          bg: 'bg-luxury-gold/90',
          border: 'border-luxury-gold',
          icon: <CheckIcon className="w-5 h-5 text-luxury-black" />
        }
    }
  }

  const estilos = getStyles()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed top-20 right-4 z-50 ${estilos.bg} backdrop-blur-sm border ${estilos.border} rounded-lg shadow-lg max-w-sm`}
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              {estilos.icon}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${tipo === 'info' ? 'text-luxury-black' : 'text-white'}`}>
                {mensaje}
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`flex-shrink-0 p-1 rounded-full transition-colors duration-200 ${
                tipo === 'info' 
                  ? 'text-luxury-black/70 hover:text-luxury-black hover:bg-luxury-black/10' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para manejar notificaciones
export const useNotificacionCarrito = () => {
  const [notificaciones, setNotificaciones] = useState<Array<{
    id: string
    mensaje: string
    tipo: 'success' | 'error' | 'info'
    duracion?: number
  }>>([])

  const mostrarNotificacion = (
    mensaje: string, 
    tipo: 'success' | 'error' | 'info' = 'success',
    duracion = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotificaciones(prev => [...prev, { id, mensaje, tipo, duracion }])
  }

  const cerrarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id))
  }

  const NotificacionesContainer = () => (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notificaciones.map((notif) => (
        <NotificacionCarrito
          key={notif.id}
          mensaje={notif.mensaje}
          tipo={notif.tipo}
          duracion={notif.duracion}
          onClose={() => cerrarNotificacion(notif.id)}
        />
      ))}
    </div>
  )

  return {
    mostrarNotificacion,
    NotificacionesContainer
  }
}
