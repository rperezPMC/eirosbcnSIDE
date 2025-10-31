'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Carrito, ItemCarrito, CarritoContextType } from '@/types/carrito'

// Estado inicial del carrito
const estadoInicialCarrito: Carrito = {
  items: [],
  total: 0,
  cantidadTotal: 0
}

// Acciones del carrito
type AccionCarrito =
  | { type: 'AÑADIR_ITEM'; payload: Omit<ItemCarrito, 'id'> }
  | { type: 'ELIMINAR_ITEM'; payload: string }
  | { type: 'ACTUALIZAR_CANTIDAD'; payload: { id: string; cantidad: number } }
  | { type: 'VACIAR_CARRITO' }
  | { type: 'CARGAR_CARRITO'; payload: Carrito }

// Función para generar ID único del item
const generarIdItem = (item: Omit<ItemCarrito, 'id'>): string => {
  const variaciones = [item.color, item.talla].filter(Boolean).join('-')
  return `${item.productoId}${variaciones ? `-${variaciones}` : ''}`
}

// Función para calcular totales
const calcularTotales = (items: ItemCarrito[]): { total: number; cantidadTotal: number } => {
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0)
  return { total, cantidadTotal }
}

// Reducer del carrito
const carritoReducer = (state: Carrito, action: AccionCarrito): Carrito => {
  switch (action.type) {
    case 'AÑADIR_ITEM': {
      const nuevoItemId = generarIdItem(action.payload)
      const itemExistente = state.items.find(item => item.id === nuevoItemId)

      let nuevosItems: ItemCarrito[]

      if (itemExistente) {
        // Si el item ya existe, actualizar cantidad (sin exceder stock)
        const nuevaCantidad = Math.min(
          itemExistente.cantidad + action.payload.cantidad,
          action.payload.stock
        )
        
        nuevosItems = state.items.map(item =>
          item.id === nuevoItemId
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      } else {
        // Si es un item nuevo, añadirlo
        const nuevoItem: ItemCarrito = {
          ...action.payload,
          id: nuevoItemId,
          cantidad: Math.min(action.payload.cantidad, action.payload.stock)
        }
        nuevosItems = [...state.items, nuevoItem]
      }

      const totales = calcularTotales(nuevosItems)
      return {
        items: nuevosItems,
        ...totales
      }
    }

    case 'ELIMINAR_ITEM': {
      const nuevosItems = state.items.filter(item => item.id !== action.payload)
      const totales = calcularTotales(nuevosItems)
      return {
        items: nuevosItems,
        ...totales
      }
    }

    case 'ACTUALIZAR_CANTIDAD': {
      const { id, cantidad } = action.payload
      
      if (cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        const nuevosItems = state.items.filter(item => item.id !== id)
        const totales = calcularTotales(nuevosItems)
        return {
          items: nuevosItems,
          ...totales
        }
      }

      const nuevosItems = state.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            cantidad: Math.min(cantidad, item.stock) // No exceder stock
          }
        }
        return item
      })

      const totales = calcularTotales(nuevosItems)
      return {
        items: nuevosItems,
        ...totales
      }
    }

    case 'VACIAR_CARRITO':
      return estadoInicialCarrito

    case 'CARGAR_CARRITO':
      return action.payload

    default:
      return state
  }
}

// Crear el contexto
const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

// Hook personalizado para usar el carrito
export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  }
  return context
}

// Provider del carrito
interface CarritoProviderProps {
  children: ReactNode
}

export const CarritoProvider: React.FC<CarritoProviderProps> = ({ children }) => {
  const [carrito, dispatch] = useReducer(carritoReducer, estadoInicialCarrito)

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('eiros-carrito')
    if (carritoGuardado) {
      try {
        const carritoParseado = JSON.parse(carritoGuardado)
        dispatch({ type: 'CARGAR_CARRITO', payload: carritoParseado })
      } catch (error) {
        console.error('Error al cargar carrito del localStorage:', error)
        localStorage.removeItem('eiros-carrito')
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (carrito.items.length > 0 || carrito.total > 0) {
      localStorage.setItem('eiros-carrito', JSON.stringify(carrito))
    } else {
      localStorage.removeItem('eiros-carrito')
    }
  }, [carrito])

  // Funciones del contexto
  const añadirAlCarrito = (item: Omit<ItemCarrito, 'id'>) => {
    dispatch({ type: 'AÑADIR_ITEM', payload: item })
  }

  const eliminarDelCarrito = (id: string) => {
    dispatch({ type: 'ELIMINAR_ITEM', payload: id })
  }

  const actualizarCantidad = (id: string, cantidad: number) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { id, cantidad } })
  }

  const vaciarCarrito = () => {
    dispatch({ type: 'VACIAR_CARRITO' })
  }

  const obtenerItemCarrito = (productoId: number, variaciones?: { color?: string; talla?: string }) => {
    const itemId = generarIdItem({
      productoId,
      color: variaciones?.color,
      talla: variaciones?.talla,
      nombre: '',
      precio: 0,
      cantidad: 0,
      tipoProducto: 'Manillares',
      stock: 0
    })
    return carrito.items.find(item => item.id === itemId)
  }

  const value: CarritoContextType = {
    carrito,
    añadirAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerItemCarrito
  }

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}
