'use client'

import { motion } from 'framer-motion'
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline'
import { useCheckout, metodosPago } from '../context/CheckoutContext'

const iconosPago = {
  tarjeta: CreditCardIcon,
  paypal: BanknotesIcon,
  transferencia: BuildingLibraryIcon,
  contrareembolso: BanknotesIcon
}

export const PasoPago = () => {
  const { datosCheckout, actualizarDatosCheckout, siguientePaso, pasoAnterior } = useCheckout()

  const handleSeleccionarPago = (metodo: typeof metodosPago[0]) => {
    actualizarDatosCheckout({ metodoPago: metodo })
  }

  const handleContinuar = () => {
    if (datosCheckout.metodoPago) {
      siguientePaso()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-luxury-gold mb-6 font-orbitron">
        MÉTODO DE PAGO
      </h2>

      <div className="space-y-4">
        {metodosPago.map((metodo) => {
          const isSelected = datosCheckout.metodoPago?.id === metodo.id
          const IconComponent = iconosPago[metodo.tipo]
          
          return (
            <motion.div
              key={metodo.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : 'border-luxury-white/30 hover:border-luxury-gold/50 hover:bg-luxury-white/5'
              }`}
              onClick={() => handleSeleccionarPago(metodo)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                    <IconComponent className="w-6 h-6 text-luxury-gold" />
                    <div>
                      <h3 className="font-bold text-luxury-white">
                        {metodo.nombre}
                      </h3>
                      <p className="text-sm text-luxury-white/70">
                        {metodo.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {metodo.comision && (
                    <div className="text-sm text-luxury-white/50">
                      +{metodo.comision}% comisión
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Información de seguridad */}
      <div className="mt-6 p-4 bg-luxury-gold/10 rounded-lg">
        <h4 className="font-bold text-luxury-gold mb-2">🔒 Pago 100% Seguro</h4>
        <ul className="text-sm text-luxury-white/80 space-y-1">
          <li>• Conexión SSL cifrada de 256 bits</li>
          <li>• Datos de pago protegidos según PCI DSS</li>
          <li>• No almacenamos información de tarjetas</li>
          <li>• Procesamiento a través de pasarelas certificadas</li>
        </ul>
      </div>

      {/* Formulario específico según método seleccionado */}
      {datosCheckout.metodoPago?.tipo === 'tarjeta' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-luxury-white/5 rounded-lg border border-luxury-gold/20"
        >
          <h4 className="font-bold text-luxury-gold mb-4">Datos de la tarjeta</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-white mb-2">
                Número de tarjeta
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 bg-luxury-white/10 border border-luxury-gold/30 rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-luxury-white mb-2">
                  MM/AA
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  className="w-full p-3 bg-luxury-white/10 border border-luxury-gold/30 rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-white mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 bg-luxury-white/10 border border-luxury-gold/30 rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
          disabled={!datosCheckout.metodoPago}
          className={`px-8 py-3 font-bold tracking-wide transition-all duration-300 ${
            datosCheckout.metodoPago
              ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
              : 'bg-luxury-white/20 text-luxury-white/50 cursor-not-allowed'
          }`}
        >
          REVISAR PEDIDO
        </button>
      </div>
    </motion.div>
  )
}
