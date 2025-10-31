export function ProductosTextilSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Filtros Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-primary-800 rounded w-28"></div>
          <div className="h-10 bg-primary-800 rounded w-24"></div>
          <div className="h-10 bg-primary-800 rounded w-32"></div>
          <div className="h-10 bg-primary-800 rounded w-36"></div>
          <div className="h-10 bg-primary-800 rounded w-20"></div>
          <div className="h-10 bg-primary-800 rounded w-24"></div>
        </div>
        <div className="h-10 bg-primary-800 rounded w-48"></div>
      </div>

      {/* Contador de resultados */}
      <div className="h-4 bg-primary-800 rounded w-72"></div>

      {/* Grid de productos textil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white bg-opacity-5 rounded-lg overflow-hidden">
            {/* Imagen */}
            <div className="h-64 bg-primary-800 relative">
              <div className="absolute top-4 left-4">
                <div className="h-6 w-16 bg-luxury-gold bg-opacity-30 rounded mb-2"></div>
              </div>
            </div>
            
            {/* Contenido */}
            <div className="p-4 space-y-3">
              {/* Título */}
              <div className="h-5 bg-primary-700 rounded w-4/5"></div>
              
              {/* Tipo y género */}
              <div className="h-3 bg-primary-800 rounded w-2/3"></div>

              {/* Descripción */}
              <div className="space-y-2">
                <div className="h-3 bg-primary-800 rounded w-full"></div>
                <div className="h-3 bg-primary-800 rounded w-3/4"></div>
              </div>

              {/* Tags (talla, material, etc.) */}
              <div className="flex gap-2">
                <div className="h-6 bg-primary-700 rounded w-12"></div>
                <div className="h-6 bg-primary-700 rounded w-16"></div>
                <div className="h-6 bg-primary-700 rounded w-20"></div>
                <div className="h-6 bg-primary-700 rounded w-14"></div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="h-3 bg-primary-800 rounded w-24"></div>
              </div>

              {/* Precio y acciones */}
              <div className="flex justify-between items-center pt-2 border-t border-primary-700">
                <div className="space-y-1">
                  <div className="h-6 bg-luxury-gold bg-opacity-40 rounded w-20"></div>
                  <div className="h-3 bg-primary-800 rounded w-16"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-primary-700 rounded"></div>
                  <div className="h-8 w-16 bg-primary-700 rounded"></div>
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
