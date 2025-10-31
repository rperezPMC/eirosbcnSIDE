'use client'

import { motion } from 'framer-motion'
import { useCarrito } from '../context/CarritoContext'
import { useCheckout } from '../context/CheckoutContext'

export const ResumenPedido = () => {
  const { carrito } = useCarrito()
  const { resumenPedido, datosCheckout } = useCheckout()

  const formatearPrecio = (precio: number) => `€${precio.toFixed(2)}`

  return (
    <motion.div
      className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <h3 className="text-xl font-bold text-luxury-gold mb-6 font-orbitron">
        RESUMEN DEL PEDIDO
      </h3>

      {/* Items del carrito */}
      <div className="space-y-4 mb-6">
        {carrito.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
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
                  <span className="text-xs">IMG</span>
                </div>
              )}
            </div>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-luxury-white truncate">
                {item.nombre}
              </h4>
              <div className="text-xs text-luxury-white/70 mt-1">
                {item.color && <span>Color: {item.color}</span>}
                {item.talla && <span className="ml-2">Talla: {item.talla}</span>}
                <div className="mt-1">
                  Cantidad: {item.cantidad} × {formatearPrecio(item.precio)}
                </div>
              </div>
            </div>

            {/* Precio total del item */}
            <div className="text-sm font-bold text-luxury-gold">
              {formatearPrecio(item.precio * item.cantidad)}
            </div>
          </div>
        ))}
      </div>

      {/* Separador */}
      <hr className="border-luxury-gold/20 mb-6" />

      {/* Desglose de precios */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-luxury-white/70">Subtotal:</span>
          <span className="text-luxury-white">{formatearPrecio(resumenPedido.subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-luxury-white/70">
            Envío:
            {datosCheckout.metodoEnvio && (
              <span className="ml-2 text-xs">({datosCheckout.metodoEnvio.nombre})</span>
            )}
          </span>
          <span className="text-luxury-white">
            {resumenPedido.costoEnvio === 0 ? 'Gratis' : formatearPrecio(resumenPedido.costoEnvio)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-luxury-white/70">IVA (21%):</span>
          <span className="text-luxury-white">{formatearPrecio(resumenPedido.impuestos)}</span>
        </div>

        {resumenPedido.descuentos > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-luxury-white/70">Descuentos:</span>
            <span className="text-green-400">-{formatearPrecio(resumenPedido.descuentos)}</span>
          </div>
        )}

        {/* Separador final */}
        <hr className="border-luxury-gold/30" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span className="text-luxury-white">Total:</span>
          <span className="text-luxury-gold text-xl">
            {formatearPrecio(resumenPedido.total)}
          </span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-luxury-gold/10 rounded-lg">
        <div className="text-xs text-luxury-white/80">
          <p className="mb-2">✓ Envío asegurado</p>
          <p className="mb-2">✓ Devoluciones gratis en 30 días</p>
          <p>✓ Garantía de calidad Eiros</p>
        </div>
      </div>

      {/* Método de pago seleccionado */}
      {datosCheckout.metodoPago && (
        <div className="mt-4 p-3 bg-luxury-white/5 rounded-lg">
          <div className="text-sm">
            <span className="text-luxury-white/70">Método de pago: </span>
            <span className="text-luxury-gold font-medium">
              {datosCheckout.metodoPago.nombre}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
