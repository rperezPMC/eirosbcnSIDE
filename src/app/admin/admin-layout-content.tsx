'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si no está autenticado y no está en la página de login, redirigir
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
    
    // Si está autenticado y está en login, redirigir al dashboard
    if (status === 'authenticated' && pathname === '/admin/login') {
      router.push('/admin')
    }
  }, [status, pathname, router])

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Permitir acceso a la página de login sin autenticación
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Para otras rutas, verificar autenticación
  if (!session) {
    return null // El useEffect ya redirigirá
  }

  return <>{children}</>
}
