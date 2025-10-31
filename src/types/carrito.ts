// Types para el carrito de compras

export interface ItemCarrito {
  id: string // Combinación de productoId + color + otras variaciones
  productoId: number
  nombre: string
  precio: number
  color?: string
  talla?: string
  cantidad: number
  imagen?: string
  tipoProducto: 'Manillares' | 'Textil'
  stock: number
}

export interface Carrito {
  items: ItemCarrito[]
  total: number
  cantidadTotal: number
}

export interface CarritoContextType {
  carrito: Carrito
  añadirAlCarrito: (item: Omit<ItemCarrito, 'id'>) => void
  eliminarDelCarrito: (id: string) => void
  actualizarCantidad: (id: string, cantidad: number) => void
  vaciarCarrito: () => void
  obtenerItemCarrito: (productoId: number, variaciones?: { color?: string; talla?: string }) => ItemCarrito | undefined
}
