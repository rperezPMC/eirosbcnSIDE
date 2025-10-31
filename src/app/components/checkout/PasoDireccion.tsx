'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCheckout } from '../context/CheckoutContext'

export const PasoDireccion = () => {
  const { datosCheckout, actualizarDatosCheckout, siguientePaso, validarPaso } = useCheckout()
  const [errores, setErrores] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    const nuevosErrores: Record<string, string> = {}
    
    if (!datosCheckout.direccionEnvio.nombre) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (!datosCheckout.direccionEnvio.apellido) {
      nuevosErrores.apellido = 'El apellido es obligatorio'
    }
    if (!datosCheckout.direccionEnvio.email) {
      nuevosErrores.email = 'El email es obligatorio'
    }
    if (!datosCheckout.direccionEnvio.direccion) {
      nuevosErrores.direccion = 'La dirección es obligatoria'
    }
    if (!datosCheckout.direccionEnvio.ciudad) {
      nuevosErrores.ciudad = 'La ciudad es obligatoria'
    }
    if (!datosCheckout.direccionEnvio.codigoPostal) {
      nuevosErrores.codigoPostal = 'El código postal es obligatorio'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      siguientePaso()
    }
  }

  const handleInputChange = (campo: string, valor: string) => {
    actualizarDatosCheckout({
      direccionEnvio: {
        ...datosCheckout.direccionEnvio,
        [campo]: valor
      }
    })
    
    // Limpiar error del campo si existe
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-white/5 border border-luxury-gold/20 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-luxury-gold mb-6 font-orbitron">
        DIRECCIÓN DE ENVÍO
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-luxury-white mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={datosCheckout.direccionEnvio.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
                errores.nombre ? 'border-red-500' : 'border-luxury-gold/30'
              }`}
              placeholder="Tu nombre"
            />
            {errores.nombre && (
              <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-white mb-2">
              Apellido *
            </label>
            <input
              type="text"
              value={datosCheckout.direccionEnvio.apellido}
              onChange={(e) => handleInputChange('apellido', e.target.value)}
              className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
                errores.apellido ? 'border-red-500' : 'border-luxury-gold/30'
              }`}
              placeholder="Tu apellido"
            />
            {errores.apellido && (
              <p className="text-red-400 text-xs mt-1">{errores.apellido}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-luxury-white mb-2">
            Email *
          </label>
          <input
            type="email"
            value={datosCheckout.direccionEnvio.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
              errores.email ? 'border-red-500' : 'border-luxury-gold/30'
            }`}
            placeholder="tu@email.com"
          />
          {errores.email && (
            <p className="text-red-400 text-xs mt-1">{errores.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-luxury-white mb-2">
            Dirección *
          </label>
          <input
            type="text"
            value={datosCheckout.direccionEnvio.direccion}
            onChange={(e) => handleInputChange('direccion', e.target.value)}
            className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
              errores.direccion ? 'border-red-500' : 'border-luxury-gold/30'
            }`}
            placeholder="Calle, número, piso..."
          />
          {errores.direccion && (
            <p className="text-red-400 text-xs mt-1">{errores.direccion}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-luxury-white mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              value={datosCheckout.direccionEnvio.ciudad}
              onChange={(e) => handleInputChange('ciudad', e.target.value)}
              className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
                errores.ciudad ? 'border-red-500' : 'border-luxury-gold/30'
              }`}
              placeholder="Barcelona"
            />
            {errores.ciudad && (
              <p className="text-red-400 text-xs mt-1">{errores.ciudad}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-white mb-2">
              Código Postal *
            </label>
            <input
              type="text"
              value={datosCheckout.direccionEnvio.codigoPostal}
              onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
              className={`w-full p-3 bg-luxury-white/10 border rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold ${
                errores.codigoPostal ? 'border-red-500' : 'border-luxury-gold/30'
              }`}
              placeholder="08001"
            />
            {errores.codigoPostal && (
              <p className="text-red-400 text-xs mt-1">{errores.codigoPostal}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-luxury-white mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={datosCheckout.direccionEnvio.telefono}
            onChange={(e) => handleInputChange('telefono', e.target.value)}
            className="w-full p-3 bg-luxury-white/10 border border-luxury-gold/30 rounded-lg text-luxury-white placeholder-luxury-white/50 focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-luxury-gold text-luxury-black px-8 py-3 font-bold tracking-wide hover:bg-luxury-gold/90 transition-colors duration-300"
          >
            CONTINUAR
          </button>
        </div>
      </form>
    </motion.div>
  )
}
