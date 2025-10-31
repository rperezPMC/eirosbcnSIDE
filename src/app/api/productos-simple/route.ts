import { NextRequest, NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url)
    
    // Parámetros principales
    const tipoProducto = searchParams.get('tipo') || searchParams.get('TipoProducto') || 'Manillares'
    const destacado = searchParams.get('destacados') === 'true' || searchParams.get('Destacado') === 'true'
    const novedades = searchParams.get('novedades') === 'true'
    const ofertas = searchParams.get('ofertas') === 'true'
    const activos = searchParams.get('activos') !== 'false' // Por defecto true
    
    // Parámetros de paginación
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const tamanoPagina = parseInt(searchParams.get('tamanoPagina') || '12')
    const ordenarPor = searchParams.get('ordenarPor') || 'nombre'
    const orden = searchParams.get('orden') || 'asc'
    
    // Parámetros de filtros
    const precioMin = searchParams.get('precioMin') ? parseFloat(searchParams.get('precioMin')!) : undefined
    const precioMax = searchParams.get('precioMax') ? parseFloat(searchParams.get('precioMax')!) : undefined
    const colores = searchParams.get('colores')?.split(',').filter(Boolean) || []
    const materiales = searchParams.get('materiales')?.split(',').filter(Boolean) || []
    
    const pool = await getDbConnection()
    
    // ===== CONSTRUCCIÓN DINÁMICA DE CONSULTA =====
    let whereConditions = []
    let queryParams: any = {}
    
    // Filtro base: tipo de producto
    whereConditions.push('p.TipoProducto = @tipoProducto')
    queryParams.tipoProducto = tipoProducto
    
    // Filtro activos
    if (activos) {
      whereConditions.push('p.Activo = @activo')
      queryParams.activo = 1
    }
    
    // Filtros booleanos
    if (destacado) {
      whereConditions.push('p.Destacado = @destacado')
      queryParams.destacado = 1
    }
    
    if (novedades) {
      whereConditions.push('p.Novedad = @novedad')
      queryParams.novedad = 1
    }
    
    if (ofertas) {
      whereConditions.push('p.EnOferta = @enOferta')
      queryParams.enOferta = 1
    }
    
    // Filtros de precio
    if (precioMin !== undefined) {
      whereConditions.push('p.Precio >= @precioMin')
      queryParams.precioMin = precioMin
    }
    
    if (precioMax !== undefined) {
      whereConditions.push('p.Precio <= @precioMax')
      queryParams.precioMax = precioMax
    }
    
    // Filtros de lista
    if (colores.length > 0) {
      const colorConditions = colores.map((_, index) => `@color${index}`).join(',')
      whereConditions.push(`p.Color IN (${colorConditions})`)
      colores.forEach((color, index) => {
        queryParams[`color${index}`] = color.trim()
      })
    }
    
    if (materiales.length > 0) {
      const materialConditions = materiales.map((_, index) => `@material${index}`).join(',')
      whereConditions.push(`p.Material IN (${materialConditions})`)
      materiales.forEach((material, index) => {
        queryParams[`material${index}`] = material.trim()
      })
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''
    
    // ===== ORDENACIÓN =====
    const orderByMap: { [key: string]: string } = {
      'nombre': 'p.Nombre',
      'precio': 'p.Precio', 
      'fecha': 'p.FechaCreacion',
      'stock': 'p.Stock'
    }
    const orderByField = orderByMap[ordenarPor] || 'p.Nombre'
    const orderDirection = orden.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    
    // ===== PAGINACIÓN =====
    const offset = (pagina - 1) * tamanoPagina
    
    // ===== CONSULTA COUNT TOTAL =====
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
    const totalPaginas = Math.ceil(totalRegistros / tamanoPagina)
    
    // ===== CONSULTA PRODUCTOS CON IMÁGENES =====
    const mainQuery = `
      SELECT 
        p.Id,
        p.Nombre,
        p.Descripcion,
        p.Precio,
        p.Material,
        p.Peso,
        p.Color,
        p.Stock,
        p.Destacado,
        p.Novedad,
        p.EnOferta,
        p.PorcentajeDescuento,
        p.TipoProducto,
        p.Ancho,
        p.Diametro,
        p.Rise,
        p.Backsweep,
        p.Upsweep,
        p.SKU,
        p.Activo,
        p.FechaCreacion,
        p.FechaModificacion,
        -- Campos específicos textil
        p.Talla,
        p.Textil,
        p.Composicion,
        p.GramajeTela,
        p.TipoTejido,
        p.TallaMinima,
        p.TallaMaxima,
        p.Genero,
        p.Temporada,
        -- Imagen principal
        img.RutaCompleta as ImagenPrincipal,
        img.RutaThumbnail as ThumbnailPrincipal,
        img.AltText as AltTextPrincipal,
        img.NombreArchivo as NombreArchivoPrincipal
      FROM Productos p
      LEFT JOIN ImagenesProductos img ON (
        p.Id = img.CodigoProducto 
        AND img.TipoProducto = p.TipoProducto 
        AND img.EsPrincipal = 1 
        AND img.Activa = 1
      )
      ${whereClause}
      ORDER BY ${orderByField} ${orderDirection}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
    
    // Añadir parámetros de paginación
    queryParams.offset = offset
    queryParams.limit = tamanoPagina
    
    const mainRequest = pool.request()
    Object.keys(queryParams).forEach(key => {
      mainRequest.input(key, queryParams[key])
    })
    
    const result = await mainRequest.query(mainQuery)
    
    // ===== MAPEAR PRODUCTOS CON IMÁGENES =====
    const productosConImagenes = result.recordset.map((row: any) => {
      const productoBase = {
        Id: row.Id,
        TipoProducto: row.TipoProducto,
        Nombre: row.Nombre,
        Descripcion: row.Descripcion,
        Precio: row.Precio,
        Color: row.Color,
        Stock: row.Stock,
        Destacado: row.Destacado,
        Novedad: row.Novedad,
        EnOferta: row.EnOferta,
        PorcentajeDescuento: row.PorcentajeDescuento,
        SKU: row.SKU,
        Activo: row.Activo,
        FechaCreacion: row.FechaCreacion,
        FechaModificacion: row.FechaModificacion,
        // Sistema de imágenes
        imagenes: [],
        imagenPrincipal: row.ImagenPrincipal ? {
          Id: 0,
          TipoProducto: row.TipoProducto,
          CodigoProducto: row.Id,
          NombreArchivo: row.NombreArchivoPrincipal || '',
          RutaCompleta: row.ImagenPrincipal,
          RutaThumbnail: row.ThumbnailPrincipal,
          TipoImagen: 'producto',
          AltText: row.AltTextPrincipal,
          EsPrincipal: true,
          Orden: 1,
          Activa: true,
          FechaSubida: new Date()
        } : undefined
      }
      
      // Campos específicos según tipo
      if (row.TipoProducto === 'Manillares') {
        return {
          ...productoBase,
          Material: row.Material,
          Peso: row.Peso,
          Ancho: row.Ancho,
          Diametro: row.Diametro,
          Rise: row.Rise,
          Backsweep: row.Backsweep,
          Upsweep: row.Upsweep,
        }
      } else {
        return {
          ...productoBase,
          Talla: row.Talla,
          Textil: row.Textil,
          Composicion: row.Composicion,
          GramajeTela: row.GramajeTela,
          TipoTejido: row.TipoTejido,
          TallaMinima: row.TallaMinima,
          TallaMaxima: row.TallaMaxima,
          Genero: row.Genero,
          Temporada: row.Temporada,
        }
      }
    })
    
    // ===== RESPUESTA CON FORMATO COMPATIBLE =====
    const respuestaPaginada = {
      datos: productosConImagenes,
      paginaActual: pagina,
      totalPaginas,
      totalRegistros,
      tamanoPagina
    }
    
    const apiResponse = {
      success: true,
      data: respuestaPaginada,
      message: `Se encontraron ${productosConImagenes.length} productos`,
      // Debug info
      debug: {
        endpoint: '/api/productos-simple',
        tablaImagenesUsada: true,
        productosSinImagen: productosConImagenes.filter(p => !p.imagenPrincipal?.RutaCompleta).length,
        productosConImagen: productosConImagenes.filter(p => p.imagenPrincipal?.RutaCompleta).length,
        filtrosAplicados: whereConditions.length
      }
    }
    
    return NextResponse.json(apiResponse)
    
  } catch (error) {
    console.error('❌ [API] Error en productos-simple:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'No se pudieron obtener los productos'
    }, { status: 500 })
  }
}
