import { ProductoConImagenes } from '@/types/database';
import productosData from './productos.json';

// Datos estáticos cargados desde JSON
const PRODUCTOS_STATIC: ProductoConImagenes[] = productosData as ProductoConImagenes[];

// Obtener todos los productos
export function obtenerTodosLosProductos(): ProductoConImagenes[] {
  return PRODUCTOS_STATIC;
}

// Obtener producto por ID
export function obtenerProductoPorId(id: number): ProductoConImagenes | null {
  return PRODUCTOS_STATIC.find(p => p.Id === id) || null;
}

// Obtener productos por tipo
export function obtenerProductosPorTipo(tipo: 'Manillares' | 'Textil'): ProductoConImagenes[] {
  return PRODUCTOS_STATIC.filter(p => p.TipoProducto === tipo);
}

// Obtener productos activos
export function obtenerProductosActivos(): ProductoConImagenes[] {
  return PRODUCTOS_STATIC.filter(p => p.Activo);
}

// Obtener productos destacados
export function obtenerProductosDestacados(): ProductoConImagenes[] {
  return PRODUCTOS_STATIC.filter(p => p.Destacado && p.Activo);
}

// Obtener productos con filtros
export interface FiltrosProductos {
  tipoProducto?: 'Manillares' | 'Textil';
  soloActivos?: boolean;
  soloDestacados?: boolean;
  soloNovedades?: boolean;
  soloOfertas?: boolean;
  precioMin?: number;
  precioMax?: number;
  colores?: string[];
  materiales?: string[];
  tallas?: string[];
  genero?: string;
  temporada?: string;
}

export function obtenerProductosConFiltros(filtros: FiltrosProductos): ProductoConImagenes[] {
  let productos = [...PRODUCTOS_STATIC];

  // Filtro por tipo
  if (filtros.tipoProducto) {
    productos = productos.filter(p => p.TipoProducto === filtros.tipoProducto);
  }

  // Filtro activos
  if (filtros.soloActivos) {
    productos = productos.filter(p => p.Activo);
  }

  // Filtro destacados
  if (filtros.soloDestacados) {
    productos = productos.filter(p => p.Destacado);
  }

  // Filtro novedades
  if (filtros.soloNovedades) {
    productos = productos.filter(p => p.Novedad);
  }

  // Filtro ofertas
  if (filtros.soloOfertas) {
    productos = productos.filter(p => p.EnOferta);
  }

  // Filtro precio mínimo
  if (filtros.precioMin !== undefined) {
    productos = productos.filter(p => p.Precio >= filtros.precioMin!);
  }

  // Filtro precio máximo
  if (filtros.precioMax !== undefined) {
    productos = productos.filter(p => p.Precio <= filtros.precioMax!);
  }

  // Filtro colores
  if (filtros.colores && filtros.colores.length > 0) {
    productos = productos.filter(p => 
      p.Color && filtros.colores!.includes(p.Color)
    );
  }

  // Filtro materiales
  if (filtros.materiales && filtros.materiales.length > 0) {
    productos = productos.filter(p => 
      'Material' in p && p.Material && filtros.materiales!.includes(p.Material)
    );
  }

  // Filtro tallas
  if (filtros.tallas && filtros.tallas.length > 0) {
    productos = productos.filter(p => 
      'Talla' in p && p.Talla && filtros.tallas!.includes(p.Talla)
    );
  }

  // Filtro genero
  if (filtros.genero) {
    productos = productos.filter(p => 
      'Genero' in p && p.Genero === filtros.genero
    );
  }

  // Filtro temporada
  if (filtros.temporada) {
    productos = productos.filter(p => 
      'Temporada' in p && p.Temporada === filtros.temporada
    );
  }

  return productos;
}

// Paginación
export interface OpcionesPaginacion {
  pagina: number;
  tamanoPagina: number;
  ordenarPor?: 'nombre' | 'precio' | 'fecha';
  orden?: 'asc' | 'desc';
}

export interface ResultadoPaginado {
  datos: ProductoConImagenes[];
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  tamanoPagina: number;
}

export function obtenerProductosPaginados(
  productos: ProductoConImagenes[],
  opciones: OpcionesPaginacion
): ResultadoPaginado {
  // Ordenar
  let productosOrdenados = [...productos];
  const { ordenarPor = 'nombre', orden = 'asc' } = opciones;

  productosOrdenados.sort((a, b) => {
    let comparacion = 0;
    
    switch (ordenarPor) {
      case 'nombre':
        comparacion = a.Nombre.localeCompare(b.Nombre);
        break;
      case 'precio':
        comparacion = a.Precio - b.Precio;
        break;
      case 'fecha':
        comparacion = new Date(a.FechaCreacion).getTime() - new Date(b.FechaCreacion).getTime();
        break;
    }

    return orden === 'asc' ? comparacion : -comparacion;
  });

  // Calcular paginación
  const totalRegistros = productosOrdenados.length;
  const totalPaginas = Math.ceil(totalRegistros / opciones.tamanoPagina);
  const inicio = (opciones.pagina - 1) * opciones.tamanoPagina;
  const fin = inicio + opciones.tamanoPagina;

  return {
    datos: productosOrdenados.slice(inicio, fin),
    paginaActual: opciones.pagina,
    totalPaginas,
    totalRegistros,
    tamanoPagina: opciones.tamanoPagina
  };
}
