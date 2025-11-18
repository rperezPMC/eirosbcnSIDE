// Servicio de productos Mountain usando FileMaker Data API

import { fileMakerClient } from '../filemaker'
import type {
  FileMakerBikeComponent,
  FileMakerTraduccion,
  FileMakerVariante,
  FileMakerPeso,
  FileMakerPotencia,
  FileMakerImagen,
  FileMakerEspecificacion,
  FileMakerColor
} from '../filemaker/types'

// Interfaz del producto Mountain completo
export interface MountainProduct {
  id: number
  nombre: string
  nombreSvgRuta?: string
  subtitulo: string
  descripcion: string
  descripcionHistoria: string
  precio: number
  stock: number
  variantes: Array<{
    id: number
    color: string
    codigoHex: string
    colorId: number | null
    colorInfo: {
      id: number
      nombre: string
      rutaLogo: string
      codigoHex: string
    } | null
    stock: number
    disponible: boolean
    orden: number
  }>
  pesos: Array<{
    id: number
    peso: number
    stock: number
    disponible: boolean
    esPrincipal: boolean
    orden: number
  }>
  potencias: Array<{
    id: number
    potencia: string
    width: string
    rise: string
    stock: number
    disponible: boolean
    orden: number
  }>
  imagenes: Array<{
    id: number
    rutaArchivo: string
    tipoImagen: string
    varianteId: number | null
    colorId: number | null
    esPrincipal: boolean
    orden: number
  }>
  especificaciones: {
    backsweep?: string
    upsweep?: string
    clampDiameter?: string
    material?: string
    construction?: string
    autoclave?: boolean
    informacion?: string
  }
}

// Obtener productos mountain con traducciones y relaciones
export async function obtenerProductosMountain(
  locale: string = 'es'
): Promise<MountainProduct[]> {
  try {
    console.log(`[MountainService] Obteniendo productos para idioma: ${locale}`)

    // Paso 1: Obtener ID del idioma
    const idiomas = await fileMakerClient.findRecords<{ Id: number; Codigo: string }>(
      'Idiomas',
      [{ Codigo: locale, Activo: "1" }]
    )

    if (idiomas.records.length === 0) {
      throw new Error(`Idioma no encontrado: ${locale}`)
    }

    const idiomaId = idiomas.records[0].Id

    // Paso 2: Obtener categoría mountain
    const categorias = await fileMakerClient.findRecords<{ Id: number; Codigo: string }>(
      'Categorias',
      [{ Codigo: "mountain", Activo: "1" }]
    )

    if (categorias.records.length === 0) {
      throw new Error('Categoría mountain no encontrada')
    }

    const categoriaId = categorias.records[0].Id
    console.log(`[MountainService] 🔍 CategoriaId obtenido:`, categoriaId, `(tipo: ${typeof categoriaId})`)

    // DEBUG: Ver TODOS los productos sin filtro
    const todosProductos = await fileMakerClient.findRecords<FileMakerBikeComponent>(
      'BikeComponents',
      [{ Activo: "1" }]
    )
    console.log(`[MountainService] 👁️ TODOS los productos activos (${todosProductos.records.length}):`, 
      todosProductos.records.map(p => ({
        Id: p.Id,
        Nombre: p.Nombre,
        CategoriaId: p.CategoriaId,
        CategoriaIdValor: JSON.stringify(p.CategoriaId),
        EsNumero: !isNaN(Number(p.CategoriaId)),
        Activo: p.Activo
      }))
    )

    // Paso 3: Obtener productos de la categoría mountain activos
    console.log(`[MountainService] 🔍 Buscando con query:`, { CategoriaId: String(categoriaId), Activo: "1" })
    
    const productosResult = await fileMakerClient.findRecords<FileMakerBikeComponent>(
      'BikeComponents',
      [{ CategoriaId: String(categoriaId), Activo: "1" }],
      {
        sort: [{ fieldName: 'Nombre', sortOrder: 'ascend' }]
      }
    )

    console.log(`[MountainService] ✅ Productos encontrados: ${productosResult.records.length}`)
    console.log(`[MountainService] 📋 Productos:`, productosResult.records.map(p => ({
      Id: p.Id,
      Nombre: p.Nombre,
      CategoriaId: p.CategoriaId,
      CategoriaIdTipo: typeof p.CategoriaId,
      Activo: p.Activo
    })))

    const productos: MountainProduct[] = []

    // Paso 4: Para cada producto, obtener datos relacionados
    for (const producto of productosResult.records) {
      console.log(`[MountainService] Procesando producto ID: ${producto.Id}`)

      // Variables para datos relacionados
      let traduccion: FileMakerTraduccion | undefined
      let variantesResult: Awaited<ReturnType<typeof fileMakerClient.findRecords<FileMakerVariante>>>

      try {
        // Obtener traducción
        console.log(`[MountainService] 🔍 Buscando traducción para producto ${producto.Id}, idioma ${idiomaId}`)
        
        // PRIMERO: Ver TODAS las traducciones de este producto sin filtro
        const todasTraduccionesProducto = await fileMakerClient.findRecords<FileMakerTraduccion>(
          'BikeComponentsTraduccion',
          [{ ProductoId: String(producto.Id) }]
        )
        console.log(`[MountainService] 👁️ TODAS las traducciones del producto ${producto.Id}:`,
          todasTraduccionesProducto.records.map(t => ({
            IdiomaId: t.IdiomaId,
            IdiomaIdTipo: typeof t.IdiomaId,
            IdiomaIdValor: JSON.stringify(t.IdiomaId),
            Nombre: t.Nombre
          }))
        )
        
        const traduccionesResult = await fileMakerClient.findRecords<FileMakerTraduccion>(
          'BikeComponentsTraduccion',
          [{ ProductoId: String(producto.Id), IdiomaId: String(idiomaId) }]
        )
        traduccion = traduccionesResult.records[0]
        console.log(`[MountainService] ✅ Traducción encontrada:`, traduccion ? 'Sí' : 'No')
      } catch (error) {
        console.error(`[MountainService] ❌ Error obteniendo traducción para producto ${producto.Id}:`, error)
        throw error
      }

      try {
        // Obtener variantes
        console.log(`[MountainService] 🔍 Buscando variantes para producto ${producto.Id}`)
        variantesResult = await fileMakerClient.findRecords<FileMakerVariante>(
          'BikeComponentsVariantes',
          [{ ProductoId: String(producto.Id) }],
          { sort: [{ fieldName: 'Orden', sortOrder: 'ascend' }] }
        )
        console.log(`[MountainService] ✅ Variantes encontradas: ${variantesResult.records.length}`)
        // DEBUG: Ver ColorId de las variantes
        console.log('[MountainService] ColorIds en variantes:', variantesResult.records.map(v => ({
          id: v.Id,
          color: v.Color,
          colorId: v.ColorId,
          colorIdTipo: typeof v.ColorId,
          colorIdValor: JSON.stringify(v.ColorId)
        })))
      } catch (error) {
        console.error(`[MountainService] ❌ Error obteniendo variantes para producto ${producto.Id}:`, error)
        throw error
      }

      // Obtener colores para las variantes
      const coloresMap = new Map<number, FileMakerColor>()
      for (const variante of variantesResult.records) {
        if (variante.ColorId) {
          try {
            console.log(`[MountainService] 🎨 Buscando color ${variante.ColorId} para variante ${variante.Id}`)
            const colorResult = await fileMakerClient.findRecords<FileMakerColor>(
              'Colores',
              [{ Id: String(variante.ColorId) }]
            )
            if (colorResult.records.length > 0) {
              coloresMap.set(variante.ColorId, colorResult.records[0])
              console.log(`[MountainService] ✅ Color encontrado: ${colorResult.records[0].Nombre}`)
            }
          } catch (error) {
            console.error(`[MountainService] ❌ Error obteniendo color ${variante.ColorId}:`, error)
            throw error
          }
        }
      }

      // Variables para datos relacionados
      let pesosResult: Awaited<ReturnType<typeof fileMakerClient.findRecords<FileMakerPeso>>>
      let potenciasResult: Awaited<ReturnType<typeof fileMakerClient.findRecords<FileMakerPotencia>>>
      let imagenesResult: Awaited<ReturnType<typeof fileMakerClient.findRecords<FileMakerImagen>>>
      let especificacionesResult: Awaited<ReturnType<typeof fileMakerClient.findRecords<FileMakerEspecificacion>>>
      let especificacion: FileMakerEspecificacion = {}

      // Obtener pesos
      try {
        console.log(`[MountainService] ⚖️ Buscando pesos para producto ${producto.Id}`)
        pesosResult = await fileMakerClient.findRecords<FileMakerPeso>(
          'BikeComponentsPesos',
          [{ ProductoId: String(producto.Id) }],
          { sort: [{ fieldName: 'Orden', sortOrder: 'ascend' }] }
        )
        console.log(`[MountainService] ✅ Pesos encontrados: ${pesosResult.records.length}`)
      } catch (error) {
        console.warn(`[MountainService] ⚠️ No se encontraron pesos para producto ${producto.Id}, usando array vacío`)
        pesosResult = { records: [] } as any
      }

      // Obtener potencias
      try {
        console.log(`[MountainService] 🔧 Buscando potencias para producto ${producto.Id}`)
        potenciasResult = await fileMakerClient.findRecords<FileMakerPotencia>(
          'BikeComponentsPotencia',
          [{ ProductoId: String(producto.Id) }],
          { sort: [{ fieldName: 'Orden', sortOrder: 'ascend' }] }
        )
        console.log(`[MountainService] ✅ Potencias encontradas: ${potenciasResult.records.length}`)
      } catch (error) {
        console.warn(`[MountainService] ⚠️ No se encontraron potencias para producto ${producto.Id}, usando array vacío`)
        potenciasResult = { records: [] } as any
      }

      // Obtener imágenes
      try {
        console.log(`[MountainService] 🖼️ Buscando imágenes para producto ${producto.Id}`)
        imagenesResult = await fileMakerClient.findRecords<FileMakerImagen>(
          'BikeComponentsImagenes',
          [{ ProductoId: String(producto.Id), Activa: "1" }],
          { sort: [{ fieldName: 'Orden', sortOrder: 'ascend' }] }
        )
        console.log(`[MountainService] ✅ Imágenes encontradas: ${imagenesResult.records.length}`)
        // DEBUG: Ver ColorId de las imágenes
        console.log('[MountainService] ColorIds en imágenes:', imagenesResult.records.map(i => ({
          id: i.Id,
          tipo: i.TipoImagen,
          colorId: i.ColorId,
          colorIdTipo: typeof i.ColorId,
          colorIdValor: JSON.stringify(i.ColorId)
        })))
      } catch (error) {
        console.warn(`[MountainService] ⚠️ No se encontraron imágenes para producto ${producto.Id}, usando array vacío`)
        imagenesResult = { records: [] } as any
      }

      // Obtener especificaciones
      try {
        console.log(`[MountainService] 📝 Buscando especificaciones para producto ${producto.Id}`)
        especificacionesResult = await fileMakerClient.findRecords<FileMakerEspecificacion>(
          'BikeComponentsEspecificaciones',
          [{ ProductoId: String(producto.Id) }]
        )
        especificacion = especificacionesResult.records[0] || {}
        console.log(`[MountainService] ✅ Especificaciones encontradas: ${especificacionesResult.records.length}`)
      } catch (error) {
        console.warn(`[MountainService] ⚠️ No se encontraron especificaciones para producto ${producto.Id}, usando objeto vacío`)
        especificacion = {}
      }

      // Construir objeto producto completo
      productos.push({
        id: producto.Id,
        nombre: traduccion?.Nombre || producto.Nombre,
        nombreSvgRuta: producto.NombreSvgRuta || undefined,
        subtitulo: traduccion?.DescripcionCorta || producto.DescripcionCorta || producto.Slogan || '',
        descripcion: traduccion?.Descripcion || producto.Descripcion || '',
        descripcionHistoria: traduccion?.DescripcionHistoria || producto.DescripcionHistoria || '',
        precio: producto.Precio,
        stock: producto.Stock,
        variantes: variantesResult.records.map(v => {
          const colorInfo = v.ColorId ? coloresMap.get(v.ColorId) : null
          return {
            id: v.Id,
            color: v.Color,
            codigoHex: v.CodigoHex,
            colorId: v.ColorId || null,
            colorInfo: colorInfo ? {
              id: colorInfo.Id,
              nombre: colorInfo.Nombre,
              rutaLogo: colorInfo.RutaLogo,
              codigoHex: colorInfo.CodigoHex
            } : null,
            stock: v.Stock,
            disponible: v.Disponible === 1,
            orden: v.Orden
          }
        }),
        pesos: pesosResult.records.map(p => ({
          id: p.Id,
          peso: p.Peso,
          stock: p.Stock,
          disponible: p.Disponible === 1,
          esPrincipal: p.EsPrincipal === 1,
          orden: p.Orden
        })),
        potencias: potenciasResult.records.map(t => ({
          id: t.Id,
          potencia: t.Potencia,
          width: t.Width || '',
          rise: t.Rise || '',
          stock: t.Stock,
          disponible: t.Disponible === 1,
          orden: t.Orden
        })),
        imagenes: imagenesResult.records.map(i => ({
          id: i.Id,
          rutaArchivo: i.RutaArchivo,
          tipoImagen: i.TipoImagen,
          varianteId: i.VarianteId || null,
          colorId: i.ColorId || null,
          esPrincipal: i.EsPrincipal === 1,
          orden: i.Orden
        })),
        especificaciones: {
          backsweep: especificacion.Backsweep,
          upsweep: especificacion.Upsweep,
          clampDiameter: especificacion.ClampDiameter,
          material: especificacion.Material,
          construction: especificacion.Construction,
          autoclave: especificacion.Autoclave === 1,
          informacion: especificacion.Informacion
        }
      })
    }

    console.log(`[MountainService] Total productos procesados: ${productos.length}`)
    return productos

  } catch (error) {
    console.error('[MountainService] Error obteniendo productos:', error)
    throw error
  }
}

// Obtener un producto específico por ID
export async function obtenerProductoMountainPorId(
  id: number,
  locale: string = 'es'
): Promise<MountainProduct | null> {
  try {
    const productos = await obtenerProductosMountain(locale)
    return productos.find(p => p.id === id) || null
  } catch (error) {
    console.error('[MountainService] Error obteniendo producto por ID:', error)
    return null
  }
}
