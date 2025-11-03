import path from 'path'
import { promises as fs } from 'fs'

// Reutilizamos las mismas interfaces
export interface ColorInfo {
  id: number
  nombre: string
  rutaLogo: string
  codigoHex: string
}

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

const DATA_DIR = path.join(process.cwd(), 'src', 'data')

async function readJson<T = any>(fileName: string): Promise<T> {
  const full = path.join(DATA_DIR, fileName)
  const raw = await fs.readFile(full, 'utf-8')
  return JSON.parse(raw)
}

function sortByOrden<T extends { Orden?: number }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => (a.Orden ?? 999999) - (b.Orden ?? 999999))
}

export async function obtenerProductosMountainFromJson(locale: string = 'es'): Promise<MountainProduct[]> {
  // Cargamos todos los datasets necesarios en paralelo
  const [
    bc,
    bct,
    imgs,
    pesos,
    potencias,
    variantes,
    colores,
    idiomas,
    categorias,
    especificaciones
  ] = await Promise.all([
    readJson<any[]>('bikecomponents.json'),
    readJson<any[]>('bikecomponents_traduccion.json'),
    readJson<any[]>('bikecomponents_imagenes.json'),
    readJson<any[]>('bikecomponents_pesos.json'),
    readJson<any[]>('bikecomponents_potencia.json'),
    readJson<any[]>('bikecomponents_variantes.json'),
    readJson<any[]>('colores.json'),
    readJson<any[]>('idiomas.json'),
    readJson<any[]>('categorias.json'),
    readJson<any[]>('bikecomponents_especificaciones.json'),
  ])

  const idioma = idiomas.find((i) => i.Codigo === locale && i.Activo)
  if (!idioma) throw new Error(`Idioma no encontrado o inactivo: ${locale}`)
  const idiomaId = idioma.Id

  const categoriaMountain = categorias.find((c) => c.Codigo === 'mountain' && c.Activo)
  if (!categoriaMountain) throw new Error('Categoría "mountain" no encontrada o inactiva')

  const productosBC = bc.filter((p) => p.CategoriaId === categoriaMountain.Id && p.Activo)

  const productos: MountainProduct[] = productosBC
    .sort((a: any, b: any) => String(a.Nombre).localeCompare(String(b.Nombre)))
    .map((p: any) => {
      const t = bct.find((tr: any) => tr.ProductoId === p.Id && tr.IdiomaId === idiomaId) || {}

      const v = sortByOrden(
        variantes.filter((x: any) => x.ProductoId === p.Id)
      ).map((x: any) => {
        const c = colores.find((co: any) => co.Id === x.ColorId)
        const colorInfo = c
          ? {
              id: c.Id,
              nombre: c.Nombre,
              rutaLogo: c.RutaLogo,
              codigoHex: c.CodigoHex,
            }
          : null
        return {
          id: x.Id,
          color: x.Color,
          codigoHex: x.CodigoHex,
          colorId: x.ColorId ?? null,
          colorInfo,
          stock: x.Stock,
          disponible: x.Disponible,
          orden: x.Orden,
        }
      })

      const w = sortByOrden(
        pesos.filter((x: any) => x.ProductoId === p.Id)
      ).map((x: any) => ({
        id: x.Id,
        peso: x.Peso,
        stock: x.Stock,
        disponible: x.Disponible,
        esPrincipal: !!x.EsPrincipal,
        orden: x.Orden,
      }))

      const po = sortByOrden(
        potencias.filter((x: any) => x.ProductoId === p.Id)
      ).map((x: any) => ({
        id: x.Id,
        potencia: x.Potencia,
        width: x.Width || '',
        rise: x.Rise || '',
        stock: x.Stock,
        disponible: x.Disponible,
        orden: x.Orden,
      }))

      const im = sortByOrden(
        imgs.filter((x: any) => x.ProductoId === p.Id && x.Activa)
      ).map((x: any) => ({
        id: x.Id,
        rutaArchivo: x.RutaArchivo,
        tipoImagen: x.TipoImagen,
        varianteId: x.VarianteId ?? null,
        colorId: x.ColorId ?? null,
        esPrincipal: !!x.EsPrincipal,
        orden: x.Orden,
      }))

      const esp = especificaciones.find((e: any) => e.ProductoId === p.Id) || {}

      return {
        id: p.Id,
        nombre: t.Nombre ?? p.Nombre,
        nombreSvgRuta: p.NombreSvgRuta ?? undefined,
        subtitulo: t.DescripcionCorta ?? p.DescripcionCorta ?? t.Slogan ?? p.Slogan ?? '',
        descripcion: t.Descripcion ?? p.Descripcion ?? '',
        descripcionHistoria: t.DescripcionHistoria ?? p.DescripcionHistoria ?? '',
        precio: p.Precio,
        stock: p.Stock,
        variantes: v,
        pesos: w,
        potencias: po,
        imagenes: im,
        especificaciones: {
          backsweep: esp.Backsweep,
          upsweep: esp.Upsweep,
          clampDiameter: esp.ClampDiameter,
          material: esp.Material,
          construction: esp.Construction,
          autoclave: esp.Autoclave,
          informacion: esp.Informacion,
        },
      }
    })

  return productos
}

export async function obtenerProductoMountainPorIdFromJson(id: number, locale: string = 'es'): Promise<MountainProduct | null> {
  const productos = await obtenerProductosMountainFromJson(locale)
  return productos.find((p) => p.id === id) || null
}
