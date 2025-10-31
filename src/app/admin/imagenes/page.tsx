'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Image {
  id: string
  url: string
  name: string
  size: string
  uploadedAt: string
}

export default function ImagenesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
  }

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const deleteSelectedImages = () => {
    setSelectedImages(new Set())
  }

  return (
    <div className="min-h-screen bg-luxury-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-luxury-white mb-2">
              Gestión de Imágenes
            </h1>
            <p className="text-luxury-grey">
              Administra las imágenes de tus productos
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botones de vista */}
            <div className="bg-luxury-navy rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-luxury-grey hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-luxury-grey hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {selectedImages.size > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={deleteSelectedImages}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar ({selectedImages.size})
              </motion.button>
            )}
          </div>
        </div>

        {/* Zona de carga */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-gradient-to-br from-luxury-dark to-luxury-navy border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-primary-800/30 hover:border-primary-500/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              className="bg-primary-900/50 p-6 rounded-full"
            >
              <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </motion.div>
            
            <div className="text-center">
              <p className="text-xl font-medium text-luxury-white mb-2">
                {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra y suelta imágenes'}
              </p>
              <p className="text-luxury-grey text-sm">
                o haz click para seleccionar archivos
              </p>
            </div>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-xl font-medium cursor-pointer shadow-lg hover:shadow-glow transition-all duration-300"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              Seleccionar Imágenes
            </motion.label>

            <p className="text-luxury-grey text-xs">
              PNG, JPG, WebP hasta 10MB
            </p>
          </div>
        </motion.div>

        {/* Grid/List de imágenes */}
        {images.length === 0 ? (
          <div className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary-900/50 p-6 rounded-full">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-luxury-grey text-center">
                No hay imágenes cargadas todavía
              </p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => toggleImageSelection(image.id)}
                  className={`relative aspect-square bg-gradient-to-br from-luxury-dark to-luxury-navy border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedImages.has(image.id)
                      ? 'border-primary-500 ring-4 ring-primary-500/20'
                      : 'border-primary-800/30 hover:border-primary-500/50'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedImages.has(image.id)
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-luxury-navy/80 border-white/30 backdrop-blur-sm'
                    }`}>
                      {selectedImages.has(image.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Placeholder para la imagen */}
                  <div className="w-full h-full flex items-center justify-center bg-luxury-navy">
                    <svg className="w-12 h-12 text-luxury-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  )
}
