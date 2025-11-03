import { MountainProductCardWithData } from '@/app/components/productos/MountainProductCardWithModal'
import { obtenerProductosMountainFromJson } from '@/lib/services/mountainProductService.json'
import { MountainOrganigrama } from '@/app/components/productos/MountainOrganigram'

export default async function MountainPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params   // 👈 se debe await porque es Promise

  const productos = await obtenerProductosMountainFromJson(locale)

  return (
    <div className="w-full bg-luxury-black">

      {/* Video Hero Section */}
      <section id='mountain-hero-section-video' className="w-full flex justify-center bg-black mt-16 px-4 md:mt-20">
        <div className="w-[92%] md:w-[85%] overflow-hidden rounded-xl">
          <div className="aspect-[4/5] md:aspect-[5/2]">
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="/videos/mountain/heroSection_mountain.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Sección de navegacion */}
      <section id='mountain-navigation-section' className="w-full justify-center mt-8 mb-12 md:mt-2 md:mb-10">
        <MountainOrganigrama />
      </section>

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
