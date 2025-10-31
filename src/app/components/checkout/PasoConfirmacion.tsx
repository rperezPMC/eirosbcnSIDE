'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useCheckout } from '../context/CheckoutContext'
import { useCarrito } from '../context/CarritoContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const PasoConfirmacion = () => {
  const router = useRouter()
  const { datosCheckout, resumenPedido, procesarPago, pasoAnterior } = useCheckout()
  const { vaciarCarrito } = useCarrito()
  const [procesando, setProcesando] = useState(false)
  const [pedidoCompletado, setPedidoCompletado] = useState(false)
  const [numeroPedido, setNumeroPedido] = useState('')

  const formatearPrecio = (precio: number) => `€${precio.toFixed(2)}`

  const handleProcesarPago = async () => {
    setProcesando(true)
    
    try {
      const pedido = await procesarPago()
      
      // Limpiar carrito
      vaciarCarrito()
      
      // Mostrar confirmación
      setNumeroPedido(pedido.numero)
      setPedidoCompletado(true)
      
    } catch (error) {
      console.error('Error procesando pago:', error)
      alert('Error al procesar el pago. Inténtalo de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  if (pedidoCompletado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-luxury-gold mb-4 font-orbitron">
          ¡PEDIDO CONFIRMADO!
        </h2>
        
        <p className="text-luxury-white/80 mb-6">
          Tu pedido ha sido procesado correctamente.
        </p>
        
        <div className="bg-luxury-gold/10 rounded-lg p-4 mb-6">
          <p className="text-luxury-gold font-bold">
            Número de pedido: {numeroPedido}
          </p>
          <p className="text-luxury-white/70 text-sm mt-2">
            Recibirás un email de confirmación con todos los detalles.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/productos/textil')}
            className="w-full bg-luxury-gold text-luxury-black py-3 px-6 font-bold tracking-wide hover:bg-luxury-gold/90 transition-colors duration-300"
          >
            SEGUIR COMPRANDO
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-luxury-gold text-luxury-gold py-3 px-6 font-bold tracking-wide hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
          >
            IR AL INICIO
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-luxury-gold mb-6 font-orbitron">
        CONFIRMAR PEDIDO
      </h2>

      {/* Resumen de dirección de envío */}
      <div className="mb-6 p-4 bg-luxury-white/5 rounded-lg">
        <h3 className="font-bold text-luxury-gold mb-3">Dirección de envío:</h3>
        <div className="text-sm text-luxury-white/80">
          <p>{datosCheckout.direccionEnvio.nombre} {datosCheckout.direccionEnvio.apellido}</p>
          <p>{datosCheckout.direccionEnvio.direccion}</p>
          <p>{datosCheckout.direccionEnvio.codigoPostal}, {datosCheckout.direccionEnvio.ciudad}</p>
          <p>{datosCheckout.direccionEnvio.email}</p>
          {datosCheckout.direccionEnvio.telefono && (
            <p>{datosCheckout.direccionEnvio.telefono}</p>
          )}
        </div>
      </div>

      {/* Método de envío */}
      <div className="mb-6 p-4 bg-luxury-white/5 rounded-lg">
        <h3 className="font-bold text-luxury-gold mb-3">Método de envío:</h3>
        <div className="text-sm text-luxury-white/80">
          <p className="font-medium">{datosCheckout.metodoEnvio?.nombre}</p>
          <p>{datosCheckout.metodoEnvio?.descripcion}</p>
          <p>Tiempo estimado: {datosCheckout.metodoEnvio?.tiempoEstimado}</p>
        </div>
      </div>

      {/* Método de pago */}
      <div className="mb-6 p-4 bg-luxury-white/5 rounded-lg">
        <h3 className="font-bold text-luxury-gold mb-3">Método de pago:</h3>
        <div className="text-sm text-luxury-white/80">
          <p className="font-medium">{datosCheckout.metodoPago?.nombre}</p>
          <p>{datosCheckout.metodoPago?.descripcion}</p>
        </div>
      </div>

      {/* Resumen final de precios */}
      <div className="mb-6 p-4 bg-luxury-gold/10 rounded-lg border border-luxury-gold/30">
        <h3 className="font-bold text-luxury-gold mb-3">Resumen del pedido:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-luxury-white/80">Subtotal:</span>
            <span className="text-luxury-white">{formatearPrecio(resumenPedido.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-white/80">Envío:</span>
            <span className="text-luxury-white">
              {resumenPedido.costoEnvio === 0 ? 'Gratis' : formatearPrecio(resumenPedido.costoEnvio)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-white/80">IVA (21%):</span>
            <span className="text-luxury-white">{formatearPrecio(resumenPedido.impuestos)}</span>
          </div>
          <hr className="border-luxury-gold/30" />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-luxury-gold">Total:</span>
            <span className="text-luxury-gold text-xl">{formatearPrecio(resumenPedido.total)}</span>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="mb-6 p-4 bg-luxury-white/5 rounded-lg text-sm text-luxury-white/70">
        <p className="mb-2">
          Al confirmar tu pedido, aceptas nuestros{' '}
          <a href="/terminos" className="text-luxury-gold hover:underline">términos y condiciones</a>
          {' '}y nuestra{' '}
          <a href="/privacidad" className="text-luxury-gold hover:underline">política de privacidad</a>.
        </p>
        <p>
          Recibirás un email de confirmación con todos los detalles de tu pedido y el seguimiento del envío.
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-between pt-6">
        <button
          onClick={pasoAnterior}
          disabled={procesando}
          className="px-6 py-3 border border-luxury-gold text-luxury-gold font-bold tracking-wide hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ATRÁS
        </button>
        
        <button
          onClick={handleProcesarPago}
          disabled={procesando}
          className={`px-8 py-3 font-bold tracking-wide transition-all duration-300 flex items-center space-x-3 ${
            procesando
              ? 'bg-luxury-white/20 text-luxury-white/50 cursor-not-allowed'
              : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
          }`}
        >
          {procesando ? (
            <>
              <LoadingSpinner size="small" />
              <span>PROCESANDO...</span>
            </>
          ) : (
            <span>CONFIRMAR Y PAGAR</span>
          )}
        </button>
      </div>
    </motion.div>
  )
}
