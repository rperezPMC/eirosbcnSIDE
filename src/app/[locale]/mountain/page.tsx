import { MountainProductCardWithData } from '@/app/components/productos/MountainProductCardWithModal'
import { obtenerProductosMountainFromJson } from '@/lib/services/mountainProductService.json'

export default async function MountainPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params   // 👈 se debe await porque es Promise

  const productos = await obtenerProductosMountainFromJson(locale)

  return (
    <div className="w-full bg-black">
      <section id="products" className="w-full">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <MountainProductCardWithData key={producto.id} product={producto} />
          ))
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-white text-xl font-montserrat">
              No hay productos Mountain disponibles
            </p>
            <p className="text-gray-400 text-sm font-montserrat mt-2">
              (Revisa JSON en <code>src/data</code>)
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
