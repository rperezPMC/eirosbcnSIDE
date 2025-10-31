// Types para las nuevas tablas BikeComponents y GearUp

// =============================================
// BIKECOMPONENTS
// =============================================

export interface BikeComponent {
  // Identificador
  Id: number
  
  // Categorización
  Categoria: string // 'mountain', 'carrer', 'ciclisme'
  Subcategoria: string // 'ManillarsTiges', 'Plats', 'Accessoris'
  
  // Información básica
  Nombre: string
  Descripcion?: string
  Precio: number
  Color?: string
  Informacion?: string
  SKU?: string
  
  // Campos específicos de componentes
  Material?: string
  Peso?: number // Gramos
  Ancho?: number // mm
  Diametro?: number // mm
  Rise?: number // mm
  Backsweep?: number // Grados
  Upsweep?: number // Grados
  
  // Estado y promociones
  Activo: boolean
  Destacado?: boolean
  Novedad?: boolean
  EnOferta?: boolean
  PorcentajeDescuento?: number
  Stock: number
  
  // Auditoría
  FechaCreacion: Date
  FechaModificacion?: Date
  UsuarioCreacion?: string
  UsuarioModificacion?: string
  
  // SEO
  SlugUrl?: string
  MetaDescripcion?: string
}

// BikeComponent con imágenes
export interface BikeComponentConImagenes extends BikeComponent {
  imagenes: ImagenProducto[]
  imagenPrincipal?: ImagenProducto
}

// =============================================
// GEARUP
// =============================================

export interface GearUpProduct {
  // Identificador
  Id: number
  
  // Categorización
  Categoria: string // 'ropa', 'accesorios'
  Subcategoria: string // 'camisetas', 'pantalones', 'gorras'
  
  // Información básica
  Nombre: string
  Descripcion?: string
  Precio: number
  Color?: string
  Informacion?: string
  SKU?: string
  
  // Campos específicos de ropa/textil
  Talla?: string
  Textil?: string
  Composicion?: string
  GramajeTela?: number // g/m²
  TipoTejido?: string
  TallaMinima?: string
  TallaMaxima?: string
  Genero?: 'Hombre' | 'Mujer' | 'Unisex'
  Temporada?: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno'
  
  // Estado y promociones
  Activo: boolean
  Destacado?: boolean
  Novedad?: boolean
  EnOferta?: boolean
  PorcentajeDescuento?: number
  Stock: number
  
  // Auditoría
  FechaCreacion: Date
  FechaModificacion?: Date
  UsuarioCreacion?: string
  UsuarioModificacion?: string
  
  // SEO
  SlugUrl?: string
  MetaDescripcion?: string
}

// GearUpProduct con imágenes
export interface GearUpProductConImagenes extends GearUpProduct {
  imagenes: ImagenProducto[]
  imagenPrincipal?: ImagenProducto
}

// =============================================
// IMÁGENES (actualizado para nuevas tablas)
// =============================================

export interface ImagenProducto {
  Id: number
  TipoProducto: 'BikeComponents' | 'GearUp' // Actualizado
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

// =============================================
// FILTROS
// =============================================

export interface FiltrosBikeComponents {
  categoria?: string
  subcategoria?: string
  soloActivos?: boolean
  soloDestacados?: boolean
  soloNovedades?: boolean
  soloOfertas?: boolean
  precioMin?: number
  precioMax?: number
  colores?: string[]
  materiales?: string[]
  pesoMin?: number
  pesoMax?: number
}

export interface FiltrosGearUp {
  categoria?: string
  subcategoria?: string
  soloActivos?: boolean
  soloDestacados?: boolean
  soloNovedades?: boolean
  soloOfertas?: boolean
  precioMin?: number
  precioMax?: number
  colores?: string[]
  tallas?: string[]
  genero?: string
  temporada?: string
  textiles?: string[]
}

// Filtro genérico unificado
export interface FiltrosProductos {
  tipoProducto?: 'BikeComponents' | 'GearUp'
  categoria?: string
  subcategoria?: string
  soloActivos?: boolean
  soloDestacados?: boolean
  soloNovedades?: boolean
  soloOfertas?: boolean
  precioMin?: number
  precioMax?: number
  colores?: string[]
  // BikeComponents específico
  materiales?: string[]
  pesoMin?: number
  pesoMax?: number
  // GearUp específico
  tallas?: string[]
  genero?: string
  temporada?: string
  textiles?: string[]
}

// =============================================
// PAGINACIÓN Y RESPUESTAS
// =============================================

export interface ParametrosPaginacion {
  pagina?: number
  tamanoPagina?: number
  ordenarPor?: 'nombre' | 'precio' | 'fecha' | 'stock'
  orden?: 'asc' | 'desc'
}

export interface RespuestaPaginada<T> {
  datos: T[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
  tamanoPagina: number
}

export interface RespuestaAPI<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// =============================================
// USUARIOS (sin cambios)
// =============================================

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

// =============================================
// TIPOS LEGACY (mantener por compatibilidad)
// =============================================

// Mantener estos tipos solo si hay código legacy que los use
// Pueden ser eliminados después de migrar todo el código

/** @deprecated Usar BikeComponent en su lugar */
export type ProductoManillares = BikeComponent

/** @deprecated Usar GearUpProduct en su lugar */
export type ProductoTextil = GearUpProduct

/** @deprecated Usar BikeComponentConImagenes o GearUpProductConImagenes */
export type ProductoConImagenes = BikeComponentConImagenes | GearUpProductConImagenes
