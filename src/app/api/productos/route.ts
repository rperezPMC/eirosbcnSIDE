import { NextRequest, NextResponse } from 'next/server'
import { ProductoConImagenes, RespuestaPaginada, RespuestaAPI } from '@/types/database'
import { 
  obtenerProductosConFiltros, 
  obtenerProductosPaginados,
  FiltrosProductos,
  OpcionesPaginacion 
} from '@/data/productosService'

// GET /api/productos
// Lista productos con filtros y paginación usando datos estáticos
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Lectura de query params
    const { searchParams } = new URL(request.url)
    
    // Normalización de filtros
    const filtros: FiltrosProductos = {
      tipoProducto: (searchParams.get('tipo') as 'Manillares' | 'Textil') || undefined,
      soloActivos: searchParams.get('activos') !== 'false',
      soloDestacados: searchParams.get('destacados') === 'true' || undefined,
      soloNovedades: searchParams.get('novedades') === 'true' || undefined,
      soloOfertas: searchParams.get('ofertas') === 'true' || undefined,
      precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
      precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
      colores: searchParams.get('colores')?.split(',') || undefined,
      materiales: searchParams.get('materiales')?.split(',') || undefined,
      tallas: searchParams.get('tallas')?.split(',') || undefined,
      genero: searchParams.get('genero') || undefined,
      temporada: searchParams.get('temporada') || undefined,
    }

    // Paginación y orden
    const paginacion: OpcionesPaginacion = {
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanoPagina: Number(searchParams.get('tamanoPagina')) || 12,
      ordenarPor: (searchParams.get('ordenarPor') as any) || 'nombre',
      orden: (searchParams.get('orden') as 'asc' | 'desc') || 'asc'
    }

    // Obtener productos filtrados
    const productosFiltrados = obtenerProductosConFiltros(filtros)

    // Aplicar paginación
    const resultado = obtenerProductosPaginados(productosFiltrados, paginacion)

    const apiResponse: RespuestaAPI<RespuestaPaginada<ProductoConImagenes>> = {
      success: true,
      data: resultado,
      message: `Se encontraron ${resultado.datos.length} productos`
    }
    
    const duration = Date.now() - startTime
    console.log(`✅ [API] GET /api/productos completado en ${duration}ms`)
    
    return NextResponse.json(apiResponse)

  } catch (error) {
    const duration = Date.now() - startTime
    console.error('\n❌ [API] ERROR EN /api/productos')
    console.error('⏱️ [API] Tiempo hasta error:', duration + 'ms')
    console.error('📝 [API] Detalles del error:', error)
        
    const errorResponse: RespuestaAPI = {
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los productos'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
