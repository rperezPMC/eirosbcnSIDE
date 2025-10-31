'use client'

import { motion } from 'framer-motion'
import { TruckIcon } from '@heroicons/react/24/outline'
import { useCheckout, metodosEnvio } from '../context/CheckoutContext'
import { useCarrito } from '../context/CarritoContext'

export const PasoEnvio = () => {
  const { carrito } = useCarrito()
  const { datosCheckout, actualizarDatosCheckout, siguientePaso, pasoAnterior } = useCheckout()

  const handleSeleccionarEnvio = (metodo: typeof metodosEnvio[0]) => {
    actualizarDatosCheckout({ metodoEnvio: metodo })
  }

  const handleContinuar = () => {
    if (datosCheckout.metodoEnvio) {
      siguientePaso()
    }
  }

  const formatearPrecio = (precio: number) => `€${precio.toFixed(2)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-luxury-gold mb-6 font-orbitron">
        MÉTODO DE ENVÍO
      </h2>

      <div className="space-y-4">
        {metodosEnvio.map((metodo) => {
          const isSelected = datosCheckout.metodoEnvio?.id === metodo.id
          const isDisabled = metodo.id === 'gratis' && carrito.total < 100
          
          return (
            <motion.div
              key={metodo.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : isDisabled
                  ? 'border-luxury-white/20 bg-luxury-white/5 opacity-50 cursor-not-allowed'
                  : 'border-luxury-white/30 hover:border-luxury-gold/50 hover:bg-luxury-white/5'
              }`}
              onClick={() => !isDisabled && handleSeleccionarEnvio(metodo)}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-luxury-gold bg-luxury-gold' : 'border-luxury-white/50'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-luxury-black rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="w-6 h-6 text-luxury-gold" />
                    <div>
                      <h3 className="font-bold text-luxury-white">
                        {metodo.nombre}
                        {metodo.id === 'gratis' && carrito.total < 100 && (
                          <span className="text-xs text-luxury-white/50 ml-2">
                            (Requiere €{(100 - carrito.total).toFixed(2)} más)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-luxury-white/70">
                        {metodo.descripcion}
                      </p>
                      <p className="text-xs text-luxury-white/50">
                        Tiempo estimado: {metodo.tiempoEstimado}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-luxury-gold">
                    {metodo.precio === 0 ? 'Gratis' : formatearPrecio(metodo.precio)}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-luxury-gold/10 rounded-lg">
        <h4 className="font-bold text-luxury-gold mb-2">Información de envío:</h4>
        <ul className="text-sm text-luxury-white/80 space-y-1">
          <li>• Todos los envíos incluyen número de seguimiento</li>
          <li>• Empaquetado premium con materiales reciclables</li>
          <li>• Entrega de lunes a viernes (festivos excluidos)</li>
          <li>• Notificación por email y SMS del estado del envío</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex justify-between pt-6">
        <button
          onClick={pasoAnterior}
          className="px-6 py-3 border border-luxury-gold text-luxury-gold font-bold tracking-wide hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
        >
          ATRÁS
        </button>
        
        <button
          onClick={handleContinuar}
          disabled={!datosCheckout.metodoEnvio}
          className={`px-8 py-3 font-bold tracking-wide transition-all duration-300 ${
            datosCheckout.metodoEnvio
              ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
              : 'bg-luxury-white/20 text-luxury-white/50 cursor-not-allowed'
          }`}
        >
          CONTINUAR
        </button>
      </div>
    </motion.div>
  )
}
