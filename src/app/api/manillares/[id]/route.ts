import sql from 'mssql'
import { NextRequest, NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/database'
import { ProductoConImagenes, RespuestaAPI } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    
    if (isNaN(productId)) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'ID de producto inválido'
      }, { status: 400 })
    }

    const pool = await getDbConnection()

    // Consulta principal del producto manillar
    const productoQuery = `
      SELECT 
        Id,
        TipoProducto,
        Nombre,
        Descripcion,
        Precio,
        Color,
        Informacion,
        SKU,
        Activo,
        Material,
        Peso,
        Ancho,
        Diametro,
        Rise,
        Backsweep,
        Upsweep,
        Destacado,
        Novedad,
        EnOferta,
        PorcentajeDescuento,
        Stock,
        FechaCreacion,
        FechaModificacion,
        UsuarioCreacion,
        UsuarioModificacion,
        SlugUrl,
        MetaDescripcion
      FROM Productos 
      WHERE Id = @productId AND TipoProducto = 'Manillares' AND Activo = 1
    `

    const productoResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(productoQuery)

    if (productoResult.recordset.length === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Manillar no encontrado'
      }, { status: 404 })
    }

    const producto = productoResult.recordset[0]

    // Consulta de imágenes asociadas
    const imagenesQuery = `
      SELECT 
        Id,
        TipoProducto,
        CodigoProducto,
        NombreArchivo,
        RutaCompleta,
        RutaThumbnail,
        TipoImagen,
        AltText,
        Color,
        Talla,
        EsPrincipal,
        Orden,
        TamanoArchivo,
        AnchoPixeles,
        AltoPixeles,
        FormatoImagen,
        Activa,
        FechaSubida,
        FechaModificacion
      FROM ImagenesProductos 
      WHERE CodigoProducto = @productId AND TipoProducto = 'Manillares' AND Activa = 1
      ORDER BY EsPrincipal DESC, Orden ASC, FechaSubida ASC
    `

    const imagenesResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(imagenesQuery)

    // Construir objeto ProductoConImagenes para Manillares
    const productoCompleto: ProductoConImagenes = {
      Id: producto.Id,
      TipoProducto: producto.TipoProducto,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Precio: producto.Precio,
      Color: producto.Color,
      Informacion: producto.Informacion,
      SKU: producto.SKU,
      Activo: producto.Activo,
      Destacado: producto.Destacado,
      Novedad: producto.Novedad,
      EnOferta: producto.EnOferta,
      PorcentajeDescuento: producto.PorcentajeDescuento,
      Stock: producto.Stock,
      FechaCreacion: producto.FechaCreacion,
      FechaModificacion: producto.FechaModificacion,
      UsuarioCreacion: producto.UsuarioCreacion,
      UsuarioModificacion: producto.UsuarioModificacion,
      SlugUrl: producto.SlugUrl,
      MetaDescripcion: producto.MetaDescripcion,
      
      // Campos específicos de manillares
      Material: producto.Material,
      Peso: producto.Peso,
      Ancho: producto.Ancho,
      Diametro: producto.Diametro,
      Rise: producto.Rise,
      Backsweep: producto.Backsweep,
      Upsweep: producto.Upsweep,
      
      // Imágenes del producto
      imagenes: imagenesResult.recordset,
      imagenPrincipal: imagenesResult.recordset.find(img => img.EsPrincipal)
    }

    return NextResponse.json<RespuestaAPI<ProductoConImagenes>>({
      success: true,
      data: productoCompleto
    })

  } catch (error) {
    console.error('[API] Error obteniendo manillar individual:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Endpoint para actualizar manillar
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    
    if (isNaN(productId)) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'ID de producto inválido'
      }, { status: 400 })
    }

    const body = await request.json()
    const pool = await getDbConnection()

    // Verificar que el manillar existe
    const existeQuery = `
      SELECT Id FROM Productos 
      WHERE Id = @productId AND TipoProducto = 'Manillares'
    `
    
    const existeResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(existeQuery)

    if (existeResult.recordset.length === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Manillar no encontrado'
      }, { status: 404 })
    }

    // Construir query de actualización dinámicamente
    const camposActualizar = []
    const updateRequest = pool.request()
    updateRequest.input('productId', sql.Int, productId)
    updateRequest.input('fechaModificacion', sql.DateTime, new Date())
    updateRequest.input('usuarioModificacion', sql.VarChar(100), 'API_UPDATE')

    // Campos comunes
    if (body.Nombre) {
      camposActualizar.push('Nombre = @nombre')
      updateRequest.input('nombre', sql.VarChar(255), body.Nombre)
    }
    if (body.Descripcion) {
      camposActualizar.push('Descripcion = @descripcion')
      updateRequest.input('descripcion', sql.Text, body.Descripcion)
    }
    if (body.Precio) {
      camposActualizar.push('Precio = @precio')
      updateRequest.input('precio', sql.Decimal(10,2), body.Precio)
    }
    if (body.Color) {
      camposActualizar.push('Color = @color')
      updateRequest.input('color', sql.VarChar(50), body.Color)
    }
    if (body.Stock !== undefined) {
      camposActualizar.push('Stock = @stock')
      updateRequest.input('stock', sql.Int, body.Stock)
    }
    if (body.Destacado !== undefined) {
      camposActualizar.push('Destacado = @destacado')
      updateRequest.input('destacado', sql.Bit, body.Destacado)
    }
    if (body.EnOferta !== undefined) {
      camposActualizar.push('EnOferta = @oferta')
      updateRequest.input('oferta', sql.Bit, body.EnOferta)
    }
    
    // Campos específicos de manillares
    if (body.Material) {
      camposActualizar.push('Material = @material')
      updateRequest.input('material', sql.VarChar(100), body.Material)
    }
    if (body.Peso) {
      camposActualizar.push('Peso = @peso')
      updateRequest.input('peso', sql.Decimal(10,2), body.Peso)
    }
    if (body.Ancho) {
      camposActualizar.push('Ancho = @ancho')
      updateRequest.input('ancho', sql.Decimal(10,2), body.Ancho)
    }
    if (body.Diametro) {
      camposActualizar.push('Diametro = @diametro')
      updateRequest.input('diametro', sql.Decimal(10,2), body.Diametro)
    }
    if (body.Rise) {
      camposActualizar.push('Rise = @rise')
      updateRequest.input('rise', sql.Decimal(10,2), body.Rise)
    }
    if (body.Backsweep) {
      camposActualizar.push('Backsweep = @backsweep')
      updateRequest.input('backsweep', sql.Decimal(10,2), body.Backsweep)
    }
    if (body.Upsweep) {
      camposActualizar.push('Upsweep = @upsweep')
      updateRequest.input('upsweep', sql.Decimal(10,2), body.Upsweep)
    }

    if (camposActualizar.length === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'No se proporcionaron campos para actualizar'
      }, { status: 400 })
    }

    // Añadir campos de auditoría
    camposActualizar.push('FechaModificacion = @fechaModificacion')
    camposActualizar.push('UsuarioModificacion = @usuarioModificacion')

    const updateQuery = `
      UPDATE Productos 
      SET ${camposActualizar.join(', ')}
      WHERE Id = @productId AND TipoProducto = 'Manillares'
    `

    await updateRequest.query(updateQuery)

    return NextResponse.json<RespuestaAPI<string>>({
      success: true,
      data: 'Manillar actualizado correctamente'
    })

  } catch (error) {
    console.error('[API] Error actualizando manillar:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Endpoint para eliminar manillar (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    
    if (isNaN(productId)) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'ID de producto inválido'
      }, { status: 400 })
    }

    const pool = await getDbConnection()

    // Soft delete - marcar como inactivo
    const deleteQuery = `
      UPDATE Productos 
      SET 
        Activo = 0,
        FechaModificacion = @fechaModificacion,
        UsuarioModificacion = @usuarioModificacion
      WHERE Id = @productId AND TipoProducto = 'Manillares'
    `

    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .input('fechaModificacion', sql.DateTime, new Date())
      .input('usuarioModificacion', sql.VarChar(100), 'API_DELETE')
      .query(deleteQuery)

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Manillar no encontrado'
      }, { status: 404 })
    }

    return NextResponse.json<RespuestaAPI<string>>({
      success: true,
      data: 'Manillar eliminado correctamente'
    })

  } catch (error) {
    console.error('[API] Error eliminando manillar:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}