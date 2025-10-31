'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Color {
  id: string
  name: string
  hex: string
  category: string
}

export default function ColoresPage() {
  const [colors, setColors] = useState<Color[]>([
    { id: '1', name: 'Negro Mate', hex: '#000000', category: 'Básicos' },
    { id: '2', name: 'Azul Royal', hex: '#05308C', category: 'Premium' },
    { id: '3', name: 'Teal', hex: '#94c4c8', category: 'Premium' },
    { id: '4', name: 'Gris Platino', hex: '#a7a7a7', category: 'Básicos' },
  ])

  const [isAddingColor, setIsAddingColor] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', category: 'Básicos' })

  const categories = ['Básicos', 'Premium', 'Metálicos', 'Mate']

  const handleAddColor = () => {
    if (newColor.name) {
      setColors([...colors, { ...newColor, id: Date.now().toString() }])
      setNewColor({ name: '', hex: '#000000', category: 'Básicos' })
      setIsAddingColor(false)
    }
  }

  const handleEditColor = (color: Color) => {
    setEditingColor(color)
  }

  const handleUpdateColor = () => {
    if (editingColor) {
      setColors(colors.map(c => c.id === editingColor.id ? editingColor : c))
      setEditingColor(null)
    }
  }

  const handleDeleteColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id))
  }

  const groupedColors = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = []
    }
    acc[color.category].push(color)
    return acc
  }, {} as Record<string, Color[]>)

  return (
    <div className="min-h-screen bg-luxury-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-luxury-white mb-2">
              Gestión de Colores
            </h1>
            <p className="text-luxury-grey">
              Administra la paleta de colores de tus productos
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingColor(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-glow transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Color
          </motion.button>
        </div>

        {/* Modal para añadir color */}
        <AnimatePresence>
          {isAddingColor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsAddingColor(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-8 max-w-md w-full space-y-6"
              >
                <h2 className="text-2xl font-montserrat font-bold text-luxury-white">
                  Añadir Nuevo Color
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Nombre del Color
                    </label>
                    <input
                      type="text"
                      value={newColor.name}
                      onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                      className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      placeholder="Ej: Azul Celeste"
                    />
                  </div>

                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Código Hexadecimal
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={newColor.hex}
                        onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                        className="w-16 h-12 rounded-xl cursor-pointer border-2 border-primary-800/30"
                      />
                      <input
                        type="text"
                        value={newColor.hex}
                        onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                        className="flex-1 bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Categoría
                    </label>
                    <select
                      value={newColor.category}
                      onChange={(e) => setNewColor({ ...newColor, category: e.target.value })}
                      className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsAddingColor(false)}
                    className="flex-1 bg-luxury-navy text-luxury-white px-6 py-3 rounded-xl font-medium hover:bg-luxury-medium transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddColor}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-glow transition-all duration-300"
                  >
                    Añadir Color
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal para editar color */}
        <AnimatePresence>
          {editingColor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditingColor(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-8 max-w-md w-full space-y-6"
              >
                <h2 className="text-2xl font-montserrat font-bold text-luxury-white">
                  Editar Color
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Nombre del Color
                    </label>
                    <input
                      type="text"
                      value={editingColor.name}
                      onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                      className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Código Hexadecimal
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={editingColor.hex}
                        onChange={(e) => setEditingColor({ ...editingColor, hex: e.target.value })}
                        className="w-16 h-12 rounded-xl cursor-pointer border-2 border-primary-800/30"
                      />
                      <input
                        type="text"
                        value={editingColor.hex}
                        onChange={(e) => setEditingColor({ ...editingColor, hex: e.target.value })}
                        className="flex-1 bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-luxury-grey font-medium mb-2">
                      Categoría
                    </label>
                    <select
                      value={editingColor.category}
                      onChange={(e) => setEditingColor({ ...editingColor, category: e.target.value })}
                      className="w-full bg-luxury-navy border border-primary-800/30 rounded-xl px-4 py-3 text-luxury-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingColor(null)}
                    className="flex-1 bg-luxury-navy text-luxury-white px-6 py-3 rounded-xl font-medium hover:bg-luxury-medium transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateColor}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-glow transition-all duration-300"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paleta de colores agrupada por categoría */}
        <div className="space-y-6">
          {Object.entries(groupedColors).map(([category, categoryColors]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-2xl font-montserrat font-bold text-luxury-white">
                {category}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categoryColors.map((color) => (
                  <motion.div
                    key={color.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-luxury-navy border border-primary-800/30 rounded-xl p-4 space-y-3 hover:border-primary-500/50 transition-all duration-300 group"
                  >
                    {/* Muestra del color */}
                    <div
                      className="w-full aspect-square rounded-lg shadow-lg group-hover:shadow-glow transition-shadow duration-300"
                      style={{ backgroundColor: color.hex }}
                    />

                    {/* Información del color */}
                    <div className="space-y-1">
                      <p className="font-medium text-luxury-white text-sm truncate">
                        {color.name}
                      </p>
                      <p className="text-luxury-grey text-xs font-mono">
                        {color.hex.toUpperCase()}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditColor(color)}
                        className="flex-1 bg-primary-500/20 text-primary-400 px-3 py-2 rounded-lg hover:bg-primary-500/30 transition-colors duration-300 text-xs font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteColor(color.id)}
                        className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {colors.length === 0 && (
          <div className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary-900/50 p-6 rounded-full">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <p className="text-luxury-grey text-center">
                No hay colores en la paleta todavía
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
