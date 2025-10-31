// Types para el Sistema V2 - Normalizado con Multiidioma
// Base de Datos: EirosBCN

// =============================================
// IDIOMAS
// =============================================

export interface Idioma {
  Id: number
  Codigo: string // 'es', 'ca', 'en'
  Nombre: string
  NombreNativo: string
  EsPredeterminado: boolean
  Activo: boolean
  Orden: number
  FechaCreacion: Date
}

// =============================================
// CATEGORIAS Y SUBCATEGORIAS
// =============================================

export interface Categoria {
  Id: number
  Codigo: string // 'mountain', 'carrer', 'ropa'
  TipoProducto: 'BikeComponents' | 'GearUp'
  Icono?: string
  Color?: string
  Imagen?: string
  SlugUrl?: string
  Activo: boolean
  Orden: number
  FechaCreacion: Date
  FechaModificacion?: Date
}

export interface CategoriaTraduccion {
  Id: number
  CategoriaId: number
  IdiomaId: number
  Nombre: string
  Descripcion?: string
  MetaTitulo?: string
  MetaDescripcion?: string
  FechaCreacion: Date
  FechaModificacion?: Date
}

export interface Subcategoria {
  Id: number
  CategoriaId: number
  Codigo: string // 'manillars_tiges', 'plats'
  Icono?: string
  Color?: string
  Imagen?: string
  SlugUrl?: string
  Activo: boolean
  Orden: number
  FechaCreacion: Date
  FechaModificacion?: Date
}

export interface SubcategoriaTraduccion {
  Id: number
  SubcategoriaId: number
  IdiomaId: number
  Nombre: string
  Descripcion?: string
  MetaTitulo?: string
  MetaDescripcion?: string
  FechaCreacion: Date
  FechaModificacion?: Date
}

// Tipos combinados con traducciones
export interface CategoriaConTraduccion extends Categoria {
  traduccion: CategoriaTraduccion
}

export interface SubcategoriaConTraduccion extends Subcategoria {
  traduccion: SubcategoriaTraduccion
}

// =============================================
// BIKECOMPONENTS
// =============================================

export interface BikeComponent {
  Id: number
  CategoriaId: number
  SubcategoriaId: number
  Nombre: string
  Descripcion?: string
  DescripcionCorta?: string
  Precio: number
  Color?: string
  SKU?: string
  
  // Campos técnicos
  Material?: string
  Peso?: number // Gramos
  Ancho?: number // mm
  Diametro?: number // mm
  Rise?: number // mm
  Backsweep?: number // Grados
  Upsweep?: number // Grados
  
  // Info adicional
  Informacion?: string
  Especificaciones?: string // JSON
  Caracteristicas?: string // JSON
  
  // Estado
  Activo: boolean
  Destacado?: boolean
  Novedad?: boolean
  EnOferta?: boolean
  PorcentajeDescuento?: number
  Stock: number
  StockMinimo?: number
  PermitirPreorden?: boolean
  
  // Auditoría
  FechaCreacion: Date
  FechaModificacion?: Date
  UsuarioCreacion?: string
  UsuarioModificacion?: string
  
  // SEO
  SlugUrl?: string
  MetaTitulo?: string
  MetaDescripcion?: string
  MetaPalabrasClaves?: string
}

export interface BikeComponentTraduccion {
  Id: number
  ProductoId: number
  IdiomaId: number
  Nombre: string
  Descripcion?: string
  DescripcionCorta?: string
  Informacion?: string
  Especificaciones?: string // JSON traducido
  Caracteristicas?: string // JSON traducido
  MetaTitulo?: string
  MetaDescripcion?: string
  MetaPalabrasClaves?: string
  FechaCreacion: Date
  FechaModificacion?: Date
}

// BikeComponent completo con relaciones
export interface BikeComponentCompleto extends BikeComponent {
  traduccion?: BikeComponentTraduccion
  categoria: CategoriaConTraduccion
  subcategoria: SubcategoriaConTraduccion
  imagenes: ImagenProducto[]
  imagenPrincipal?: ImagenProducto
}

// =============================================
// GEARUP
// =============================================

export interface GearUpProduct {
  Id: number
  CategoriaId: number
  SubcategoriaId: number
  Nombre: string
  Descripcion?: string
  DescripcionCorta?: string
  Precio: number
  Color?: string
  SKU?: string
  
  // Campos textiles
  Talla?: string
  Textil?: string
  Composicion?: string
  GramajeTela?: number // g/m²
  TipoTejido?: string
  TallaMinima?: string
  TallaMaxima?: string
  Genero?: 'Hombre' | 'Mujer' | 'Unisex'
  Temporada?: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno'
  
  // Info adicional
  Informacion?: string
  CuidadosLavado?: string
  TablaTallas?: string // JSON
  
  // Estado
  Activo: boolean
  Destacado?: boolean
  Novedad?: boolean
  EnOferta?: boolean
  PorcentajeDescuento?: number
  Stock: number
  StockMinimo?: number
  PermitirPreorden?: boolean
  
  // Auditoría
  FechaCreacion: Date
  FechaModificacion?: Date
  UsuarioCreacion?: string
  UsuarioModificacion?: string
  
  // SEO
  SlugUrl?: string
  MetaTitulo?: string
  MetaDescripcion?: string
  MetaPalabrasClaves?: string
}

export interface GearUpTraduccion {
  Id: number
  ProductoId: number
  IdiomaId: number
  Nombre: string
  Descripcion?: string
  DescripcionCorta?: string
  Informacion?: string
  CuidadosLavado?: string
  TablaTallas?: string // JSON traducido
  MetaTitulo?: string
  MetaDescripcion?: string
  MetaPalabrasClaves?: string
  FechaCreacion: Date
  FechaModificacion?: Date
}

// GearUp completo con relaciones
export interface GearUpProductCompleto extends GearUpProduct {
  traduccion?: GearUpTraduccion
  categoria: CategoriaConTraduccion
  subcategoria: SubcategoriaConTraduccion
  imagenes: ImagenProducto[]
  imagenPrincipal?: ImagenProducto
}

// =============================================
// IMÁGENES
// =============================================

export interface ImagenProducto {
  Id: number
  TipoProducto: 'BikeComponents' | 'GearUp'
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

export interface FiltrosBase {
  idioma?: string // 'es', 'ca', 'en'
  soloActivos?: boolean
  soloDestacados?: boolean
  soloNovedades?: boolean
  soloOfertas?: boolean
  precioMin?: number
  precioMax?: number
  colores?: string[]
}

export interface FiltrosBikeComponents extends FiltrosBase {
  categoriaId?: number
  categoriaIds?: number[]
  categoriaCodigo?: string
  subcategoriaId?: number
  subcategoriaIds?: number[]
  subcategoriaCodigo?: string
  materiales?: string[]
  pesoMin?: number
  pesoMax?: number
}

export interface FiltrosGearUp extends FiltrosBase {
  categoriaId?: number
  categoriaIds?: number[]
  categoriaCodigo?: string
  subcategoriaId?: number
  subcategoriaIds?: number[]
  subcategoriaCodigo?: string
  tallas?: string[]
  genero?: string
  temporada?: string
  textiles?: string[]
}

export interface FiltrosCategorias {
  idioma?: string
  tipoProducto?: 'BikeComponents' | 'GearUp'
  soloActivas?: boolean
}

export interface FiltrosSubcategorias {
  idioma?: string
  categoriaId?: number
  categoriaCodigo?: string
  soloActivas?: boolean
}

// =============================================
// PAGINACIÓN Y RESPUESTAS
// =============================================

export interface ParametrosPaginacion {
  pagina?: number
  tamanoPagina?: number
  ordenarPor?: 'nombre' | 'precio' | 'fecha' | 'stock' | 'destacado'
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
// NAVEGACIÓN
// =============================================

export interface EstructuraNavegacion {
  categoria: CategoriaConTraduccion
  subcategorias: SubcategoriaConTraduccion[]
  totalProductos?: number
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
