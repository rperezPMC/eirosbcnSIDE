// Tipos para FileMaker Data API

// Respuesta estándar de FileMaker
export interface FileMakerResponse<T = any> {
  response: {
    dataInfo?: {
      database: string
      layout: string
      table: string
      totalRecordCount: number
      foundCount: number
      returnedCount: number
    }
    data?: Array<{
      fieldData: T
      portalData: Record<string, any[]>
      recordId: string
      modId: string
    }>
    token?: string
  }
  messages: Array<{
    code: string
    message: string
  }>
}

// Opciones de búsqueda
export interface FindOptions {
  sort?: Array<{
    fieldName: string
    sortOrder: 'ascend' | 'descend'
  }>
  limit?: number
  offset?: number
  portal?: string[]
}

// Tipos de datos de FileMaker (raw)
export interface FileMakerBikeComponent {
  Id: number
  CategoriaId: number
  SubcategoriaId: number
  TipoProducto: string
  Nombre: string
  Slogan: string
  SKU: string
  Precio: number
  Descripcion: string
  DescripcionCorta: string
  DescripcionHistoria: string
  NombreSvgRuta: string
  Activo: number
  Destacado: number
  Novedad: number
  EnOferta: number
  PorcentajeDescuento: number
  Stock: number
  StockMinimo: number
  PermitirPreorden: number
  FechaCreacion: string
  FechaModificacion: string
  UsuarioCreacion: string
  UsuarioModificacion: string
  SlugUrl: string
  MetaTitulo: string
  MetaDescripcion: string
  MetaPalabrasClaves: string
}

export interface FileMakerTraduccion {
  Id: number
  ProductoId: number
  IdiomaId: number
  Nombre: string
  Slogan: string
  Descripcion: string
  DescripcionCorta: string
  DescripcionHistoria: string
  Informacion: string
  MetaTitulo: string
  MetaDescripcion: string
  MetaPalabrasClaves: string
  FechaCreacion: string
  FechaModificacion: string
}

export interface FileMakerVariante {
  Id: number
  ProductoId: number
  Color: string
  CodigoHex: string
  SKUVariante: string
  PrecioAdicional: number
  Stock: number
  Disponible: number
  ColorId: number
  Orden: number
  FechaCreacion: string
  FechaModificacion: string
}

export interface FileMakerPeso {
  Id: number
  ProductoId: number
  Peso: number
  Stock: number
  Disponible: number
  EsPrincipal: number
  Orden: number
  FechaCreacion: string
}

export interface FileMakerPotencia {
  Id: number
  ProductoId: number
  Potencia: string
  Width: string
  Rise: string
  Stock: number
  Disponible: number
  Orden: number
  FechaCreacion: string
}

export interface FileMakerImagen {
  Id: number
  ProductoId: number
  VarianteId: number
  RutaArchivo: string
  TipoImagen: string
  AltText: string
  EsPrincipal: number
  ColorId: number
  Orden: number
  Activa: number
  AnchoPixeles: number
  AltoPixeles: number
  TamanoBytes: number
  FechaSubida: string
  FechaModificacion: string
}

export interface FileMakerEspecificacion {
  Id: number
  ProductoId: number
  Backsweep: string
  Upsweep: string
  ClampDiameter: string
  Material: string
  Construction: string
  Autoclave: number
  Informacion: string
  Caracteristicas: string
  FechaCreacion: string
  FechaModificacion: string
}

export interface FileMakerColor {
  Id: number
  Nombre: string
  RutaLogo: string
  CodigoHex: string
  Orden: number
  Activo: number
}

export interface FileMakerCategoria {
  Id: number
  Codigo: string
  TipoProducto: string
  Icono: string
  Color: string
  Imagen: string
  SlugUrl: string
  Activo: number
  Orden: number
  FechaCreacion: string
  FechaModificacion: string
}

export interface FileMakerIdioma {
  Id: number
  Codigo: string
  Nombre: string
  NombreNativo: string
  EsPredeterminado: number
  Activo: number
  Orden: number
  FechaCreacion: string
}
