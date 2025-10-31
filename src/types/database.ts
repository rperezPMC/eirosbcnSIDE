// Types para la base de datos EirosBCN

// Usuario
export interface Usuario {
  Id: number
  Nombre: string
  Apellido: string
  TipoCliente?: string
  Correo: string
  Telefono?: string
  EstadoCuenta: 'Activo' | 'Inactivo' | 'Bloqueado'
  FechaRegistro: Date
}

// Producto base
export interface BaseProducto {
  Id: number
  TipoProducto: 'Manillares' | 'Textil'
  Nombre: string
  Descripcion?: string
  Precio: number
  Color?: string
  Informacion?: string
  SKU?: string
  Activo: boolean
  Destacado?: boolean
  Novedad?: boolean
  EnOferta?: boolean
  PorcentajeDescuento?: number
  Stock: number
  FechaCreacion: Date
  FechaModificacion?: Date
  UsuarioCreacion?: string
  UsuarioModificacion?: string
  SlugUrl?: string
  MetaDescripcion?: string
}

// Union type para cualquier producto
export type Producto = ProductoManillares | ProductoTextil

// Producto Manillares (campos específicos)
export interface ProductoManillares extends BaseProducto {
  TipoProducto: 'Manillares'
  Material?: string
  Peso?: number
  Ancho?: number
  Diametro?: number
  Rise?: number
  Backsweep?: number
  Upsweep?: number
}

// Producto Textil (campos específicos)
export interface ProductoTextil extends BaseProducto {
  TipoProducto: 'Textil'
  Talla?: string
  Textil?: string
  Composicion?: string
  GramajeTela?: number
  TipoTejido?: string
  TallaMinima?: string
  TallaMaxima?: string
  Genero?: 'Hombre' | 'Mujer' | 'Unisex'
  Temporada?: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno'
}

// Imágenes de productos 
export interface ImagenProducto {
  Id: number
  TipoProducto: string
  CodigoProducto: number
  NombreArchivo: string
  RutaCompleta: string
  RutaThumbnail?: string
  TipoImagen: string
  AltText?: string
  Color?: string
  Talla?: string
  EsPrincipal: boolean
  Orden: number
  TamanoArchivo?: number
  AnchoPixeles?: number
  AltoPixeles?: number
  FormatoImagen?: string
  Activa: boolean
  FechaSubida: Date
  FechaModificacion?: Date
}

// Producto con imágenes
export interface ProductoConImagenes extends BaseProducto {
  imagenes: ImagenProducto[]
  imagenPrincipal?: ImagenProducto
  Material?: string
  Peso?: number
  Ancho?: number
  Diametro?: number
  Rise?: number
  Backsweep?: number
  Upsweep?: number
  Talla?: string
  Textil?: string
  Composicion?: string
  GramajeTela?: number
  TipoTejido?: string
  TallaMinima?: string
  TallaMaxima?: string
  Genero?: 'Hombre' | 'Mujer' | 'Unisex'
  Temporada?: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno'
}

// Filtros para productos
export interface FiltrosProductos {
  tipoProducto?: 'Manillares' | 'Textil'
  soloActivos?: boolean
  soloDestacados?: boolean
  soloNovedades?: boolean
  soloOfertas?: boolean
  precioMin?: number
  precioMax?: number
  colores?: string[]
  // Filtros específicos Manillares
  materiales?: string[]
  pesoMin?: number
  pesoMax?: number
  // Filtros específicos Textil
  tallas?: string[]
  genero?: string
  temporada?: string
  textiles?: string[]
}

// Parámetros de paginación
export interface ParametrosPaginacion {
  pagina?: number
  tamanoPagina?: number
  ordenarPor?: 'nombre' | 'precio' | 'fecha' | 'stock'
  orden?: 'asc' | 'desc'
}

// Respuesta con paginación
export interface RespuestaPaginada<T> {
  datos: T[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
  tamanoPagina: number
}

// Respuestas API
export interface RespuestaAPI<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}