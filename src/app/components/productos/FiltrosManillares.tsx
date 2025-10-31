'use client'

import { useState } from 'react'
import { FiltrosProductos } from '@/types/database'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface FiltrosManillaresProps {
  filtros: FiltrosProductos
  onChange: (filtros: Partial<FiltrosProductos>) => void
}

export function FiltrosManillares({ filtros, onChange }: FiltrosManillaresProps) {
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false)

  // Opciones de filtros
  const materiales = ['Carbono', 'Aluminio', 'Acero', 'Titanio', 'Aleación']
  const colores = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Dorado', 'Plata']

  const handleCheckboxChange = (key: keyof FiltrosProductos, value: any, checked: boolean) => {
    const currentValues = (filtros[key] as any[]) || []
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter((v: any) => v !== value)
    
    onChange({ [key]: newValues.length > 0 ? newValues : undefined })
  }

  const limpiarFiltros = () => {
    onChange({
      soloDestacados: undefined,
      soloNovedades: undefined,
      soloOfertas: undefined,
      precioMin: undefined,
      precioMax: undefined,
      colores: undefined,
      materiales: undefined,
      pesoMin: undefined,
      pesoMax: undefined,
    })
  }

  const cantidadFiltrosActivos = [
    filtros.soloDestacados,
    filtros.soloNovedades, 
    filtros.soloOfertas,
    filtros.precioMin,
    filtros.precioMax,
    filtros.colores?.length,
    filtros.materiales?.length,
    filtros.pesoMin,
    filtros.pesoMax
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Filtros básicos */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onChange({ soloDestacados: !filtros.soloDestacados })}
          className={clsx(
            'px-4 py-2 text-sm border transition-all duration-300',
            filtros.soloDestacados 
              ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
              : 'bg-transparent text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
          )}
        >
          Destacados
        </button>

        <button
          onClick={() => onChange({ soloNovedades: !filtros.soloNovedades })}
          className={clsx(
            'px-4 py-2 text-sm border transition-all duration-300',
            filtros.soloNovedades
              ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
              : 'bg-transparent text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
          )}
        >
          Novedades
        </button>

        <button
          onClick={() => onChange({ soloOfertas: !filtros.soloOfertas })}
          className={clsx(
            'px-4 py-2 text-sm border transition-all duration-300',
            filtros.soloOfertas
              ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
              : 'bg-transparent text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-black'
          )}
        >
          Ofertas
        </button>

        <button
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-800 text-primary-200 
                     hover:bg-primary-700 transition-colors duration-300"
        >
          Más filtros
          {cantidadFiltrosActivos > 0 && (
            <span className="bg-luxury-gold text-luxury-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cantidadFiltrosActivos}
            </span>
          )}
          <ChevronDownIcon 
            className={clsx(
              'h-4 w-4 transition-transform duration-300',
              mostrarFiltrosAvanzados && 'rotate-180'
            )}
          />
        </button>

        {cantidadFiltrosActivos > 0 && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-sm text-red-400 border border-red-400 
                       hover:bg-red-400 hover:text-white transition-all duration-300"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="bg-primary-900 bg-opacity-50 p-6 border border-primary-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Rango de precios */}
            <div className="space-y-3">
              <h4 className="font-semibold text-luxury-gold text-sm">Precio (€)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filtros.precioMin || ''}
                  onChange={(e) => onChange({ 
                    precioMin: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="flex-1 px-3 py-2 bg-primary-800 border border-primary-600 text-sm
                             focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={filtros.precioMax || ''}
                  onChange={(e) => onChange({ 
                    precioMax: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="flex-1 px-3 py-2 bg-primary-800 border border-primary-600 text-sm
                             focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Materiales */}
            <div className="space-y-3">
              <h4 className="font-semibold text-luxury-gold text-sm">Material</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {materiales.map((material) => (
                  <label key={material} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filtros.materiales?.includes(material) || false}
                      onChange={(e) => handleCheckboxChange('materiales', material, e.target.checked)}
                      className="rounded border-primary-600 text-luxury-gold 
                                 focus:ring-luxury-gold focus:ring-offset-primary-900"
                    />
                    <span className="text-primary-200">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="space-y-3">
              <h4 className="font-semibold text-luxury-gold text-sm">Color</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {colores.map((color) => (
                  <label key={color} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filtros.colores?.includes(color) || false}
                      onChange={(e) => handleCheckboxChange('colores', color, e.target.checked)}
                      className="rounded border-primary-600 text-luxury-gold 
                                 focus:ring-luxury-gold focus:ring-offset-primary-900"
                    />
                    <span className="text-primary-200">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-3">
              <h4 className="font-semibold text-luxury-gold text-sm">Peso (kg)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Mín"
                  value={filtros.pesoMin || ''}
                  onChange={(e) => onChange({ 
                    pesoMin: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="flex-1 px-3 py-2 bg-primary-800 border border-primary-600 text-sm
                             focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Máx"
                  value={filtros.pesoMax || ''}
                  onChange={(e) => onChange({ 
                    pesoMax: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="flex-1 px-3 py-2 bg-primary-800 border border-primary-600 text-sm
                             focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
