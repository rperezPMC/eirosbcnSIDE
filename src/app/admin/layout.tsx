// src/app/admin/layout.tsx
import { Providers } from './providers'
import { AdminLayoutContent } from './admin-layout-content'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Providers>
  )
}
