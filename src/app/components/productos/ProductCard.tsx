'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ProductoConImagenes } from '@/types/database'
import { useCarrito } from '@/app/components/context/CarritoContext'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import Toast from '../ui/Toast'

interface ProductCardProps {
  producto: ProductoConImagenes
  className?: string
}

export function ProductCard({ producto, className }: ProductCardProps) {
  const { añadirAlCarrito } = useCarrito()
  const [showToast, setShowToast] = useState(false)
  
  // Obtener imagen principal o primera imagen disponible
  const imagenPrincipal = producto.imagenPrincipal || producto.imagenes[0]
  const imagenUrl = imagenPrincipal?.RutaCompleta || '/images/placeholder-product.jpg'
  const imagenAlt = imagenPrincipal?.AltText || `Imagen de ${producto.Nombre}`

  // Calcular precio con descuento
  const precioFinal = producto.EnOferta && producto.PorcentajeDescuento 
    ? producto.Precio * (1 - producto.PorcentajeDescuento / 100)
    : producto.Precio

  // Función para añadir al carrito directamente desde la card
  const handleAñadirAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    añadirAlCarrito({
      productoId: producto.Id,
      nombre: producto.Nombre,
      precio: precioFinal,
      color: producto.Color,
      talla: producto.TipoProducto === 'Textil' ? undefined : undefined, // Para textiles, redirigirá a la página individual
      cantidad: 1,
      imagen: imagenUrl,
      tipoProducto: producto.TipoProducto as 'Manillares' | 'Textil',
      stock: producto.Stock
    })
    
    setShowToast(true)
  }

  return (
    <>
      <Toast 
        mensaje={`¡${producto.Nombre} añadido al carrito!`}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
      
      <div className={clsx(
        'group relative bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10',
        'rounded-none shadow-luxury transition-all duration-300 hover:shadow-luxury-lg',
        'overflow-hidden',
        className
      )}>
        {/* Badges */}
        <div className='absolute top-4 left-4 z-10 flex flex-col gap-2'>
          {producto.Novedad && (
            <span className='bg-luxury-gold text-luxury-black text-xs font-semibold px-2 py-1'>
              NUEVO
            </span>
          )}
          {producto.EnOferta && (
            <span className='bg-red-600 text-white text-xs font-semibold px-2 py-1'>
              -{producto.PorcentajeDescuento}%
            </span>
          )}
          {producto.Destacado && (
            <span className='bg-luxury-gold text-luxury-black text-xs font-semibold px-2 py-1'>
              DESTACADO
            </span>
          )}
        </div>

        {/* Botón favorito */}
        <button 
          className='absolute top-4 right-4 z-10 p-2 bg-luxury-black bg-opacity-50 backdrop-blur-sm rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-opacity-70'
          onClick={(e) => {
            e.preventDefault()
            // TODO: Implementar funcionalidad de favoritos
          }}
        >
          <HeartIcon className='h-5 w-5 text-luxury-gold' />
        </button>

        {/* Imagen del producto */}
        <div className='relative h-64 overflow-hidden bg-luxury-white/10'>
          <Link href={`/productos/${producto.TipoProducto.toLowerCase()}/${producto.Id}`}>
            <Image
              src={imagenUrl}
              alt={imagenAlt}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            />
          </Link>
          
          {/* Overlay en hover */}
          <div className='absolute inset-0 bg-luxury-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300' />
        </div>

        {/* Contenido */}
        <div className='p-4 space-y-3'>
          {/* Título y categoría */}
          <div>
            <Link href={`/productos/${producto.TipoProducto.toLowerCase()}/${producto.Id}`}>
              <h3 className='text-lg font-semibold text-luxury-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2'>
                {producto.Nombre}
              </h3>
            </Link>
            <p className='text-sm text-luxury-white/60 mt-1'>
              {producto.TipoProducto}
              {producto.TipoProducto === 'Manillares' && producto.Material && ` • ${producto.Material}`}
              {producto.TipoProducto === 'Textil' && producto.Genero && ` • ${producto.Genero}`}
            </p>
          </div>

          {/* Descripción */}
          {producto.Descripcion && (
            <p className='text-sm text-luxury-white/70 line-clamp-2'>
              {producto.Descripcion}
            </p>
          )}

          {/* Especificaciones específicas */}
          <div className='flex flex-wrap gap-1'>
            {producto.TipoProducto === 'Manillares' && (
              <>  
                {producto.Material && (
                  <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                    {producto.Material}
                  </span>
                )}
                {producto.Peso && (
                  <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                    {producto.Peso}kg
                  </span>
                )}
                {producto.Ancho && (
                  <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                    {producto.Ancho}mm
                  </span>
                )}
              </>
            )}
            
            {producto.TipoProducto === 'Textil' && (
              <>
                {producto.Talla && (
                  <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                    {producto.Talla}
                  </span>
                )}
                {producto.Textil && (
                  <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                    {producto.Textil}
                  </span>
                )}
              </>
            )}
            
            {producto.Color && (
              <span className='text-xs bg-luxury-white/10 text-luxury-white/80 px-2 py-1 rounded'>
                {producto.Color}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className='flex items-center gap-2'>
            <div className={clsx(
              'h-2 w-2 rounded-full',
              producto.Stock > 0 ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span className={clsx(
              'text-xs',
              producto.Stock > 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {producto.Stock > 0 ? `${producto.Stock} disponibles` : 'Sin stock'}
            </span>
          </div>

          {/* Precio y acciones */}
          <div className='flex justify-between items-center pt-2 border-t border-luxury-gold/20'>
            <div className='space-y-1'>
              {producto.EnOferta && producto.PorcentajeDescuento ? (
                <>
                  <div className='text-lg font-bold text-luxury-gold' >
                    €{precioFinal.toFixed(2)}
                  </div>
                  <div className='text-sm text-luxury-white/50 line-through'>
                    €{producto.Precio.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className='text-lg font-bold text-luxury-gold'>
                  €{producto.Precio.toFixed(2)}
                </div>
              )}
            </div>

            <div className='flex gap-2'>
              {/* Botón carrito - comportamiento diferente para manillares vs textil */}
              {producto.TipoProducto === 'Manillares' ? (
                <button
                  className='p-2 bg-luxury-gold text-luxury-black rounded hover:bg-luxury-gold/90 
                             transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={producto.Stock === 0}
                  onClick={handleAñadirAlCarrito}
                  title='Añadir al carrito'
                >
                  <ShoppingCartIcon className='h-4 w-4' />
                </button>
              ) : (
                <Link
                  href={`/productos/${producto.TipoProducto.toLowerCase()}/${producto.Id}`}
                  className='p-2 bg-luxury-gold text-luxury-black rounded hover:bg-luxury-gold/90 
                             transition-colors duration-300'
                  title='Seleccionar opciones'
                >
                  <ShoppingCartIcon className='h-4 w-4' />
                </Link>
              )}
              
              <Link 
                href={`/productos/${producto.TipoProducto.toLowerCase()}/${producto.Id}`}
                className='px-3 py-2 bg-transparent border border-luxury-gold text-luxury-gold text-sm
                           hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300'
              >
                Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
