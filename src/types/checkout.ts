// Types para el checkout y pago
import { ItemCarrito } from './carrito'

export interface DireccionEnvio {
  nombre: string
  apellido: string
  empresa?: string
  direccion: string
  ciudad: string
  codigoPostal: string
  provincia: string
  pais: string
  telefono?: string
  email: string
}

export interface DireccionFacturacion extends DireccionEnvio {
  // Podría tener campos adicionales específicos para facturación
}

export interface MetodoEnvio {
  id: string
  nombre: string
  descripcion: string
  precio: number
  tiempoEstimado: string
  activo: boolean
}

export interface MetodoPago {
  id: string
  nombre: string
  descripcion: string
  tipo: 'tarjeta' | 'paypal' | 'transferencia' | 'contrareembolso'
  activo: boolean
  comision?: number
}

export interface DatosCheckout {
  direccionEnvio: DireccionEnvio
  direccionFacturacion: DireccionFacturacion
  usarMismaDireccion: boolean
  metodoEnvio: MetodoEnvio | null
  metodoPago: MetodoPago | null
  notas?: string
}

export interface ResumenPedido {
  subtotal: number
  costoEnvio: number
  impuestos: number
  descuentos: number
  total: number
}

export interface Pedido {
  id: string
  numero: string
  fecha: Date
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'
  items: ItemCarrito[]
  datosCheckout: DatosCheckout
  resumen: ResumenPedido
  metodoPagoUsado: MetodoPago
  datosTransaccion?: {
    transactionId: string
    paymentStatus: string
    paymentMethod: string
  }
}

export interface CheckoutContextType {
  datosCheckout: DatosCheckout
  resumenPedido: ResumenPedido
  pasoActual: number
  actualizarDatosCheckout: (datos: Partial<DatosCheckout>) => void
  siguientePaso: () => void
  pasoAnterior: () => void
  procesarPago: () => Promise<Pedido>
  validarPaso: (paso: number) => boolean
}
