import { MountainOrganigrama } from '@/app/components/productos/MountainOrganigram'
// TEMPORAL: Comentamos la llamada a BD
// import { obtenerProductosMountain } from '@/lib/services/mountainProductService'
import { MountainProductCardWithData } from '@/app/components/productos/MountainProductCardWithModal'

interface MountainPageProps {
  params: Promise<{ locale: string }>
}

export default async function MountainPage({ params }: MountainPageProps) {
  const { locale } = await params
    
  // TEMPORAL: Comentamos la consulta a BD que no puede conectar
  // const productos = await obtenerProductosMountain(locale)
  const productos: any[] = [] // Array vacío temporal

  return (
    <div className="w-full bg-black">

      {/* Video hero section */}
      <section id='mountain-hero-section-video' className="w-full flex justify-center bg-black mt-16 md:mt-20">
        <div className="w-[92%] md:w-[85%] overflow-hidden rounded-xl">
          <div className="aspect-[4/5] md:aspect-[5/2]">
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="/videos/mountain/heroSection_mountain.mp4" type="video/mp4"/>
            </video>
          </div>
        </div>
      </section>

      {/* Sección de navegacion */}
      <section id='mountain-navigation-section' className="w-full justify-center mt-8 mb-12 md:mt-2 md:mb-10">
        <MountainOrganigrama />
      </section>

      {/* Sección de productos */}
      <section id='products' className="w-full">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <MountainProductCardWithData 
              key={producto.id} 
              product={producto} 
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-white text-xl font-montserrat">
              Próximamente: Productos Mountain
            </p>
            <p className="text-gray-400 text-sm font-montserrat mt-2">
              (Base de datos en configuración)
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
