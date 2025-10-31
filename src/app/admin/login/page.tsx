'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales incorrectas')
      } else {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <svg className="w-12 h-14 text-luxury-teal" viewBox="0 0 28 32" fill="currentColor">
            <path d="M14 0L28 8L14 16L0 8L14 0Z" />
            <path d="M14 16L28 24L14 32L0 24L14 16Z" opacity="0.6" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-montserrat font-bold text-white text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-luxury-grey-300 text-center mb-8 font-saira">
          Acceso solo para administradores
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-luxury-grey-300 mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-grey-900 border border-luxury-grey-700 rounded-lg text-white placeholder-luxury-grey-500 focus:outline-none focus:border-luxury-teal transition-colors"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-luxury-grey-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-grey-900 border border-luxury-grey-700 rounded-lg text-white placeholder-luxury-grey-500 focus:outline-none focus:border-luxury-teal transition-colors"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-teal hover:bg-luxury-teal/90 text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
