'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductoForm {
  TipoProducto: 'Manillares' | 'Textil'
  Nombre: string
  Descripcion: string
  Precio: number
  Color: string
  Stock: number
  SKU: string
  Destacado: boolean
  Novedad: boolean
  EnOferta: boolean
  PorcentajeDescuento: number
  // Campos Manillares
  Material?: string
  Peso?: number
  Ancho?: number
  Diametro?: number
  Rise?: number
  Backsweep?: number
  Upsweep?: number
  // Campos Textil
  Talla?: string
  Textil?: string
  Composicion?: string
  Genero?: 'Hombre' | 'Mujer' | 'Unisex'
  Temporada?: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno'
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductoForm>({
    TipoProducto: 'Manillares',
    Nombre: '',
    Descripcion: '',
    Precio: 0,
    Color: '',
    Stock: 0,
    SKU: '',
    Destacado: false,
    Novedad: false,
    EnOferta: false,
    PorcentajeDescuento: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        router.push('/admin/productos')
      } else {
        setError(result.error || 'Error al crear el producto')
      }
    } catch (err) {
      setError('Error al crear el producto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
             : type === 'number' ? parseFloat(value) || 0
             : value
    }))
  }

  return (
    <div className="min-h-screen bg-luxury-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/productos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-luxury-navy text-luxury-white p-3 rounded-xl hover:bg-luxury-medium transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.button>
          </Link>
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-luxury-white">
              Nuevo Producto
            </h1>
            <p className="text-luxury-grey">
              Añade un nuevo producto al catálogo
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-8 space-y-6"
        >
          {/* Selección de tipo de producto */}
          <div className="space-y-4">
            <h2 className="text-2xl font-montserrat font-bold text-luxury-white border-b border-primary-800/30 pb-4">
              Tipo de Producto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <input
                  type="radio"
                  name="TipoProducto"
                  value="Manillares"
                  checked={formData.TipoProducto === 'Manillares'}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="bg-luxury-navy border-2 border-primary-800/30 rounded-xl p-6 cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-500/10 transition-all duration-300 hover:border-primary-500/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary-800 peer-checked:border-primary-500 peer-checked:bg-primary-500 flex items-center justify-center">
                      {formData.TipoProducto === 'Manillares' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-luxury-white text-lg">Manillares</p>
                      <p className="text-sm text-luxury-grey">Componentes de carbono para bicicletas</p>
                    </div>
                  </div>
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  name="TipoProducto"
                  value="Textil"
                  checked={formData.TipoProducto === 'Textil'}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="bg-luxury-navy border-2 border-primary-800/30 rounded-xl p-6 cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-500/10 transition-all duration-300 hover:border-primary-500/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary-800 peer-checked:border-primary-500 peer-checked:bg-primary-500 flex items-center justify-center">
                      {formData.TipoProducto === 'Textil' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-luxury-white text-lg">Textil</p>
                      <p className="text-sm text-luxury-grey">Ropa y accesorios para ciclismo</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Información básica */}
          <div className="space-y-6">
            <h2 className="text-2xl font-montserrat font-bold text-luxury-white border-b border-primary-800/30 pb-4">
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-luxury-grey font-medium mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  required
                  className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Ej: Mountain Handlebar Pro"
                />
              </div>

              <div>
                <label className="block text-luxury-grey font-medium mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleChange}
                  className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <label className="block text-luxury-grey font-medium mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="Color"
                  value={formData.Color}
                  onChange={handleChange}
                  className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Negro, Azul, etc."
                />
              </div>

              <div>
                <label className="block text-luxury-grey font-medium mb-2">
                  Precio (€) *
                </label>
                <input
                  type="number"
                  name="Precio"
                  value={formData.Precio || ''}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="89.99"
                />
              </div>

              <div>
                <label className="block text-luxury-grey font-medium mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="Stock"
                  value={formData.Stock || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="24"
                />
              </div>
            </div>

            <div>
              <label className="block text-luxury-grey font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="Descripcion"
                value={formData.Descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>
          </div>

          {/* Campos específicos Manillares */}
          {formData.TipoProducto === 'Manillares' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-montserrat font-bold text-luxury-white border-b border-primary-800/30 pb-4">
                Especificaciones Técnicas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Material</label>
                  <input
                    type="text"
                    name="Material"
                    value={formData.Material || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Ej: Carbono UD"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Peso (g)</label>
                  <input
                    type="number"
                    name="Peso"
                    value={formData.Peso || ''}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="230"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Ancho (mm)</label>
                  <input
                    type="number"
                    name="Ancho"
                    value={formData.Ancho || ''}
                    onChange={handleChange}
                    step="1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="780"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Diámetro (mm)</label>
                  <input
                    type="number"
                    name="Diametro"
                    value={formData.Diametro || ''}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="31.8"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Rise (mm)</label>
                  <input
                    type="number"
                    name="Rise"
                    value={formData.Rise || ''}
                    onChange={handleChange}
                    step="1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Backsweep (°)</label>
                  <input
                    type="number"
                    name="Backsweep"
                    value={formData.Backsweep || ''}
                    onChange={handleChange}
                    step="1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="9"
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Upsweep (°)</label>
                  <input
                    type="number"
                    name="Upsweep"
                    value={formData.Upsweep || ''}
                    onChange={handleChange}
                    step="1"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Campos específicos Textil */}
          {formData.TipoProducto === 'Textil' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-montserrat font-bold text-luxury-white border-b border-primary-800/30 pb-4">
                Detalles Textil
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Talla</label>
                  <input
                    type="text"
                    name="Talla"
                    value={formData.Talla || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="M, L, XL..."
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Tipo Textil</label>
                  <input
                    type="text"
                    name="Textil"
                    value={formData.Textil || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Camiseta, Maillot, etc."
                  />
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Género</label>
                  <select
                    name="Genero"
                    value={formData.Genero || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-luxury-grey font-medium mb-2">Temporada</label>
                  <select
                    name="Temporada"
                    value={formData.Temporada || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Primavera">Primavera</option>
                    <option value="Verano">Verano</option>
                    <option value="Otoño">Otoño</option>
                    <option value="Invierno">Invierno</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-luxury-grey font-medium mb-2">Composición</label>
                  <input
                    type="text"
                    name="Composicion"
                    value={formData.Composicion || ''}
                    onChange={handleChange}
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Ej: 100% Algodón, 80% Poliéster 20% Elastano"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Estado y opciones */}
          <div className="space-y-6">
            <h2 className="text-2xl font-montserrat font-bold text-luxury-white border-b border-primary-800/30 pb-4">
              Opciones de Venta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 bg-luxury-navy rounded-xl p-4 cursor-pointer hover:bg-luxury-medium transition-colors duration-300">
                <input
                  type="checkbox"
                  name="Destacado"
                  checked={formData.Destacado}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-primary-800 text-primary-500 focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-luxury-white">Producto Destacado</p>
                  <p className="text-sm text-luxury-grey">Aparecerá en la página principal</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-luxury-navy rounded-xl p-4 cursor-pointer hover:bg-luxury-medium transition-colors duration-300">
                <input
                  type="checkbox"
                  name="Novedad"
                  checked={formData.Novedad}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-primary-800 text-primary-500 focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-luxury-white">Novedad</p>
                  <p className="text-sm text-luxury-grey">Marcado como producto nuevo</p>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-luxury-navy rounded-xl p-4 cursor-pointer hover:bg-luxury-medium transition-colors duration-300">
                <input
                  type="checkbox"
                  name="EnOferta"
                  checked={formData.EnOferta}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-primary-800 text-primary-500 focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-luxury-white">En Oferta</p>
                  <p className="text-sm text-luxury-grey">Mostrar badge de oferta</p>
                </div>
              </label>

              {formData.EnOferta && (
                <div>
                  <label className="block text-luxury-grey font-medium mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    name="PorcentajeDescuento"
                    value={formData.PorcentajeDescuento}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="15"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6 border-t border-primary-800/30">
            <Link href="/admin/productos" className="flex-1">
              <button
                type="button"
                className="w-full bg-luxury-navy text-luxury-white px-6 py-3 rounded-xl font-medium hover:bg-luxury-medium transition-colors duration-300"
              >
                Cancelar
              </button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando...
                </span>
              ) : (
                'Crear Producto'
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
