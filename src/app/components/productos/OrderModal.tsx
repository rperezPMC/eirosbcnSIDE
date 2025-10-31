'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    selectedColor: string
    selectedColorId: number | null
    selectedSize: string
    selectedWeight: string
  }
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const t = useTranslations('Submit')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nombreCliente: '',
    email: '',
    telefono: '',
    pais: '',
    ciudad: '',
    mensaje: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bikeComponentId: parseInt(product.id),
          colorSeleccionado: product.selectedColor,
          colorId: product.selectedColorId,
          potenciaSeleccionada: product.selectedSize,
          pesoSeleccionado: product.selectedWeight,
          locale
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({
            nombreCliente: '',
            email: '',
            telefono: '',
            pais: '',
            ciudad: '',
            mensaje: ''
          })
        }, 3000)
      } else {
        setError(data.error || t('error.generic'))
      }
    } catch (err) {
      setError(t('error.connection'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Modal centrado con flexbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] my-auto overflow-y-auto bg-[#1a1a1a] rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl text-[#50a1b0] font-montserrat">
                {t('title')}
              </h2>
              <button onClick={onClose} className="text-white hover:text-[#50a1b0] transition-colors">
                <X size={24} />
              </button>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-[#50a1b0]">✓</div>
                <p className="text-xl text-[#50a1b0] font-montserrat mb-2">
                  {t('success.title')}
                </p>
                <p className="text-gray-400">
                  {t('success.message')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg mb-6">
                  <p className="text-white font-montserrat mb-2">{product.name}</p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>{t('productDetails.color')}: {product.selectedColor}</p>
                    <p>{t('productDetails.potency')}: {product.selectedSize}</p>
                    <p>{t('productDetails.weight')}: {product.selectedWeight}</p>
                    <p className="text-[#50a1b0] font-semibold text-lg mt-2">{product.price} €</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <input
                  type="text"
                  required
                  placeholder={t('form.fullName')}
                  value={formData.nombreCliente}
                  onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none transition-colors"
                />

                <input
                  type="email"
                  required
                  placeholder={t('form.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none transition-colors"
                />

                <input
                  type="tel"
                  placeholder={t('form.phone')}
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none transition-colors"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder={t('form.country')}
                    value={formData.pais}
                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                    className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none transition-colors"
                  />
                  <input
                    type="text"
                    required
                    placeholder={t('form.city')}
                    value={formData.ciudad}
                    onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none transition-colors"
                  />
                </div>

                <textarea
                  placeholder={t('form.message')}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  rows={4}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#50a1b0] outline-none resize-none transition-colors"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full bg-[#50a1b0] text-white py-3 rounded-lg font-semibold font-montserrat hover:bg-[#5bb5c5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? t('buttons.sending') : t('buttons.submit')}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
