'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon, 
  TrashIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline'
import { useCarrito } from '../context/CarritoContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface CarritoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CarritoModal: React.FC<CarritoModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = useCarrito()

  const handleActualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id)
    } else {
      actualizarCantidad(id, nuevaCantidad)
    }
  }

  const formatearPrecio = (precio: number) => `€${precio.toFixed(2)}`

  const irACheckout = () => {
    onClose() // Cerrar el modal
    router.push('/checkout') // Navegar a checkout
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-luxury-black border-l border-luxury-gold/20 z-50 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <ShoppingBagIcon className="w-6 h-6 text-luxury-gold" />
                  <h2 className="text-xl font-bold text-luxury-white font-orbitron tracking-wide">
                    CARRITO
                  </h2>
                  {carrito.cantidadTotal > 0 && (
                    <span className="bg-luxury-gold text-luxury-black px-2 py-1 rounded-full text-xs font-bold">
                      {carrito.cantidadTotal}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-luxury-white/70 hover:text-luxury-gold transition-colors duration-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-auto">
                {carrito.items.length === 0 ? (
                  /* Carrito vacío */
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <ShoppingBagIcon className="w-16 h-16 text-luxury-gold/30 mb-4" />
                    <h3 className="text-lg font-bold text-luxury-white mb-2">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-luxury-white/70 mb-6">
                      Añade productos para comenzar tu compra
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-luxury-gold text-luxury-black px-6 py-3 font-bold tracking-wide hover:bg-luxury-gold/90 transition-colors duration-300"
                    >
                      SEGUIR COMPRANDO
                    </button>
                  </div>
                ) : (
                  /* Items del carrito */
                  <div className="p-4 space-y-4">
                    {carrito.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-luxury-white/5 border border-luxury-gold/10 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                      >
                        {/* Imagen del producto */}
                        <div className="w-16 h-16 bg-luxury-white/10 rounded-lg overflow-hidden flex-shrink-0">
                          {item.imagen ? (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-luxury-gold/50">
                              <ShoppingBagIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-luxury-white truncate">
                            {item.nombre}
                          </h3>
                          <div className="text-xs text-luxury-white/70 mt-1">
                            {item.color && (
                              <span className="block">Color: {item.color}</span>
                            )}
                            {item.talla && (
                              <span className="block">Talla: {item.talla}</span>
                            )}
                            <span className="text-luxury-gold font-bold">
                              {formatearPrecio(item.precio)}
                            </span>
                          </div>
                        </div>

                        {/* Controles de cantidad */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-luxury-gold/30 hover:border-luxury-gold/50 text-luxury-white hover:text-luxury-gold transition-colors duration-300"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-luxury-white">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                              disabled={item.cantidad >= item.stock}
                              className={`w-6 h-6 flex items-center justify-center border transition-colors duration-300 ${
                                item.cantidad >= item.stock
                                  ? 'border-luxury-white/20 text-luxury-white/30 cursor-not-allowed'
                                  : 'border-luxury-gold/30 hover:border-luxury-gold/50 text-luxury-white hover:text-luxury-gold'
                              }`}
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Botón eliminar */}
                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="p-1 text-luxury-white/50 hover:text-red-500 transition-colors duration-300"
                            title="Eliminar del carrito"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Botón vaciar carrito */}
                    {carrito.items.length > 0 && (
                      <div className="pt-4 border-t border-luxury-gold/10">
                        <button
                          onClick={vaciarCarrito}
                          className="w-full py-2 text-sm text-luxury-white/70 hover:text-red-500 transition-colors duration-300"
                        >
                          Vaciar carrito
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer con total y checkout */}
              {carrito.items.length > 0 && (
                <div className="border-t border-luxury-gold/20 p-6 space-y-4">
                  <div className="flex items-center justify-between text-luxury-white">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-luxury-gold">
                      {formatearPrecio(carrito.total)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      className="w-full bg-luxury-gold text-luxury-black py-3 px-6 font-bold tracking-wide hover:bg-luxury-gold/90 transition-colors duration-300"
                      onClick={irACheckout}
                    >
                      PROCEDER AL PAGO
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="w-full border border-luxury-gold/30 text-luxury-white py-3 px-6 font-bold tracking-wide hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors duration-300"
                    >
                      SEGUIR COMPRANDO
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
