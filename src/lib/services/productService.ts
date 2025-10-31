import { getDbConnection, sql } from '@/lib/database'
import { ProductoConImagenes } from '@/types/database'

// Interfaz para filtros de productos
export interface FiltrosCategoria {
  categoria?: string // 'mountain', 'carrer', etc.
  subcategoria?: string // 'ManillarsTiges', 'Plats', etc.
  tipoProducto?: 'Manillares' | 'Textil'
  soloActivos?: boolean
}

// Obtener productos por categoria/subcategoria
export async function obtenerProductosPorCategoria(
  filtros: FiltrosCategoria
): Promise<ProductoConImagenes[]> {
  try {
    const pool = await getDbConnection()

    // Construcción dinámica del WHERE
    const whereConditions: string[] = []
    const queryParams: Record<string, any> = {}

    // Filtro por categoria
    if (filtros.categoria) {
      whereConditions.push('p.Categoria = @categoria')
      queryParams.categoria = filtros.categoria
    }

    // Filtro por subcategoria
    if (filtros.subcategoria) {
      whereConditions.push('p.Subcategoria = @subcategoria')
      queryParams.subcategoria = filtros.subcategoria
    }

    // Filtro por tipo de producto
    if (filtros.tipoProducto) {
      whereConditions.push('p.TipoProducto = @tipoProducto')
      queryParams.tipoProducto = filtros.tipoProducto
    }

    // Filtro por activos
    if (filtros.soloActivos !== false) {
      whereConditions.push('p.Activo = @activo')
      queryParams.activo = 1
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''

    // Consulta SQL
    const query = `
      SELECT 
        p.Id,
        p.TipoProducto,
        p.Nombre,
        p.Descripcion,
        p.Precio,
        p.Color,
        p.Informacion,
        p.SKU,
        p.Activo,
        p.Destacado,
        p.Novedad,
        p.EnOferta,
        p.PorcentajeDescuento,
        p.Stock,
        p.FechaCreacion,
        p.FechaModificacion,
        p.SlugUrl,
        p.MetaDescripcion,
        p.Material,
        p.Peso,
        p.Ancho,
        p.Diametro,
        p.Rise,
        p.Backsweep,
        p.Upsweep
      FROM Productos p
      ${whereClause}
      ORDER BY p.Nombre ASC
    `

    const request = pool.request()
    Object.keys(queryParams).forEach(key => {
      request.input(key, queryParams[key])
    })

    const result = await request.query(query)

    // Mapear a ProductoConImagenes
    const productos: ProductoConImagenes[] = result.recordset.map((row: any) => ({
      Id: row.Id,
      TipoProducto: row.TipoProducto,
      Nombre: row.Nombre,
      Descripcion: row.Descripcion,
      Precio: row.Precio,
      Color: row.Color,
      Informacion: row.Informacion,
      SKU: row.SKU,
      Activo: row.Activo,
      Destacado: row.Destacado,
      Novedad: row.Novedad,
      EnOferta: row.EnOferta,
      PorcentajeDescuento: row.PorcentajeDescuento,
      Stock: row.Stock,
      FechaCreacion: row.FechaCreacion,
      FechaModificacion: row.FechaModificacion,
      SlugUrl: row.SlugUrl,
      MetaDescripcion: row.MetaDescripcion,
      Material: row.Material,
      Peso: row.Peso,
      Ancho: row.Ancho,
      Diametro: row.Diametro,
      Rise: row.Rise,
      Backsweep: row.Backsweep,
      Upsweep: row.Upsweep,
      imagenes: [],
      imagenPrincipal: undefined
    }))

    return productos

  } catch (error) {
    console.error('Error obteniendo productos por categoria:', error)
    throw error
  }
}

// Agrupar productos por subcategoria
export function agruparPorSubcategoria(
  productos: ProductoConImagenes[]
): Record<string, ProductoConImagenes[]> {
  return productos.reduce((grupos, producto) => {
    // Obtener subcategoria del SKU o campo (ajustar según tu BD)
    const subcategoria = producto.SKU?.split('-')[0] || 'otros'
    
    if (!grupos[subcategoria]) {
      grupos[subcategoria] = []
    }
    grupos[subcategoria].push(producto)
    
    return grupos
  }, {} as Record<string, ProductoConImagenes[]>)
}
