import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface PaginacionProductosProps {
  paginaActual: number
  totalPaginas: number
  onPaginaChange: (pagina: number) => void
}

export function PaginacionProductos({ 
  paginaActual, 
  totalPaginas, 
  onPaginaChange 
}: PaginacionProductosProps) {
  // Generar array de números de página para mostrar
  const generarPaginas = () => {
    const paginas: (number | 'ellipsis')[] = []
    const delta = 2 // Número de páginas a mostrar alrededor de la actual
    
    // Primera página siempre
    paginas.push(1)
    
    if (paginaActual > delta + 2) {
      paginas.push('ellipsis')
    }
    
    // Páginas alrededor de la actual
    for (let i = Math.max(2, paginaActual - delta); i <= Math.min(totalPaginas - 1, paginaActual + delta); i++) {
      paginas.push(i)
    }
    
    if (paginaActual < totalPaginas - delta - 1) {
      paginas.push('ellipsis')
    }
    
    // Última página siempre (si no es la primera)
    if (totalPaginas > 1) {
      paginas.push(totalPaginas)
    }
    
    // Eliminar duplicados
    return paginas.filter((pagina, index, array) => 
      index === 0 || pagina !== array[index - 1]
    )
  }

  const paginas = generarPaginas()

  if (totalPaginas <= 1) {
    return null
  }

  return (
    <nav className='flex justify-center items-center space-x-2' aria-label='Paginación'>
      {/* Botón anterior */}
      <button
        onClick={() => onPaginaChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={clsx(
          'flex items-center px-3 py-2 text-sm border transition-all duration-300',
          paginaActual === 1
            ? 'text-primary-500 border-primary-700 cursor-not-allowed'
            : 'text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
        )}
        aria-label='Página anterior'
      >
        <ChevronLeftIcon className='h-4 w-4 mr-1' />
        Anterior
      </button>

      {/* Números de página */}
      <div className='flex space-x-1'>
        {paginas.map((pagina, index) => {
          if (pagina === 'ellipsis') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className='px-3 py-2 text-primary-400'
              >
                ...
              </span>
            )
          }

          return (
            <button
              key={pagina}
              onClick={() => onPaginaChange(pagina)}
              className={clsx(
                'px-3 py-2 text-sm border transition-all duration-300 min-w-[40px]',
                paginaActual === pagina
                  ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                  : 'text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
              )}
              aria-label={`Página ${pagina}`}
              aria-current={paginaActual === pagina ? 'page' : undefined}
            >
              {pagina}
            </button>
          )
        })}
      </div>

      {/* Botón siguiente */}
      <button
        onClick={() => onPaginaChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={clsx(
          'flex items-center px-3 py-2 text-sm border transition-all duration-300',
          paginaActual === totalPaginas
            ? 'text-primary-500 border-primary-700 cursor-not-allowed'
            : 'text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
        )}
        aria-label='Página siguiente'
      >
        Siguiente
        <ChevronRightIcon className='h-4 w-4 ml-1' />
      </button>
    </nav>
  )
}
