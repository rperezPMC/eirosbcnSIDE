'use client'

import { useState } from 'react'
import MountainProductCard from './MountainProductCard'
import { MountainProduct } from '@/lib/services/mountainProductService.json'

interface MountainProductCardWithDataProps {
  product: MountainProduct
}

export function MountainProductCardWithData({ product }: MountainProductCardWithDataProps) {
  // Validar y normalizar ruta de imagen
  const normalizarRuta = (ruta: string | undefined): string => {
    if (!ruta) return '/images/placeholder.png'
    
    // Validar que sea una imagen válida
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
    const esImagenValida = extensionesValidas.some(ext => ruta.toLowerCase().endsWith(ext))
    
    if (!esImagenValida) return '/images/placeholder.png'
    
    // Agregar / al inicio si no lo tiene
    return ruta.startsWith('/') ? ruta : `/${ruta}`
  }

  // Filtrar solo imágenes válidas
  const imagenesValidas = product.imagenes.filter(img => {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
    return img.rutaArchivo && extensionesValidas.some(ext => img.rutaArchivo.toLowerCase().endsWith(ext))
  })

  // Obtener peso principal y alternativo
  const pesoPrincipal = product.pesos.find(p => p.esPrincipal) || product.pesos[0]
  const pesoAlternativo = product.pesos.find(p => !p.esPrincipal)

  // DEBUG: Ver datos recibidos de FileMaker
  console.log('[MountainProductCardWithModal] Producto:', product.nombre)
  console.log('[MountainProductCardWithModal] Variantes:', product.variantes.map(v => ({
    id: v.id,
    colorId: v.colorId,
    colorIdTipo: typeof v.colorId,
    colorInfo: v.colorInfo?.nombre
  })))
  console.log('[MountainProductCardWithModal] Imágenes:', imagenesValidas.map(img => ({
    tipo: img.tipoImagen,
    colorId: img.colorId,
    colorIdTipo: typeof img.colorId,
    ruta: img.rutaArchivo
  })))

  // Transformar datos de BD al formato del componente
  const cardProduct = {
    id: product.id.toString(),
    name: product.nombre,
    nameSvgPath: product.nombreSvgRuta ? normalizarRuta(product.nombreSvgRuta) : undefined,
    subtitle: product.subtitulo,
    weight: `${pesoPrincipal?.peso || 0} gr`,
    alternativeWeight: pesoAlternativo ? `${pesoAlternativo.peso} gr` : undefined,
    mainImage: normalizarRuta(
      imagenesValidas.find(img => img.esPrincipal || img.tipoImagen === 'principal')?.rutaArchivo || 
      imagenesValidas[0]?.rutaArchivo
    ),
    detailImages: imagenesValidas.map(img => normalizarRuta(img.rutaArchivo)),
    historyImages: imagenesValidas
      .filter(img => img.tipoImagen === 'historia')
      .map(img => normalizarRuta(img.rutaArchivo)),
    historyDescription: product.descripcionHistoria,
    variants: product.variantes.map(v => {
      // Buscar imagen principal para este color
      const imagenColor = imagenesValidas.find(img => 
        img.colorId === v.colorId && img.tipoImagen === 'principal'
      )
      
      // Buscar imágenes de galería para este color
      const galeriaColor = imagenesValidas
        .filter(img => {
          const match = img.colorId === v.colorId && img.tipoImagen === 'galeria'
          // DEBUG: Ver comparación detallada
          if (img.tipoImagen === 'galeria') {
            console.log(`  [Filtro Galería] Imagen ColorId: ${img.colorId} (${typeof img.colorId}) vs Variante ColorId: ${v.colorId} (${typeof v.colorId}) = ${match}`)
          }
          return match
        })
        .sort((a, b) => a.orden - b.orden)
        .map(img => normalizarRuta(img.rutaArchivo))
      
      // DEBUG: Ver imágenes por variante
      console.log(`[Variante] Color: ${v.colorInfo?.nombre || v.color}, ColorId: ${v.colorId}`)
      console.log('  - Imagen principal:', imagenColor?.rutaArchivo || 'NO ENCONTRADA')
      console.log('  - Galería:', galeriaColor.length, 'imágenes')
      console.log('  - Rutas galería:', galeriaColor)
      
      return {
        id: v.colorId ? String(v.colorId) : String(v.id),  // Usar ColorId como fallback
        color: v.codigoHex,
        colorId: v.colorId,
        colorLogo: v.colorInfo?.rutaLogo || null,
        colorName: v.colorInfo?.nombre || v.color,
        available: v.disponible && v.stock > 0,
        imagenPrincipal: imagenColor ? normalizarRuta(imagenColor.rutaArchivo) : null,
        galeriaImagenes: galeriaColor
      }
    }),
    sizes: product.potencias.map(p => ({
      id: p.id.toString(),
      value: p.potencia,
      available: p.disponible && p.stock > 0
    })),
    price: product.precio,
    inStock: product.stock > 0,
    description: product.descripcion,
    specifications: {
      width: product.potencias.map(p => p.width).filter(Boolean).join(', ') || '',
      rise: product.potencias.map(p => p.rise).filter(Boolean).join(', ') || '',
      backsweep: product.especificaciones.backsweep || '',
      upsweep: product.especificaciones.upsweep || '',
      clampDiameter: product.especificaciones.clampDiameter || ''
    }
  }

  return <MountainProductCard product={cardProduct} />
}