import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
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

    // Consulta principal del producto
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
        Talla,
        Textil,
        Composicion,
        GramajeTela,
        TipoTejido,
        TallaMinima,
        TallaMaxima,
        Genero,
        Temporada,
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
      WHERE Id = @productId AND Activo = 1
    `

    const productoResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(productoQuery)

    if (productoResult.recordset.length === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404 })
    }

    const producto = productoResult.recordset[0]

    // Consulta de imágenes asociadas (estructura real de la tabla)
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
      WHERE CodigoProducto = @productId AND Activa = 1
      ORDER BY EsPrincipal DESC, Orden ASC, FechaSubida ASC
    `

    const imagenesResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(imagenesQuery)

    // Construir objeto ProductoConImagenes
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
      
      // Campos específicos según tipo de producto
      ...(producto.TipoProducto === 'Textil' ? {
        Talla: producto.Talla,
        Textil: producto.Textil,
        Composicion: producto.Composicion,
        GramajeTela: producto.GramajeTela,
        TipoTejido: producto.TipoTejido,
        TallaMinima: producto.TallaMinima,
        TallaMaxima: producto.TallaMaxima,
        Genero: producto.Genero,
        Temporada: producto.Temporada,
      } : {
        Material: producto.Material,
        Peso: producto.Peso,
        Ancho: producto.Ancho,
        Diametro: producto.Diametro,
        Rise: producto.Rise,
        Backsweep: producto.Backsweep,
        Upsweep: producto.Upsweep,
      }),
      
      // Imágenes del producto
      imagenes: imagenesResult.recordset,
      imagenPrincipal: imagenesResult.recordset.find(img => img.EsPrincipal)
    }

    return NextResponse.json<RespuestaAPI<ProductoConImagenes>>({
      success: true,
      data: productoCompleto
    })

  } catch (error) {
    console.error('[API] Error obteniendo producto individual:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Endpoint para actualizar producto (opcional)
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

    // Verificar que el producto existe y obtener su tipo
    const existeQuery = `
      SELECT Id, TipoProducto FROM Productos 
      WHERE Id = @productId
    `
    
    const existeResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query(existeQuery)

    if (existeResult.recordset.length === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404 })
    }

    // Construir query de actualización dinámicamente
    const camposActualizar = []
    const updateRequest = pool.request()
    updateRequest.input('productId', sql.Int, productId)
    updateRequest.input('fechaModificacion', sql.DateTime, new Date())
    updateRequest.input('usuarioModificacion', sql.VarChar(100), 'API_UPDATE')

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
    if (body.Novedad !== undefined) {
      camposActualizar.push('Novedad = @novedad')
      updateRequest.input('novedad', sql.Bit, body.Novedad)
    }
    if (body.EnOferta !== undefined) {
      camposActualizar.push('EnOferta = @oferta')
      updateRequest.input('oferta', sql.Bit, body.EnOferta)
    }
    if (body.PorcentajeDescuento !== undefined) {
      camposActualizar.push('PorcentajeDescuento = @porcentajeDescuento')
      updateRequest.input('porcentajeDescuento', sql.Decimal(5,2), body.PorcentajeDescuento)
    }
    if (body.SKU) {
      camposActualizar.push('SKU = @sku')
      updateRequest.input('sku', sql.VarChar(100), body.SKU)
    }
    if (body.Informacion) {
      camposActualizar.push('Informacion = @informacion')
      updateRequest.input('informacion', sql.Text, body.Informacion)
    }

    // Obtener tipo de producto para campos específicos
    const tipoProducto = existeResult.recordset[0].TipoProducto

    // Campos específicos Manillares
    if (tipoProducto === 'Manillares') {
      if (body.Material) {
        camposActualizar.push('Material = @material')
        updateRequest.input('material', sql.VarChar(100), body.Material)
      }
      if (body.Peso !== undefined) {
        camposActualizar.push('Peso = @peso')
        updateRequest.input('peso', sql.Decimal(10,2), body.Peso)
      }
      if (body.Ancho !== undefined) {
        camposActualizar.push('Ancho = @ancho')
        updateRequest.input('ancho', sql.Decimal(10,2), body.Ancho)
      }
      if (body.Diametro !== undefined) {
        camposActualizar.push('Diametro = @diametro')
        updateRequest.input('diametro', sql.Decimal(10,2), body.Diametro)
      }
      if (body.Rise !== undefined) {
        camposActualizar.push('Rise = @rise')
        updateRequest.input('rise', sql.Decimal(10,2), body.Rise)
      }
      if (body.Backsweep !== undefined) {
        camposActualizar.push('Backsweep = @backsweep')
        updateRequest.input('backsweep', sql.Decimal(10,2), body.Backsweep)
      }
      if (body.Upsweep !== undefined) {
        camposActualizar.push('Upsweep = @upsweep')
        updateRequest.input('upsweep', sql.Decimal(10,2), body.Upsweep)
      }
    }
    // Campos específicos Textil
    else if (tipoProducto === 'Textil') {
      if (body.Talla) {
        camposActualizar.push('Talla = @talla')
        updateRequest.input('talla', sql.VarChar(10), body.Talla)
      }
      if (body.Textil) {
        camposActualizar.push('Textil = @textil')
        updateRequest.input('textil', sql.VarChar(100), body.Textil)
      }
      if (body.Composicion) {
        camposActualizar.push('Composicion = @composicion')
        updateRequest.input('composicion', sql.VarChar(255), body.Composicion)
      }
      if (body.GramajeTela !== undefined) {
        camposActualizar.push('GramajeTela = @gramajeTela')
        updateRequest.input('gramajeTela', sql.Decimal(10,2), body.GramajeTela)
      }
      if (body.TipoTejido) {
        camposActualizar.push('TipoTejido = @tipoTejido')
        updateRequest.input('tipoTejido', sql.VarChar(100), body.TipoTejido)
      }
      if (body.Genero) {
        camposActualizar.push('Genero = @genero')
        updateRequest.input('genero', sql.VarChar(20), body.Genero)
      }
      if (body.Temporada) {
        camposActualizar.push('Temporada = @temporada')
        updateRequest.input('temporada', sql.VarChar(20), body.Temporada)
      }
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
      WHERE Id = @productId
    `

    await updateRequest.query(updateQuery)

    return NextResponse.json<RespuestaAPI<string>>({
      success: true,
      data: 'Producto actualizado correctamente'
    })

  } catch (error) {
    console.error('[API] Error actualizando producto:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Endpoint para eliminar producto (soft delete)
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
      WHERE Id = @productId
    `

    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .input('fechaModificacion', sql.DateTime, new Date())
      .input('usuarioModificacion', sql.VarChar(100), 'API_DELETE')
      .query(deleteQuery)

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json<RespuestaAPI<null>>({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404 })
    }

    return NextResponse.json<RespuestaAPI<string>>({
      success: true,
      data: 'Producto eliminado correctamente'
    })

  } catch (error) {
    console.error('[API] Error eliminando producto:', error)
    
    return NextResponse.json<RespuestaAPI<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}
