import { getDbConnection, sql } from '@/lib/database'
import {
  BikeComponent,
  BikeComponentConImagenes,
  GearUpProduct,
  GearUpProductConImagenes,
  FiltrosBikeComponents,
  FiltrosGearUp,
  ImagenProducto
} from '@/types/database-v2'

// =============================================
// BIKECOMPONENTS - Servicios
// =============================================

export async function obtenerBikeComponents(
  filtros: FiltrosBikeComponents = {}
): Promise<BikeComponentConImagenes[]> {
  try {
    const pool = await getDbConnection()

    // Construcción dinámica del WHERE
    const whereConditions: string[] = []
    const queryParams: Record<string, any> = {}

    if (filtros.categoria) {
      whereConditions.push('bc.Categoria = @categoria')
      queryParams.categoria = filtros.categoria
    }

    if (filtros.subcategoria) {
      whereConditions.push('bc.Subcategoria = @subcategoria')
      queryParams.subcategoria = filtros.subcategoria
    }

    if (filtros.soloActivos !== false) {
      whereConditions.push('bc.Activo = @activo')
      queryParams.activo = 1
    }

    if (filtros.soloDestacados) {
      whereConditions.push('bc.Destacado = @destacado')
      queryParams.destacado = 1
    }

    if (filtros.soloNovedades) {
      whereConditions.push('bc.Novedad = @novedad')
      queryParams.novedad = 1
    }

    if (filtros.soloOfertas) {
      whereConditions.push('bc.EnOferta = @enOferta')
      queryParams.enOferta = 1
    }

    if (filtros.precioMin) {
      whereConditions.push('bc.Precio >= @precioMin')
      queryParams.precioMin = filtros.precioMin
    }

    if (filtros.precioMax) {
      whereConditions.push('bc.Precio <= @precioMax')
      queryParams.precioMax = filtros.precioMax
    }

    if (filtros.pesoMin) {
      whereConditions.push('bc.Peso >= @pesoMin')
      queryParams.pesoMin = filtros.pesoMin
    }

    if (filtros.pesoMax) {
      whereConditions.push('bc.Peso <= @pesoMax')
      queryParams.pesoMax = filtros.pesoMax
    }

    if (filtros.colores && filtros.colores.length > 0) {
      const colorPlaceholders = filtros.colores.map((_, i) => `@color${i}`).join(',')
      whereConditions.push(`bc.Color IN (${colorPlaceholders})`)
      filtros.colores.forEach((color, i) => {
        queryParams[`color${i}`] = color
      })
    }

    if (filtros.materiales && filtros.materiales.length > 0) {
      const materialPlaceholders = filtros.materiales.map((_, i) => `@material${i}`).join(',')
      whereConditions.push(`bc.Material IN (${materialPlaceholders})`)
      filtros.materiales.forEach((material, i) => {
        queryParams[`material${i}`] = material
      })
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    // Query principal
    const query = `
      SELECT 
        bc.*
      FROM BikeComponents bc
      ${whereClause}
      ORDER BY bc.Nombre ASC
    `

    const request = pool.request()
    Object.keys(queryParams).forEach(key => {
      request.input(key, queryParams[key])
    })

    const result = await request.query(query)

    // Mapear resultados
    const componentes: BikeComponentConImagenes[] = await Promise.all(
      result.recordset.map(async (row: any) => {
        const imagenes = await obtenerImagenesProducto(row.Id, 'BikeComponents')
        
        return {
          ...row,
          Activo: Boolean(row.Activo),
          Destacado: Boolean(row.Destacado),
          Novedad: Boolean(row.Novedad),
          EnOferta: Boolean(row.EnOferta),
          imagenes,
          imagenPrincipal: imagenes.find(img => img.EsPrincipal)
        }
      })
    )

    return componentes

  } catch (error) {
    console.error('Error obteniendo BikeComponents:', error)
    throw error
  }
}

// =============================================
// GEARUP - Servicios
// =============================================

export async function obtenerGearUpProducts(
  filtros: FiltrosGearUp = {}
): Promise<GearUpProductConImagenes[]> {
  try {
    const pool = await getDbConnection()

    // Construcción dinámica del WHERE
    const whereConditions: string[] = []
    const queryParams: Record<string, any> = {}

    if (filtros.categoria) {
      whereConditions.push('gu.Categoria = @categoria')
      queryParams.categoria = filtros.categoria
    }

    if (filtros.subcategoria) {
      whereConditions.push('gu.Subcategoria = @subcategoria')
      queryParams.subcategoria = filtros.subcategoria
    }

    if (filtros.soloActivos !== false) {
      whereConditions.push('gu.Activo = @activo')
      queryParams.activo = 1
    }

    if (filtros.soloDestacados) {
      whereConditions.push('gu.Destacado = @destacado')
      queryParams.destacado = 1
    }

    if (filtros.soloNovedades) {
      whereConditions.push('gu.Novedad = @novedad')
      queryParams.novedad = 1
    }

    if (filtros.soloOfertas) {
      whereConditions.push('gu.EnOferta = @enOferta')
      queryParams.enOferta = 1
    }

    if (filtros.precioMin) {
      whereConditions.push('gu.Precio >= @precioMin')
      queryParams.precioMin = filtros.precioMin
    }

    if (filtros.precioMax) {
      whereConditions.push('gu.Precio <= @precioMax')
      queryParams.precioMax = filtros.precioMax
    }

    if (filtros.genero) {
      whereConditions.push('gu.Genero = @genero')
      queryParams.genero = filtros.genero
    }

    if (filtros.temporada) {
      whereConditions.push('gu.Temporada = @temporada')
      queryParams.temporada = filtros.temporada
    }

    if (filtros.colores && filtros.colores.length > 0) {
      const colorPlaceholders = filtros.colores.map((_, i) => `@color${i}`).join(',')
      whereConditions.push(`gu.Color IN (${colorPlaceholders})`)
      filtros.colores.forEach((color, i) => {
        queryParams[`color${i}`] = color
      })
    }

    if (filtros.tallas && filtros.tallas.length > 0) {
      const tallaPlaceholders = filtros.tallas.map((_, i) => `@talla${i}`).join(',')
      whereConditions.push(`gu.Talla IN (${tallaPlaceholders})`)
      filtros.tallas.forEach((talla, i) => {
        queryParams[`talla${i}`] = talla
      })
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    // Query principal
    const query = `
      SELECT 
        gu.*
      FROM GearUp gu
      ${whereClause}
      ORDER BY gu.Nombre ASC
    `

    const request = pool.request()
    Object.keys(queryParams).forEach(key => {
      request.input(key, queryParams[key])
    })

    const result = await request.query(query)

    // Mapear resultados
    const productos: GearUpProductConImagenes[] = await Promise.all(
      result.recordset.map(async (row: any) => {
        const imagenes = await obtenerImagenesProducto(row.Id, 'GearUp')
        
        return {
          ...row,
          Activo: Boolean(row.Activo),
          Destacado: Boolean(row.Destacado),
          Novedad: Boolean(row.Novedad),
          EnOferta: Boolean(row.EnOferta),
          imagenes,
          imagenPrincipal: imagenes.find(img => img.EsPrincipal)
        }
      })
    )

    return productos

  } catch (error) {
    console.error('Error obteniendo GearUpProducts:', error)
    throw error
  }
}

// =============================================
// IMÁGENES - Servicios
// =============================================

async function obtenerImagenesProducto(
  productoId: number,
  tipoProducto: 'BikeComponents' | 'GearUp'
): Promise<ImagenProducto[]> {
  try {
    const pool = await getDbConnection()

    const query = `
      SELECT *
      FROM ImagenesProductos
      WHERE TipoProducto = @tipoProducto
        AND CodigoProducto = @productoId
        AND Activa = 1
      ORDER BY EsPrincipal DESC, Orden ASC
    `

    const result = await pool.request()
      .input('tipoProducto', tipoProducto)
      .input('productoId', productoId)
      .query(query)

    return result.recordset.map((row: any) => ({
      ...row,
      EsPrincipal: Boolean(row.EsPrincipal),
      Activa: Boolean(row.Activa)
    }))

  } catch (error) {
    console.error('Error obteniendo imágenes:', error)
    return []
  }
}

// =============================================
// UTILIDADES
// =============================================

export function agruparPorSubcategoria<T extends { Subcategoria: string }>(
  productos: T[]
): Record<string, T[]> {
  return productos.reduce((grupos, producto) => {
    const subcategoria = producto.Subcategoria || 'otros'
    
    if (!grupos[subcategoria]) {
      grupos[subcategoria] = []
    }
    grupos[subcategoria].push(producto)
    
    return grupos
  }, {} as Record<string, T[]>)
}

export function agruparPorCategoria<T extends { Categoria: string }>(
  productos: T[]
): Record<string, T[]> {
  return productos.reduce((grupos, producto) => {
    const categoria = producto.Categoria || 'otros'
    
    if (!grupos[categoria]) {
      grupos[categoria] = []
    }
    grupos[categoria].push(producto)
    
    return grupos
  }, {} as Record<string, T[]>)
}
