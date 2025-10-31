import { NextRequest, NextResponse } from 'next/server'
import { getDbConnection, sql } from '@/lib/database'
import { enviarCorreoPedido, enviarCorreoConfirmacionCliente } from '@/lib/services/emailService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pool = await getDbConnection()

    // Generar número de pedido
    const numPedido = await generarNumeroPedido(pool)

    // Obtener datos completos del producto
    const productoResult = await pool.request()
      .input('id', sql.Int, body.bikeComponentId)
      .query(`
        SELECT bc.*, bce.* 
        FROM BikeComponents bc
        LEFT JOIN BikeComponentsEspecificaciones bce ON bc.Id = bce.ProductoId
        WHERE bc.Id = @id
      `)

    const producto = productoResult.recordset[0]
    
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Datos del pedido para los correos
    const datosCorreo = {
      ...body,
      numPedido,
      pedidoId: 0,
      nombreProducto: producto.Nombre,
      sku: producto.SKU,
      precio: producto.Precio,
      locale: body.locale || 'es',
      especificaciones: {
        backsweep: producto.Backsweep,
        upsweep: producto.Upsweep,
        clampDiameter: producto.ClampDiameter,
        material: producto.Material,
        construction: producto.Construction
      }
    }

    // Enviar correos antes de guardar en BD
    try {
      // Correo al admin
      await enviarCorreoPedido(datosCorreo)
      
      // Correo de confirmación al cliente en su idioma
      await enviarCorreoConfirmacionCliente(datosCorreo)
      
    } catch (emailError: any) {
      console.error('❌ Error enviando correos:', emailError)
      return NextResponse.json(
        { error: 'Error al enviar notificaciones por correo. Por favor, contacta directamente.' },
        { status: 500 }
      )
    }

    // Solo si los correos se enviaron correctamente, guardar en BD
    const result = await pool.request()
      .input('numPedido', sql.NVarChar, numPedido)
      .input('nombreCliente', sql.NVarChar, body.nombreCliente)
      .input('email', sql.NVarChar, body.email)
      .input('telefono', sql.NVarChar, body.telefono || null)
      .input('pais', sql.NVarChar, body.pais)
      .input('ciudad', sql.NVarChar, body.ciudad)
      .input('bikeComponentId', sql.Int, body.bikeComponentId)
      .input('nombreProducto', sql.NVarChar, producto.Nombre)
      .input('sku', sql.NVarChar, producto.SKU)
      .input('colorSeleccionado', sql.NVarChar, body.colorSeleccionado)
      .input('colorId', sql.Int, body.colorId || null)
      .input('potenciaSeleccionada', sql.NVarChar, body.potenciaSeleccionada)
      .input('pesoSeleccionado', sql.NVarChar, body.pesoSeleccionado)
      .input('precio', sql.Decimal(10,2), producto.Precio)
      .input('mensaje', sql.NVarChar, body.mensaje || null)
      .query(`
        INSERT INTO Pedidos (
          NumPedido, NombreCliente, Email, Telefono, Pais, Ciudad,
          BikeComponentId, NombreProducto, SKU, ColorSeleccionado, ColorId,
          PotenciaSeleccionada, PesoSeleccionado, Precio, Mensaje
        ) OUTPUT INSERTED.Id
        VALUES (
          @numPedido, @nombreCliente, @email, @telefono, @pais, @ciudad,
          @bikeComponentId, @nombreProducto, @sku, @colorSeleccionado, @colorId,
          @potenciaSeleccionada, @pesoSeleccionado, @precio, @mensaje
        )
      `)

    const pedidoId = result.recordset[0].Id

    console.log('✅ Pedido guardado en BD:', numPedido)

    return NextResponse.json({ 
      success: true, 
      pedidoId,
      numPedido,
      mensaje: 'Pedido creado correctamente'
    })

  } catch (error: any) {
    console.error('❌ Error creando pedido:', error)
    return NextResponse.json(
      { error: 'Error al procesar pedido', detalle: error.message },
      { status: 500 }
    )
  }
}

async function generarNumeroPedido(pool: any): Promise<string> {
  const year = new Date().getFullYear()
  const result = await pool.request().query(`
    SELECT MAX(CAST(SUBSTRING(NumPedido, 10, 4) AS INT)) as MaxNum
    FROM Pedidos 
    WHERE NumPedido LIKE 'PED-${year}-%'
  `)
  
  const nextNum = (result.recordset[0]?.MaxNum || 0) + 1
  return `PED-${year}-${nextNum.toString().padStart(4, '0')}`
}
