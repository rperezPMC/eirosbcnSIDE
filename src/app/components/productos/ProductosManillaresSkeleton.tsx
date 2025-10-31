export function ProductosManillaresSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Filtros Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-primary-800 rounded w-32"></div>
          <div className="h-10 bg-primary-800 rounded w-24"></div>
          <div className="h-10 bg-primary-800 rounded w-28"></div>
          <div className="h-10 bg-primary-800 rounded w-36"></div>
        </div>
        <div className="h-10 bg-primary-800 rounded w-48"></div>
      </div>

      {/* Contador de resultados */}
      <div className="h-4 bg-primary-800 rounded w-64"></div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white bg-opacity-5 rounded-lg overflow-hidden">
            {/* Imagen */}
            <div className="h-64 bg-primary-800"></div>
            
            {/* Contenido */}
            <div className="p-4 space-y-3">
              {/* Título */}
              <div className="h-5 bg-primary-700 rounded w-3/4"></div>
              
              {/* Descripción */}
              <div className="space-y-2">
                <div className="h-3 bg-primary-800 rounded w-full"></div>
                <div className="h-3 bg-primary-800 rounded w-2/3"></div>
              </div>

              {/* Especificaciones */}
              <div className="flex gap-2">
                <div className="h-6 bg-primary-700 rounded w-16"></div>
                <div className="h-6 bg-primary-700 rounded w-20"></div>
                <div className="h-6 bg-primary-700 rounded w-14"></div>
              </div>

              {/* Precio y acciones */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-luxury-gold bg-opacity-30 rounded w-20"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-primary-700 rounded"></div>
                  <div className="h-8 w-20 bg-primary-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-10 w-10 bg-primary-800 rounded"></div>
        ))}
      </div>
    </div>
  )
}
