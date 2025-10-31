import { getDbConnection, sql } from '@/lib/database'

// Interfaz de color
export interface ColorInfo {
  id: number
  nombre: string
  rutaLogo: string
  codigoHex: string
}

// Interfaz completa del producto Mountain
export interface MountainProduct {
  id: number
  nombre: string
  nombreSvgRuta?: string
  subtitulo: string
  descripcion: string
  descripcionHistoria: string
  precio: number
  stock: number
  variantes: Array<{
    id: number
    color: string
    codigoHex: string
    colorId: number | null
    colorInfo: ColorInfo | null
    stock: number
    disponible: boolean
    orden: number
  }>
  pesos: Array<{
    id: number
    peso: number
    stock: number
    disponible: boolean
    esPrincipal: boolean
    orden: number
  }>
  potencias: Array<{
    id: number
    potencia: string
    width: string
    rise: string
    stock: number
    disponible: boolean
    orden: number
  }>
  imagenes: Array<{
    id: number
    rutaArchivo: string
    tipoImagen: string
    varianteId: number | null
    colorId: number | null
    esPrincipal: boolean
    orden: number
  }>
  especificaciones: {
    backsweep?: string
    upsweep?: string
    clampDiameter?: string
    material?: string
    construction?: string
    autoclave?: boolean
    informacion?: string
  }
}

// Obtener productos mountain con traducciones y relaciones
export async function obtenerProductosMountain(
  locale: string = 'es'
): Promise<MountainProduct[]> {
  try {
    const pool = await getDbConnection()

    // Obtener ID del idioma
    const idiomaResult = await pool
      .request()
      .input('locale', sql.NVarChar, locale)
      .query(`
        SELECT Id, Codigo, Nombre FROM Idiomas 
        WHERE Codigo = @locale AND Activo = 1
      `)

    const idiomaId = idiomaResult.recordset[0]?.Id

    if (!idiomaId) {
      throw new Error(`Idioma no encontrado: ${locale}`)
    }

    const categoriaResult = await pool
      .request()
      .query(`
        SELECT Id, Codigo, TipoProducto FROM Categorias 
        WHERE Activo = 1
      `)

    const categoriaId = categoriaResult.recordset.find(c => c.Codigo === 'mountain')?.Id

    if (!categoriaId) {
      throw new Error(`Categoría Mountain no encontrada. Categorías disponibles: ${JSON.stringify(categoriaResult.recordset.map(c => c.Codigo))}`)
    }

    const productosResult = await pool
      .request()
      .input('categoriaId', sql.Int, categoriaId)
      .input('idiomaId', sql.Int, idiomaId)
      .query(`
        SELECT 
          bc.Id,
          COALESCE(bct.Nombre, bc.Nombre) AS Nombre,
          bc.NombreSvgRuta,
          COALESCE(bct.Slogan, bc.Slogan) AS Slogan,
          COALESCE(bct.DescripcionCorta, bc.DescripcionCorta) AS Subtitulo,
          COALESCE(bct.Descripcion, bc.Descripcion) AS Descripcion,
          COALESCE(bct.DescripcionHistoria, bc.DescripcionHistoria) AS DescripcionHistoria,
          bc.Precio,
          bc.Stock
        FROM BikeComponents bc
        LEFT JOIN BikeComponentsTraduccion bct 
          ON bc.Id = bct.ProductoId AND bct.IdiomaId = @idiomaId
        WHERE bc.CategoriaId = @categoriaId
          AND bc.Activo = 1
        ORDER BY bc.Nombre
      `)

    const productos: MountainProduct[] = []

    for (const row of productosResult.recordset) {

      const variantesResult = await pool
        .request()
        .input('productoId', sql.Int, row.Id)
        .query(`
          SELECT 
            v.Id,
            v.Color,
            v.CodigoHex,
            v.ColorId,
            v.Stock,
            v.Disponible,
            v.Orden,
            c.Id AS ColorIdInfo,
            c.Nombre AS ColorNombre,
            c.RutaLogo AS ColorRutaLogo,
            c.CodigoHex AS ColorCodigoHex
          FROM BikeComponentsVariantes v
          LEFT JOIN Colores c ON v.ColorId = c.Id
          WHERE v.ProductoId = @productoId
          ORDER BY v.Orden
        `)

      // Consultar pesos
      const pesosResult = await pool
        .request()
        .input('productoId', sql.Int, row.Id)
        .query(`
          SELECT 
            Id,
            Peso,
            Stock,
            Disponible,
            EsPrincipal,
            Orden
          FROM BikeComponentsPesos
          WHERE ProductoId = @productoId
          ORDER BY Orden
        `)

      // Consultar potencias
      const potenciasResult = await pool
        .request()
        .input('productoId', sql.Int, row.Id)
        .query(`
          SELECT 
            Id,
            Potencia,
            Width,
            Rise,
            Stock,
            Disponible,
            Orden
          FROM BikeComponentsPotencia
          WHERE ProductoId = @productoId
          ORDER BY Orden
        `)

      // Consultar imágenes con ColorId
      const imagenesResult = await pool
        .request()
        .input('productoId', sql.Int, row.Id)
        .query(`
          SELECT 
            Id,
            RutaArchivo,
            TipoImagen,
            VarianteId,
            ColorId,
            EsPrincipal,
            Orden
          FROM BikeComponentsImagenes
          WHERE ProductoId = @productoId
            AND Activa = 1
          ORDER BY Orden
        `)

      // Consultar especificaciones
      const especificacionesResult = await pool
        .request()
        .input('productoId', sql.Int, row.Id)
        .query(`
          SELECT 
            Backsweep,
            Upsweep,
            ClampDiameter,
            Material,
            Construction,
            Autoclave,
            Informacion,
            Caracteristicas
          FROM BikeComponentsEspecificaciones
          WHERE ProductoId = @productoId
        `)

      const especData = especificacionesResult.recordset[0] || {}

      // Construir objeto producto
      productos.push({
        id: row.Id,
        nombre: row.Nombre,
        nombreSvgRuta: row.NombreSvgRuta || undefined,
        subtitulo: row.Subtitulo || row.Slogan || '',
        descripcion: row.Descripcion || '',
        descripcionHistoria: row.DescripcionHistoria || '',
        precio: row.Precio,
        stock: row.Stock,
        variantes: variantesResult.recordset.map((v: any) => ({
          id: v.Id,
          color: v.Color,
          codigoHex: v.CodigoHex,
          colorId: v.ColorId || null,
          colorInfo: v.ColorIdInfo ? {
            id: v.ColorIdInfo,
            nombre: v.ColorNombre,
            rutaLogo: v.ColorRutaLogo,
            codigoHex: v.ColorCodigoHex
          } : null,
          stock: v.Stock,
          disponible: v.Disponible,
          orden: v.Orden
        })),
        pesos: pesosResult.recordset.map((p: any) => ({
          id: p.Id,
          peso: p.Peso,
          stock: p.Stock,
          disponible: p.Disponible,
          esPrincipal: p.EsPrincipal,
          orden: p.Orden
        })),
        potencias: potenciasResult.recordset.map((t: any) => ({
          id: t.Id,
          potencia: t.Potencia,
          width: t.Width || '',
          rise: t.Rise || '',
          stock: t.Stock,
          disponible: t.Disponible,
          orden: t.Orden
        })),
        imagenes: imagenesResult.recordset.map((i: any) => ({
          id: i.Id,
          rutaArchivo: i.RutaArchivo,
          tipoImagen: i.TipoImagen,
          varianteId: i.VarianteId,
          colorId: i.ColorId,
          esPrincipal: i.EsPrincipal,
          orden: i.Orden
        })),
        especificaciones: {
          backsweep: especData.Backsweep,
          upsweep: especData.Upsweep,
          clampDiameter: especData.ClampDiameter,
          material: especData.Material,
          construction: especData.Construction,
          autoclave: especData.Autoclave,
          informacion: especData.Informacion
        }
      })
    }
    return productos

  } catch (error) {
    console.error('[MOUNTAIN_SERVICE] Error obteniendo productos:', error)
    throw error
  }
}

// Obtener un producto específico por ID
export async function obtenerProductoMountainPorId(
  id: number,
  locale: string = 'es'
): Promise<MountainProduct | null> {
  try {
    const productos = await obtenerProductosMountain(locale)
    return productos.find(p => p.id === id) || null
  } catch (error) {
    console.error('[MOUNTAIN_SERVICE] Error obteniendo producto por ID:', error)
    return null
  }
}