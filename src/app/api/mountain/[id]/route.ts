// API Route: /api/mountain/[id]
// Obtener producto Mountain específico desde FileMaker

import { NextRequest, NextResponse } from 'next/server'
import { obtenerProductoMountainPorId } from '@/lib/services/filemakerProductService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID inválido',
          data: null
        },
        { status: 400 }
      )
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') || 'es'

    console.log(`[API /mountain/${id}] Petición recibida, locale: ${locale}`)

    // Obtener producto desde FileMaker
    const producto = await obtenerProductoMountainPorId(id, locale)

    if (!producto) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
          data: null
        },
        { status: 404 }
      )
    }

    console.log(`[API /mountain/${id}] Producto encontrado: ${producto.nombre}`)

    return NextResponse.json({
      success: true,
      data: producto
    })

  } catch (error) {
    console.error(`[API /mountain/${params.id}] Error:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: null
      },
      { status: 500 }
    )
  }
}
