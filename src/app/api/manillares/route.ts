import { NextRequest, NextResponse } from 'next/server'
import { getDbConnection, sql } from '@/lib/database'
import { ProductoConImagenes, FiltrosProductos, ParametrosPaginacion, RespuestaPaginada, RespuestaAPI } from '@/types/database'

/**
 * GET /api/manillares
 * Lista manillares con filtros y paginación.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Lectura de query params
    const { searchParams } = new URL(request.url)
    
    // Normalización de filtros
    const filtros: FiltrosProductos = {
      tipoProducto: 'Manillares', // Forzar tipo manillares
      soloActivos: searchParams.get('activos') !== 'false',
      soloDestacados: searchParams.get('destacados') === 'true' || undefined,
      soloNovedades: searchParams.get('novedades') === 'true' || undefined,
      soloOfertas: searchParams.get('ofertas') === 'true' || undefined,
      precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
      precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
      colores: searchParams.get('colores')?.split(',') || undefined,
      materiales: searchParams.get('materiales')?.split(',') || undefined,
      pesoMin: searchParams.get('pesoMin') ? Number(searchParams.get('pesoMin')) : undefined,
      pesoMax: searchParams.get('pesoMax') ? Number(searchParams.get('pesoMax')) : undefined,
    }

    // Paginación y orden
    const paginacion: ParametrosPaginacion = {
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanoPagina: Number(searchParams.get('tamanoPagina')) || 12,
      ordenarPor: (searchParams.get('ordenarPor') as any) || 'nombre',
      orden: (searchParams.get('orden') as 'asc' | 'desc') || 'asc'
    }

    // Conexión a la base de datos
    const pool = await getDbConnection()

    // Construcción dinámica del WHERE
    let whereConditions: string[] = []
    let queryParams: Record<string, any> = {}

    // Filtro base: solo manillares activos
    whereConditions.push('p.TipoProducto = @tipoProducto')
    queryParams.tipoProducto = 'Manillares'
    
    if (filtros.soloActivos) {
      whereConditions.push('p.Activo = @activo')
      queryParams.activo = 1
    }

    // Filtros booleanos adicionales
    if (filtros.soloDestacados) {
      whereConditions.push('p.Destacado = @destacado')
      queryParams.destacado = 1
    }

    if (filtros.soloNovedades) {
      whereConditions.push('p.Novedad = @novedad')
      queryParams.novedad = 1
    }

    if (filtros.soloOfertas) {
      whereConditions.push('p.EnOferta = @enOferta')
      queryParams.enOferta = 1
    }

    // Rangos de precio
    if (filtros.precioMin) {
      whereConditions.push('p.Precio >= @precioMin')
      queryParams.precioMin = filtros.precioMin
    }

    if (filtros.precioMax) {
      whereConditions.push('p.Precio <= @precioMax')
      queryParams.precioMax = filtros.precioMax
    }

    // Rangos de peso específicos para manillares
    if (filtros.pesoMin) {
      whereConditions.push('p.Peso >= @pesoMin')
      queryParams.pesoMin = filtros.pesoMin
    }

    if (filtros.pesoMax) {
      whereConditions.push('p.Peso <= @pesoMax')
      queryParams.pesoMax = filtros.pesoMax
    }

    // Filtros de lista (IN)
    if (filtros.colores && filtros.colores.length > 0) {
      const colorPlaceholders = filtros.colores.map((_, index) => `@color${index}`).join(',')
      whereConditions.push(`p.Color IN (${colorPlaceholders})`)
      filtros.colores.forEach((color, index) => {
        queryParams[`color${index}`] = color
      })
    }

    if (filtros.materiales && filtros.materiales.length > 0) {
      const materialPlaceholders = filtros.materiales.map((_, index) => `@material${index}`).join(',')
      whereConditions.push(`p.Material IN (${materialPlaceholders})`)
      filtros.materiales.forEach((material, index) => {
        queryParams[`material${index}`] = material
      })
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

    // Ordenación y paginación SQL
    const orderByMap: { [key: string]: string } = {
      'nombre': 'p.Nombre',
      'precio': 'p.Precio',
      'fecha': 'p.FechaCreacion',
      'stock': 'p.Stock'
    }
    const orderByField = orderByMap[paginacion.ordenarPor!] || 'p.Nombre'
    const orderDirection = paginacion.orden?.toUpperCase() || 'ASC'
    const offset = ((paginacion.pagina!) - 1) * paginacion.tamanoPagina!

    // Consulta de cuenta total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Productos p
      ${whereClause}
    `
    const countRequest = pool.request()
    Object.keys(queryParams).forEach(key => {
      countRequest.input(key, queryParams[key])
    })
    const countResult = await countRequest.query(countQuery)
    const totalRegistros = countResult.recordset[0].total

    // Consulta principal (datos paginados)
    const mainQuery = `
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
        p.UsuarioCreacion,
        p.UsuarioModificacion,
        p.SlugUrl,
        p.MetaDescripcion,
        -- Específicos Manillares
        p.Material,
        p.Peso,
        p.Ancho,
        p.Diametro,
        p.Rise,
        p.Backsweep,
        p.Upsweep
      FROM Productos p
      ${whereClause}
      ORDER BY ${orderByField} ${orderDirection}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `

    queryParams.offset = offset
    queryParams.limit = paginacion.tamanoPagina

    const mainRequest = pool.request()
    Object.keys(queryParams).forEach(key => {
      mainRequest.input(key, queryParams[key])
    })

    const result = await mainRequest.query(mainQuery)
    
    // Mapeado a DTO (ProductoConImagenes)
    const productos: ProductoConImagenes[] = result.recordset.map((row: any) => {
      return {
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
        UsuarioCreacion: row.UsuarioCreacion,
        UsuarioModificacion: row.UsuarioModificacion,
        SlugUrl: row.SlugUrl,
        MetaDescripcion: row.MetaDescripcion,
        // Campos específicos de manillares
        Material: row.Material,
        Peso: row.Peso,
        Ancho: row.Ancho,
        Diametro: row.Diametro,
        Rise: row.Rise,
        Backsweep: row.Backsweep,
        Upsweep: row.Upsweep,
        // Imágenes (se podrían cargar en una consulta separada si es necesario)
        imagenes: [],
        imagenPrincipal: undefined
      } as ProductoConImagenes
    })
    
    // Respuesta paginada
    const totalPaginas = Math.ceil(totalRegistros / paginacion.tamanoPagina!)

    const respuesta: RespuestaPaginada<ProductoConImagenes> = {
      datos: productos,
      paginaActual: paginacion.pagina!,
      totalPaginas,
      totalRegistros,
      tamanoPagina: paginacion.tamanoPagina!
    }

    const apiResponse: RespuestaAPI<RespuestaPaginada<ProductoConImagenes>> = {
      success: true,
      data: respuesta,
      message: `Se encontraron ${productos.length} manillares`
    }
        
    return NextResponse.json(apiResponse)

  } catch (error) {
    const duration = Date.now() - startTime

    const errorResponse: RespuestaAPI = {
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      message: 'No se pudieron obtener los manillares'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}