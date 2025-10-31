'use client'

import { motion } from 'framer-motion'
import { useCheckout } from '../context/CheckoutContext'
import { 
  MapPinIcon, 
  TruckIcon, 
  CreditCardIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const pasos = [
  {
    numero: 1,
    titulo: 'Dirección',
    descripcion: 'Datos de envío',
    icono: MapPinIcon
  },
  {
    numero: 2,
    titulo: 'Envío',
    descripcion: 'Método de entrega',
    icono: TruckIcon
  },
  {
    numero: 3,
    titulo: 'Pago',
    descripcion: 'Método de pago',
    icono: CreditCardIcon
  },
  {
    numero: 4,
    titulo: 'Confirmación',
    descripcion: 'Revisar pedido',
    icono: CheckCircleIcon
  }
]

export const CheckoutStepper = () => {
  const { pasoActual, validarPaso } = useCheckout()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {pasos.map((paso, index) => {
          const isActive = pasoActual === paso.numero
          const isCompleted = pasoActual > paso.numero
          const isValid = validarPaso(paso.numero)
          const IconComponent = paso.icono

          return (
            <div key={paso.numero} className="flex items-center flex-1">
              
              {/* Círculo del paso */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 relative z-10
                    ${isCompleted 
                      ? 'bg-luxury-gold border-luxury-gold text-luxury-black' 
                      : isActive
                        ? 'bg-luxury-black border-luxury-gold text-luxury-gold'
                        : 'bg-luxury-black border-luxury-white/30 text-luxury-white/50'
                    }
                  `}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive ? '0 0 20px rgba(212, 175, 55, 0.3)' : '0 0 0px rgba(212, 175, 55, 0)'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <CheckCircleIcon className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </motion.div>

                {/* Información del paso */}
                <div className="text-center mt-2 min-w-0">
                  <div className={`text-sm font-bold ${
                    isActive ? 'text-luxury-gold' : isCompleted ? 'text-luxury-gold' : 'text-luxury-white/70'
                  }`}>
                    {paso.titulo}
                  </div>
                  <div className="text-xs text-luxury-white/50 mt-1">
                    {paso.descripcion}
                  </div>
                </div>
              </div>

              {/* Línea conectora */}
              {index < pasos.length - 1 && (
                <div className="flex-1 px-4">
                  <div className="relative h-0.5 bg-luxury-white/20">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-luxury-gold"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isCompleted ? '100%' : isActive && isValid ? '50%' : '0%'
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Indicador de progreso general */}
      <div className="mt-6 w-full bg-luxury-white/10 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-luxury-gold to-luxury-gold/80 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((pasoActual - 1) / (pasos.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
