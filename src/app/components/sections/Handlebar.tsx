"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronRightIcon, CogIcon, BeakerIcon, BoltIcon, PlayIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";

// Interface para productos con imágenes
interface Producto {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  TipoProducto: 'Manillar' | 'Textil';
  Material?: string;
  Peso?: number;
  Color: string;
  Stock: number;
  Destacado: boolean;
  Novedad: boolean;
  EnOferta: boolean;
  PorcentajeDescuento?: number;
  // Sistema de imágenes mejorado
  ImagenPrincipal?: string; // URL de imagen principal
  imagenPrincipal?: {
    RutaCompleta: string;
    RutaThumbnail?: string;
    AltText?: string;
    NombreArchivo: string;
  };
  imagenes?: any[]; // Array de imágenes adicionales
}

export default function HandleBar() {
  const [introVideoEnded, setIntroVideoEnded] = useState(false);
  const [currentSection, setCurrentSection] = useState('intro');
  const [videoEnded, setVideoEnded] = useState(false);
  const [descriptionVideoPlaying, setDescriptionVideoPlaying] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Estados para productos reales
  const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const descriptionVideoRef = useRef<HTMLVideoElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Hotspots para la sección final
  const handlebarHotspots = [
    {
      id: 1,
      position: { top: '25%', left: '30%' },
      title: "STEM INTEGRADO",
      description: "Potencia de carbono T800 con integración aerodinámica completa",
      specs: ["Ángulo: -6° a -17°", "Diámetro: 31.8mm", "Peso: 145g"]
    },
    {
      id: 2,
      position: { top: '45%', left: '20%' },
      title: "DROPS AERODINÁMICOS",
      description: "Geometría optimizada por CFD para máxima eficiencia",
      specs: ["Reach: 75mm", "Drop: 128mm", "Ancho: 400-440mm"]
    },
    {
      id: 3,
      position: { top: '35%', left: '70%' },
      title: "HOODS ERGONÓMICOS",
      description: "Superficie texturizada para control absoluto en cualquier condición",
      specs: ["Material: Fibra texturizada", "Grip: Anti-slip coating", "Confort: +40%"]
    },
    {
      id: 4,
      position: { top: '60%', left: '50%' },
      title: "CABLE ROUTING",
      description: "Sistema interno de cableado para aerodinámica perfecta",
      specs: ["Routing: Interno completo", "Compatibilidad: Di2/eTap", "Sellado: IPX7"]
    }
  ];

// Reemplazar el useEffect de carga de productos con esta versión mejorada:

useEffect(() => {
  const fetchFeaturedProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(false);
      
      
      // Intentar múltiples endpoints posibles
      const endpointsToTry = [
        // Opción 1: Endpoint principal que funciona con imágenes y paginación
        '/api/productos-simple?tipo=Manillares&destacados=true&tamanoPagina=6',
        
        // Opción 2: Fallback con parámetros alternativos
        '/api/productos-simple?TipoProducto=Manillares&Destacado=true&tamanoPagina=6',
        
        // Opción 3: Sin filtros específicos, obtener los primeros 6
        '/api/productos-simple?tipo=Manillares&tamanoPagina=6',
        
        // Opción 4: Endpoint básico sin filtros
        '/api/productos-simple'
      ];
      
      let productsData = [];
      let successfulEndpoint = '';
      
      // Probar cada endpoint hasta que uno funcione
      for (const endpoint of endpointsToTry) {
        try {
          
          const response = await fetch(endpoint);
          
          if (!response.ok) {
            continue;
          }
          
          const data = await response.json();
          
          // Intentar extraer productos de diferentes estructuras posibles
          let products = [];
          
          if (Array.isArray(data)) {
            // Respuesta directa es un array
            products = data;
          } else if (data.data && data.data.datos && Array.isArray(data.data.datos)) {
            // Respuesta tiene estructura { data: { datos: [...] } } - formato del endpoint actualizado
            products = data.data.datos;
          } else if (data.productos && Array.isArray(data.productos)) {
            // Respuesta tiene estructura { productos: [...] }
            products = data.productos;
          } else if (data.data && Array.isArray(data.data)) {
            // Respuesta tiene estructura { data: [...] }
            products = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            // Respuesta tiene estructura { items: [...] }
            products = data.items;
          } else {
            continue;
          }
          
          
          // Limitar a 6 productos si es necesario
          if (products.length > 6) {
            products = products.slice(0, 6);
          }
          
          if (products.length > 0) {
            productsData = products;
            successfulEndpoint = endpoint;
            break;
          } else {
          }
          
        } catch (endpointError) {
          continue;
        }
      }
      
      if (productsData.length > 0) {
        setFeaturedProducts(productsData);
      } else {
        throw new Error('Ningún endpoint devolvió productos válidos');
      }
      
    } catch (error) {
      setProductsError(true);
            
      setFeaturedProducts([
        {
          Id: 1,
          Nombre: "AERO PRO",
          Descripcion: "Manillar aerodinámico de competición con integración total",
          Material: "Carbon T800",
          Peso: 210,
          Precio: 899,
          Color: "Negro/Azul",
          Stock: 15,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: false,
          EnOferta: false,
          ImagenPrincipal: "/images/manillares/aero-pro.jpg"
        },
        {
          Id: 2,
          Nombre: "CLASSIC ROAD",
          Descripcion: "Manillar clásico para carretera con ergonomía perfeccionada", 
          Material: "Carbon T700",
          Peso: 240,
          Precio: 749,
          Color: "Negro Mate",
          Stock: 8,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: true,
          EnOferta: false,
          ImagenPrincipal: "/images/manillares/classic-road.jpg"
        },
        {
          Id: 3,
          Nombre: "SPRINT ELITE",
          Descripcion: "Manillar de alto rendimiento para sprints y climbing",
          Material: "Carbon T1100",
          Peso: 195,
          Precio: 1299,
          Color: "Negro/Dorado",
          Stock: 3,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: false,
          EnOferta: true,
          PorcentajeDescuento: 15,
          ImagenPrincipal: "/images/manillares/sprint-elite.jpg"
        },
        {
          Id: 4,
          Nombre: "TIME TRIAL",
          Descripcion: "Manillar aerodinámico especializado para contrarreloj",
          Material: "Carbon T800",
          Peso: 185,
          Precio: 1099,
          Color: "Negro Brillante",
          Stock: 6,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: true,
          EnOferta: false,
          ImagenPrincipal: "/images/manillares/time-trial.jpg"
        },
        {
          Id: 5,
          Nombre: "ENDURANCE PRO",
          Descripcion: "Manillar de larga distancia con máximo confort",
          Material: "Carbon T700",
          Peso: 265,
          Precio: 649,
          Color: "Negro/Blanco",
          Stock: 12,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: false,
          EnOferta: true,
          PorcentajeDescuento: 20,
          ImagenPrincipal: "/images/manillares/endurance-pro.jpg"
        },
        {
          Id: 6,
          Nombre: "GRAVEL EXPLORER",
          Descripcion: "Manillar versátil para gravel y aventura",
          Material: "Carbon T600",
          Peso: 295,
          Precio: 549,
          Color: "Marrón/Negro",
          Stock: 20,
          TipoProducto: 'Manillar',
          Destacado: true,
          Novedad: false,
          EnOferta: false,
          ImagenPrincipal: "/images/manillares/gravel-explorer.jpg"
        }
      ] as Producto[]);
    } finally {
      setProductsLoading(false);
    }
  };

  fetchFeaturedProducts();
}, []);

  // Intersection Observer SOLO para descripción
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const descriptionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !descriptionVideoPlaying) {
          setDescriptionVideoPlaying(true);
          if (descriptionVideoRef.current) {
            descriptionVideoRef.current.play().catch(console.error);
          }
        }
      });
    }, observerOptions);

    if (descriptionRef.current) {
      descriptionObserver.observe(descriptionRef.current);
    }

    return () => {
      descriptionObserver.disconnect();
    };
  }, [descriptionVideoPlaying]);

  const handleIntroVideoEnd = () => {
    setIntroVideoEnded(true);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Función helper para formatear precio
  const formatPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return {
        original: `€${price}`,
        final: `€${Math.round(discountedPrice)}`,
        hasDiscount: true
      };
    }
    return {
      final: `€${price}`,
      hasDiscount: false
    };
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-white font-orbitron overflow-hidden">
      
      {/* 1. VIDEO INTRODUCCIÓN */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            ref={introVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleIntroVideoEnd}
          >
            <source src="/manillares_videos/Eiros_landing_manillar.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-luxury-black/20"></div>
        </div>

        {/* Título superpuesto */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 1 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold tracking-widest leading-none text-luxury-white">
              EIROS
              <span className="block text-luxury-blue">MANILLARES</span>
            </h1>
            <div className="w-32 h-px bg-luxury-blue mx-auto mt-8"></div>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <AnimatePresence>
          {introVideoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            >
              <motion.button
                onClick={handleScrollToProducts}
                className="flex flex-col items-center text-luxury-white/70 hover:text-luxury-blue transition-colors duration-300"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm tracking-widest mb-2">DESCUBRIR</span>
                <ChevronDownIcon className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. DESCRIPCIÓN BREVE */}
      <section id="products-section" className="py-20 px-6 bg-gradient-to-b from-luxury-black to-luxury-medium/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-luxury-blue/20 backdrop-blur-xl border border-luxury-blue/40 px-6 py-2 mb-8">
              <span className="text-luxury-blue text-sm tracking-widest font-medium">PRECISION ENGINEERED</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-widest mb-8 leading-tight text-luxury-white">
              DISEÑADOS PARA LA
              <span className="block text-luxury-blue">PERFECCIÓN AERODINÁMICA</span>
            </h2>
            
            <p className="text-lg text-luxury-white/80 leading-relaxed max-w-3xl mx-auto mb-12">
              Nuestros manillares combinan la ingeniería más avanzada con materiales de fibra de carbono de 
              grado aeroespacial. Cada curva, cada ángulo ha sido optimizado mediante análisis CFD para 
              entregar el máximo rendimiento aerodinámico sin comprometer el confort o el control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. MUESTRA DE 6 PRODUCTOS REALES */}
      <section className="py-20 px-6 bg-luxury-medium/10">
        <div className="max-w-7xl mx-auto">
          
          {/* Título de productos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-widest mb-6 text-luxury-white">
              MANILLARES
              <span className="text-luxury-blue"> EIROS</span>
            </h3>
            <div className="w-20 h-px bg-luxury-blue mx-auto"></div>
            
            {/* Estado de carga */}
            {productsLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-luxury-white/60 text-sm"
              >
                Cargando productos destacados...
              </motion.div>
            )}
          </motion.div>

          {/* Grid de productos REALES */}
          {!productsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredProducts.map((product, index) => {
                const priceInfo = formatPrice(product.Precio, product.PorcentajeDescuento);
                
                return (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-luxury-black/50 backdrop-blur-xl border border-luxury-white/10 hover:border-luxury-blue/60 transition-all duration-500 overflow-hidden cursor-pointer"
                    onClick={() => window.open(`/productos/manillares/${product.Id}`, '_blank')}
                  >
                    {/* Imagen del producto */}
                    <div className="aspect-square bg-luxury-medium/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent z-10"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 space-y-2">
                        {product.Novedad && (
                          <span className="px-2 py-1 bg-luxury-blue text-luxury-white text-xs font-bold tracking-wide">
                            NUEVO
                          </span>
                        )}
                        {product.EnOferta && product.PorcentajeDescuento && (
                          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold tracking-wide block">
                            -{product.PorcentajeDescuento}%
                          </span>
                        )}
                        {product.Destacado && (
                          <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold tracking-wide block">
                            ⭐ DESTACADO
                          </span>
                        )}
                      </div>
                      
                      <img
                        src={
                          // Prioridad: 1) imagenPrincipal.RutaCompleta, 2) ImagenPrincipal, 3) placeholder
                          product.imagenPrincipal?.RutaCompleta || 
                          product.ImagenPrincipal || 
                          `/images/manillares/placeholder-manillar.jpg`
                        }
                        alt={
                          product.imagenPrincipal?.AltText || 
                          `${product.Nombre} - Manillar premium EirosBCN`
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          // Fallback en cascada
                          if (!img.src.includes('placeholder')) {
                            img.src = '/images/manillares/placeholder-manillar.png';
                          } else {
                            img.src = '/images/manillares/placeholder-manillar.png'; // Fallback final
                          }
                        }}
                      />
                      
                      {/* Overlay con specs REALES */}
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="text-xs text-luxury-white/60 space-y-1">
                          {product.Material && (
                            <div className="flex justify-between">
                              <span>Material:</span>
                              <span className="text-luxury-blue">{product.Material}</span>
                            </div>
                          )}
                          {product.Peso && (
                            <div className="flex justify-between">
                              <span>Peso:</span>
                              <span className="text-luxury-blue">{product.Peso}g</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className={`${product.Stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {product.Stock > 0 ? `${product.Stock} uds` : 'Agotado'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información del producto REAL */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold tracking-wide mb-2 text-luxury-white group-hover:text-luxury-blue transition-colors duration-300">
                        {product.Nombre}
                      </h4>
                      
                      {/* Descripción corta */}
                      {product.Descripcion && (
                        <p className="text-sm text-luxury-white/70 mb-3 line-clamp-2">
                          {product.Descripcion.length > 60 
                            ? `${product.Descripcion.substring(0, 60)}...` 
                            : product.Descripcion
                          }
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          {priceInfo.hasDiscount ? (
                            <>
                              <span className="text-sm text-luxury-white/50 line-through">
                                {priceInfo.original}
                              </span>
                              <span className="text-2xl font-bold text-luxury-blue">
                                {priceInfo.final}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-luxury-white">
                              {priceInfo.final}
                            </span>
                          )}
                        </div>
                        
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="text-luxury-white/70 hover:text-luxury-blue transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/productos/manillares/${product.Id}`, '_blank');
                          }}
                        >
                          <ArrowRightIcon className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Loading skeleton si están cargando productos */}
          {productsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-luxury-black/30 backdrop-blur-xl border border-luxury-white/10 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-luxury-medium/20"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-luxury-white/10 rounded"></div>
                    <div className="h-4 bg-luxury-white/10 rounded w-3/4"></div>
                    <div className="h-8 bg-luxury-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {productsError && !productsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-luxury-white/60 mb-8"
            >
              <p className="mb-2">⚠️ Error cargando productos de la base de datos</p>
              <p className="text-sm">Mostrando productos de ejemplo</p>
            </motion.div>
          )}

          {/* CTA PARA VER TODOS LOS PRODUCTOS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href="/productos/manillares"
              className="inline-flex items-center space-x-4 bg-luxury-blue text-luxury-white px-12 py-4 hover:bg-luxury-blue/80 transition-all duration-300 text-lg font-bold tracking-widest group"
              whileHover={{ scale: 1.05 }}
            >
              <CogIcon className="w-6 h-6" />
              <span>VER TODA LA COLECCIÓN</span>
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.a>
            
            <p className="text-luxury-white/60 text-sm mt-4 tracking-wider">
              {!productsLoading && featuredProducts.length > 0 
                ? `${featuredProducts.length} productos destacados disponibles con configuración personalizada`
                : "Más de 25 modelos disponibles con configuración personalizada"
              }
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* 5. INFORMACIÓN DETALLADA */}
      <section ref={descriptionRef} className="relative h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Video Fibra de Carbono */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-luxury-medium/10 border border-luxury-blue/30 overflow-hidden backdrop-blur-sm">
              <video
                ref={descriptionVideoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
              >
                <source src="/manillares_videos/carbon_fiber.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* Play button overlay cuando no está reproduciendo */}
            {!descriptionVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/50 backdrop-blur-sm">
                <motion.div 
                  className="w-20 h-20 rounded-full border-2 border-luxury-blue flex items-center justify-center bg-luxury-black/30 backdrop-blur-xl"
                  whileHover={{ scale: 1.1, borderColor: '#4A90E2' }}
                  transition={{ duration: 0.3 }}
                >
                  <PlayIcon className="w-8 h-8 text-luxury-blue ml-1" />
                </motion.div>
              </div>
            )}

            {/* Badge informativo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute bottom-4 left-4 bg-luxury-blue/90 backdrop-blur-xl px-4 py-2 border border-luxury-white/20"
            >
              <span className="text-luxury-white text-xs tracking-widest font-bold">CARBON FIBER T800</span>
            </motion.div>
          </motion.div>

          {/* Información Técnica */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block bg-luxury-blue/20 backdrop-blur-xl border border-luxury-blue/40 px-6 py-2 mb-6">
              <span className="text-luxury-blue text-sm tracking-widest font-medium">PRECISION ENGINEERING</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-widest leading-tight text-luxury-white">
              CARBON FIBER
              <span className="block text-luxury-blue">INNOVATION</span>
            </h2>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="border-l-2 border-luxury-blue/40 pl-6"
              >
                <h3 className="text-xl font-bold text-luxury-blue mb-3">CONSTRUCCIÓN MONOCOQUE</h3>
                <p className="text-luxury-white/80 leading-relaxed">
                  Fibras de carbono T800 orientadas mediante análisis FEA para distribuir las fuerzas de manera óptima. 
                  Cada capa está estratégicamente posicionada para maximizar la rigidez lateral mientras mantiene 
                  la compliance vertical necesaria para el confort.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="border-l-2 border-luxury-blue/40 pl-6"
              >
                <h3 className="text-xl font-bold text-luxury-blue mb-3">AERODINÁMICA CFD</h3>
                <p className="text-luxury-white/80 leading-relaxed">
                  Geometría desarrollada mediante dinámica de fluidos computacional y validada en túnel de viento. 
                  Los perfiles optimizados reducen el drag hasta un 12% comparado con manillares convencionales.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                viewport={{ once: true }}
                className="border-l-2 border-luxury-blue/40 pl-6"
              >
                <h3 className="text-xl font-bold text-luxury-blue mb-3">ERGONOMÍA BIOMECÁNICA</h3>
                <p className="text-luxury-white/80 leading-relaxed">
                  Curvas diseñadas mediante análisis 3D de la posición corporal óptima. Múltiples posiciones de agarre 
                  para adaptarse a diferentes fases del pedaleo y condiciones de carrera.
                </p>
              </motion.div>
            </div>

            {/* Estadísticas de rendimiento */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              <div className="bg-luxury-black/40 backdrop-blur-xl border border-luxury-blue/20 p-4 text-center">
                <div className="text-2xl font-bold text-luxury-blue">12%</div>
                <div className="text-xs text-luxury-white/70 tracking-wide">MENOS DRAG</div>
              </div>
              <div className="bg-luxury-black/40 backdrop-blur-xl border border-luxury-blue/20 p-4 text-center">
                <div className="text-2xl font-bold text-luxury-blue">195g</div>
                <div className="text-xs text-luxury-white/70 tracking-wide">PESO MÍNIMO</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. IMAGEN INTERACTIVA CON HOTSPOTS */}
      <section className="relative min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-widest text-luxury-white">
              ANATOMY OF
              <span className="block text-luxury-blue">PERFORMANCE</span>
            </h2>
          </motion.div>

          {/* Contenedor de imagen SIMPLIFICADO */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Estructura mucho más simple */}
            <div 
              className="relative w-full h-[70vh] bg-luxury-black/40 flex items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              
              {/* Imagen principal */}
              <img
                src="/images/manillares/manillar_lateral.png"
                alt="Anatomía del manillar - Componentes técnicos"
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ 
                  display: imageError ? 'none' : 'block',
                  filter: 'brightness(1.1) contrast(1.2)'
                }}
              />
              
              {/* Placeholder mejorado - solo se muestra si hay error */}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-luxury-blue/20 to-luxury-black/60">
                  <div className="text-center text-luxury-white">
                    <div className="text-8xl mb-6 opacity-80">🚴‍♂️</div>
                    <p className="text-2xl tracking-wider font-bold text-luxury-blue mb-4">IMAGEN NO ENCONTRADA</p>
                    <p className="text-lg opacity-80 mb-6">manillar_lateral.png</p>
                    <div className="p-6 bg-luxury-black/60 backdrop-blur-xl border border-luxury-blue/40 max-w-md mx-auto">
                      <p className="text-sm opacity-90 leading-relaxed">
                        Verificar que la imagen existe en: <br/>
                        <span className="font-mono text-luxury-blue font-bold text-base block mt-2">
                          public/images/manillares/manillar_lateral.png
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hotspots */}
              {imageLoaded && !imageError && handlebarHotspots.map((hotspot, index) => (
                <motion.div
                  key={hotspot.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="absolute cursor-pointer z-10"
                  style={{ 
                    top: hotspot.position.top, 
                    left: hotspot.position.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setActiveHotspot(hotspot.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  {/* Indicador del hotspot */}
                  <motion.div
                    animate={{ 
                      scale: activeHotspot === hotspot.id ? 1.3 : 1,
                      opacity: [0.7, 1, 0.7] 
                    }}
                    transition={{ 
                      opacity: { duration: 2, repeat: Infinity },
                      scale: { duration: 0.3 }
                    }}
                    className="w-5 h-5 bg-luxury-blue rounded-full border-3 border-luxury-white shadow-2xl"
                  />
                  
                  {/* Panel de información */}
                  <AnimatePresence>
                    {activeHotspot === hotspot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-80 bg-luxury-black/95 backdrop-blur-xl border border-luxury-blue/50 p-6 shadow-2xl z-50"
                      >
                        <h3 className="text-lg font-bold text-luxury-blue mb-2 tracking-wide">
                          {hotspot.title}
                        </h3>
                        <p className="text-luxury-white/90 text-sm mb-4 leading-relaxed">
                          {hotspot.description}
                        </p>
                        <div className="space-y-2">
                          {hotspot.specs.map((spec, specIndex) => (
                            <div key={specIndex} className="flex items-center text-xs text-luxury-white/80">
                              <div className="w-1.5 h-1.5 bg-luxury-blue mr-3 rounded-full"></div>
                              {spec}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Instrucción de interacción */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {imageLoaded && !imageError ? (
              <p className="text-luxury-white/60 text-sm tracking-widest">
                HOVER SOBRE LOS PUNTOS PARA EXPLORAR COMPONENTES
              </p>
            ) : (
              <p className="text-luxury-white/60 text-sm tracking-widest">
                SUBIR IMAGEN PARA ACTIVAR HOTSPOTS INTERACTIVOS
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* 7. Footer CTA Final */}
      <section className="py-16 px-6 bg-luxury-black border-t border-luxury-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-widest mb-8 text-luxury-white">
              EXPERIENCE
              <span className="block text-luxury-blue">PRECISION</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/productos/manillares"
                className="group flex items-center space-x-4 bg-luxury-blue text-luxury-white px-10 py-4 hover:bg-luxury-blue/80 transition-all duration-300 text-lg font-bold tracking-widest"
                whileHover={{ scale: 1.05 }}
              >
                <CogIcon className="w-6 h-6" />
                <span>VER COLECCIÓN</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.a>
              
              <motion.a
                href="/configurator/handlebar"
                className="group flex items-center space-x-4 bg-luxury-white/10 backdrop-blur-xl border border-luxury-white/30 px-10 py-4 hover:bg-luxury-blue/20 hover:border-luxury-blue/50 transition-all duration-300 text-lg font-medium tracking-widest"
                whileHover={{ scale: 1.05 }}
              >
                <BeakerIcon className="w-6 h-6" />
                <span>CONFIGURADOR</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}