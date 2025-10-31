'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DatosCheckout, CheckoutContextType, ResumenPedido, MetodoEnvio, MetodoPago, Pedido } from '@/types/checkout'
import { useCarrito } from './CarritoContext'

// Datos iniciales del checkout
const datosIniciales: DatosCheckout = {
  direccionEnvio: {
    nombre: '',
    apellido: '',
    empresa: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    pais: 'España',
    telefono: '',
    email: ''
  },
  direccionFacturacion: {
    nombre: '',
    apellido: '',
    empresa: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    pais: 'España',
    telefono: '',
    email: ''
  },
  usarMismaDireccion: true,
  metodoEnvio: null,
  metodoPago: null,
  notas: ''
}

// Métodos de envío disponibles (normalmente vendrían de una API)
const metodosEnvio: MetodoEnvio[] = [
  {
    id: 'estandar',
    nombre: 'Envío Estándar',
    descripcion: 'Entrega en 3-5 días laborables',
    precio: 4.95,
    tiempoEstimado: '3-5 días',
    activo: true
  },
  {
    id: 'express',
    nombre: 'Envío Express',
    descripcion: 'Entrega en 24-48 horas',
    precio: 9.95,
    tiempoEstimado: '24-48 horas',
    activo: true
  },
  {
    id: 'gratis',
    nombre: 'Envío Gratuito',
    descripcion: 'Compras superiores a €100',
    precio: 0,
    tiempoEstimado: '5-7 días',
    activo: true
  }
]

// Métodos de pago disponibles
const metodosPago: MetodoPago[] = [
  {
    id: 'tarjeta',
    nombre: 'Tarjeta de Crédito/Débito',
    descripcion: 'Visa, Mastercard, American Express',
    tipo: 'tarjeta',
    activo: true
  },
  {
    id: 'paypal',
    nombre: 'PayPal',
    descripcion: 'Paga de forma segura con tu cuenta PayPal',
    tipo: 'paypal',
    activo: true
  },
  {
    id: 'transferencia',
    nombre: 'Transferencia Bancaria',
    descripcion: 'Pago por transferencia bancaria',
    tipo: 'transferencia',
    activo: true
  }
]

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout debe usarse dentro de CheckoutProvider')
  }
  return context
}

interface CheckoutProviderProps {
  children: ReactNode
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const { carrito } = useCarrito()
  const [datosCheckout, setDatosCheckout] = useState<DatosCheckout>(datosIniciales)
  const [pasoActual, setPasoActual] = useState(1)

  // Calcular resumen del pedido
  const calcularResumen = (): ResumenPedido => {
    const subtotal = carrito.total
    
    // Determinar costo de envío
    let costoEnvio = 0
    if (datosCheckout.metodoEnvio) {
      // Envío gratis para compras > €100
      if (subtotal >= 100 && datosCheckout.metodoEnvio.id === 'gratis') {
        costoEnvio = 0
      } else {
        costoEnvio = datosCheckout.metodoEnvio.precio
      }
    }

    // Calcular impuestos (IVA 21% en España)
    const impuestos = (subtotal + costoEnvio) * 0.21

    // Descuentos (por ahora 0, podrías implementar cupones)
    const descuentos = 0

    const total = subtotal + costoEnvio + impuestos - descuentos

    return {
      subtotal,
      costoEnvio,
      impuestos,
      descuentos,
      total
    }
  }

  const [resumenPedido, setResumenPedido] = useState<ResumenPedido>(calcularResumen())

  // Recalcular resumen cuando cambie el carrito o datos del checkout
  useEffect(() => {
    setResumenPedido(calcularResumen())
  }, [carrito, datosCheckout.metodoEnvio])

  // Funciones del contexto
  const actualizarDatosCheckout = (nuevosDatos: Partial<DatosCheckout>) => {
    setDatosCheckout(prev => {
      const nuevos = { ...prev, ...nuevosDatos }
      
      // Si se marca usar misma dirección, copiar dirección de envío a facturación
      if (nuevosDatos.usarMismaDireccion === true) {
        nuevos.direccionFacturacion = { ...nuevos.direccionEnvio }
      }
      
      return nuevos
    })
  }

  const validarPaso = (paso: number): boolean => {
    switch (paso) {
      case 1: // Dirección de envío
        const { direccionEnvio } = datosCheckout
        return !!(
          direccionEnvio.nombre &&
          direccionEnvio.apellido &&
          direccionEnvio.direccion &&
          direccionEnvio.ciudad &&
          direccionEnvio.codigoPostal &&
          direccionEnvio.email
        )
      
      case 2: // Método de envío
        return !!datosCheckout.metodoEnvio
      
      case 3: // Método de pago
        return !!datosCheckout.metodoPago
      
      default:
        return false
    }
  }

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual(prev => Math.min(prev + 1, 4))
    }
  }

  const pasoAnterior = () => {
    setPasoActual(prev => Math.max(prev - 1, 1))
  }

  const procesarPago = async (): Promise<Pedido> => {
    try {
      // Aquí iría la lógica de pago real
      // Por ahora simulamos el procesamiento
      
      const numeroPedido = `EB${Date.now()}`
      
      const pedido: Pedido = {
        id: crypto.randomUUID(),
        numero: numeroPedido,
        fecha: new Date(),
        estado: 'pendiente',
        items: [...carrito.items],
        datosCheckout: { ...datosCheckout },
        resumen: { ...resumenPedido },
        metodoPagoUsado: datosCheckout.metodoPago!,
        datosTransaccion: {
          transactionId: `tx_${Date.now()}`,
          paymentStatus: 'completed',
          paymentMethod: datosCheckout.metodoPago!.tipo
        }
      }

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aquí normalmente harías:
      // 1. Llamada a API de pago (Stripe, PayPal, etc.)
      // 2. Crear pedido en base de datos
      // 3. Enviar email de confirmación
      // 4. Limpiar carrito

      return pedido
      
    } catch (error) {
      console.error('Error procesando pago:', error)
      throw error
    }
  }

  const value: CheckoutContextType = {
    datosCheckout,
    resumenPedido,
    pasoActual,
    actualizarDatosCheckout,
    siguientePaso,
    pasoAnterior,
    procesarPago,
    validarPaso
  }

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

// Exportar métodos disponibles para usar en componentes
export { metodosEnvio, metodosPago }
