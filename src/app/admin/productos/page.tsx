'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  image: string
  status: 'active' | 'draft' | 'out-of-stock'
}

export default function ProductosPage() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Mountain Handlebar Pro',
      category: 'Mountain',
      price: 89.99,
      stock: 24,
      image: '/uploads/producto1.jpg',
      status: 'active'
    },
    // Más productos de ejemplo...
  ])

  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'out-of-stock'>('all')

  const filteredProducts = products.filter(p => filter === 'all' || p.status === filter)

  const statusConfig = {
    active: { label: 'Activo', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    draft: { label: 'Borrador', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    'out-of-stock': { label: 'Sin Stock', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  }

  return (
    <div className="min-h-screen bg-luxury-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-luxury-white mb-2">
              Gestión de Productos
            </h1>
            <p className="text-luxury-grey">
              Administra tu catálogo de productos
            </p>
          </div>
          <Link href="/admin/productos/nuevo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-glow transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Producto
            </motion.button>
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <span className="text-luxury-grey font-medium">Filtrar por:</span>
            {(['all', 'active', 'draft', 'out-of-stock'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-luxury-navy text-luxury-grey hover:bg-luxury-medium'
                }`}
              >
                {status === 'all' ? 'Todos' : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-all duration-300"
            >
              {/* Imagen del producto */}
              <div className="relative h-48 bg-luxury-navy overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxury-black/50" />
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[product.status].color}`}>
                    {statusConfig[product.status].label}
                  </span>
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-luxury-white mb-1">
                    {product.name}
                  </h3>
                  <p className="text-luxury-grey text-sm">{product.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-luxury-white">
                      €{product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-luxury-grey">Stock: {product.stock}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-primary-800/30">
                  <Link href={`/admin/productos/${product.id}/edit`} className="flex-1">
                    <button className="w-full bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg hover:bg-primary-500/30 transition-colors duration-300 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                  </Link>
                  <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary-900/50 p-6 rounded-full">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-luxury-grey text-center">
                No hay productos que coincidan con el filtro seleccionado
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
