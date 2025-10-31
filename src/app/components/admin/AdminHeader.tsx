'use client'

import { signOut, useSession } from 'next-auth/react'

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-luxury-grey-900 border-b border-luxury-grey-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-montserrat font-bold text-white">
            Panel de Administración
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Info usuario */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-xs text-luxury-grey-400">{session?.user?.email}</p>
          </div>

          {/* Botón cerrar sesión */}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-grey-800 hover:bg-luxury-grey-700 text-luxury-grey-300 hover:text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}
