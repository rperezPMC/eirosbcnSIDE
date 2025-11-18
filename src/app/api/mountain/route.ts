// API Route: /api/mountain
// Obtener productos Mountain desde FileMaker

import { NextRequest, NextResponse } from 'next/server'
import { obtenerProductosMountain } from '@/lib/services/filemakerProductService'

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') || 'es'

    console.log(`[API /mountain] Petición recibida, locale: ${locale}`)

    // Obtener productos desde FileMaker
    const productos = await obtenerProductosMountain(locale)

    console.log(`[API /mountain] Productos obtenidos: ${productos.length}`)

    return NextResponse.json({
      success: true,
      data: productos,
      count: productos.length
    })

  } catch (error) {
    console.error('[API /mountain] Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: []
      },
      { status: 500 }
    )
  }
}
