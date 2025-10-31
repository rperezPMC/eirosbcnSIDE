"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronRightIcon, SparklesIcon, ShieldCheckIcon, FireIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";

// Interface para productos textiles con imágenes
interface ProductoTextil {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  TipoProducto: 'Textil';
  Talla?: string;
  Textil?: string;
  Composicion?: string;
  GramajeTela?: number;
  TipoTejido?: string;
  Genero?: 'Hombre' | 'Mujer' | 'Unisex';
  Temporada?: string;
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

export default function Textile() {
  const [currentTechnology, setCurrentTechnology] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Estados para productos reales de BD
  const [featuredProducts, setFeaturedProducts] = useState<ProductoTextil[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const technologies = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "MERINO-TECH BLEND",
      description: "Fusión de fibras naturales y sintéticas",
      detail: "Combinación perfecta entre la suavidad de la lana merino y la durabilidad de fibras técnicas de última generación"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "MOISTURE WICKING",
      description: "Sistema avanzado de evacuación",
      detail: "Tecnología de canales microscópicos que transportan la humedad desde la piel hacia el exterior"
    },
    {
      icon: <FireIcon className="w-8 h-8" />,
      title: "UV PROTECTION 50+",
      description: "Protección solar máxima",
      detail: "Tratamiento incorporado en las fibras que bloquea más del 98% de los rayos UV dañinos"
    }
  ];

  // useEffect para cargar productos destacados desde BD
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(false);
                
        // Intentar múltiples endpoints posibles - AGREGADO INTERCEPTOR
        const endpointsToTry = [
          '/api/interceptor-debug?tipo=Textil&destacados=true&tamanoPagina=4',
          '/api/productos-simple?tipo=Textil&destacados=true&tamanoPagina=4',
          '/api/productos-simple?TipoProducto=Textil&Destacado=true&tamanoPagina=4',
          '/api/productos-simple?tipo=Textil&tamanoPagina=4',
          '/api/productos-simple'
        ];
        
        let productsData = [];
        let successfulEndpoint = '';
        
        for (const endpoint of endpointsToTry) {
          try {
            
            const response = await fetch(endpoint);
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            let products = [];
            if (Array.isArray(data)) {
              products = data;
            } else if (data.data && data.data.datos && Array.isArray(data.data.datos)) {
              products = data.data.datos;
            } else if (data.productos && Array.isArray(data.productos)) {
              products = data.productos;
            } else if (data.data && Array.isArray(data.data)) {
              products = data.data;
            }
            
            if (products.length > 4) products = products.slice(0, 4);
            
            if (products.length > 0) {
              productsData = products;
              successfulEndpoint = endpoint;
              break;
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
        console.error('💥 Error cargando productos textiles:', error);
        setProductsError(true);
        
        // Fallback a datos estáticos para textiles con imágenes REALES
        setFeaturedProducts([
          {
            Id: 101, Nombre: "JERSEY AERO PRO",
            Descripcion: "Maillot aerodinámico con paneles de malla técnica para máxima transpirabilidad",
            Precio: 189, Color: "Negro/Azul", Stock: 25, TipoProducto: 'Textil',
            Talla: "M", Textil: "Poléster técnico", Composicion: "85% Poléster, 15% Elastano",
            Genero: 'Unisex', Destacado: true, Novedad: false, EnOferta: false,
            ImagenPrincipal: "/images/textile/textil_1.png"
          },
          {
            Id: 102, Nombre: "BIBSHORT CARBON",
            Descripcion: "Culotte con compresión inteligente y badana de gel italiano",
            Precio: 159, Color: "Negro", Stock: 18, TipoProducto: 'Textil',
            Talla: "L", Textil: "Lycra Power", Composicion: "72% Nylon, 28% Lycra",
            Genero: 'Unisex', Destacado: true, Novedad: true, EnOferta: false,
            ImagenPrincipal: "/images/textile/textil_2.png"
          },
          {
            Id: 103, Nombre: "JACKET STORM",
            Descripcion: "Chaqueta impermeable con membrana de 3 capas y máxima transpirabilidad",
            Precio: 279, Color: "Negro/Amarillo", Stock: 12, TipoProducto: 'Textil',
            Talla: "M", Textil: "Gore-Tex Active", Composicion: "100% Nylon con membrana",
            Genero: 'Unisex', Destacado: true, Novedad: false, EnOferta: true,
            PorcentajeDescuento: 15, ImagenPrincipal: "/images/textile/textil_3.png"
          },
          {
            Id: 104, Nombre: "BASE LAYER THERMAL",
            Descripcion: "Capa base térmica con fibras de plata para control de temperatura",
            Precio: 89, Color: "Gris", Stock: 30, TipoProducto: 'Textil',
            Talla: "S", Textil: "Merino-Tech", Composicion: "60% Lana Merino, 40% Poléster",
            Genero: 'Unisex', Destacado: true, Novedad: false, EnOferta: false,
            ImagenPrincipal: "/images/textile/textil_4.png"
          }
        ] as ProductoTextil[]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTechnology((prev) => (prev + 1) % technologies.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentProduct((prev) => (prev + 1) % featuredProducts.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

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

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-white font-orbitron overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleVideoLoad}
          >
            <source src="/videos/textile_hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/50 to-luxury-black/80"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="inline-block bg-luxury-blue/20 backdrop-blur-xl border border-luxury-blue/40 px-8 py-3 mb-8">
              <span className="text-luxury-blue text-sm tracking-widest font-medium">INNOVATION IN FABRIC</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-widest mb-8 leading-none">
              SMART<br />
              <span className="text-luxury-blue">TEXTILES</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/productos/textil"
                className="group flex items-center space-x-4 bg-luxury-blue text-luxury-white px-10 py-4 hover:bg-luxury-blue/80 transition-all duration-300 text-lg font-bold tracking-widest"
                whileHover={{ scale: 1.05 }}
              >
                <SparklesIcon className="w-6 h-6" />
                <span>VER COLECCIÓN</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Galería de Productos con datos REALES */}
      <section className="py-32 px-6 bg-gradient-to-b from-luxury-black to-luxury-medium/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-widest mb-8 text-luxury-white">
              TEXTILES<br /><span className="text-luxury-blue">EIROS</span>
            </h2>
          </motion.div>

          {/* Producto Principal Grande CON DATOS REALES */}
          <div className="relative h-[80vh] mb-16 overflow-hidden">
            {!productsLoading && featuredProducts.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 bg-gradient-to-br from-luxury-medium/20 to-luxury-black/60 border border-luxury-blue/30"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={
                        featuredProducts[currentProduct]?.imagenPrincipal?.RutaCompleta || 
                        featuredProducts[currentProduct]?.ImagenPrincipal || 
                        `/images/textile/placeholder-textil.png`
                      }
                      alt={
                        featuredProducts[currentProduct]?.imagenPrincipal?.AltText || 
                        `${featuredProducts[currentProduct]?.Nombre} - Textil técnico premium EirosBCN`
                      }
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/images/textile/placeholder-textil.png';
                      }}
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-luxury-black via-luxury-black/90 to-transparent p-12 z-20">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredProducts[currentProduct]?.Genero && (
                          <span className="text-luxury-blue text-xs tracking-widest font-medium bg-luxury-blue/20 px-3 py-1">
                            {featuredProducts[currentProduct].Genero}
                          </span>
                        )}
                        {featuredProducts[currentProduct]?.Novedad && (
                          <span className="text-luxury-white bg-luxury-blue px-2 py-1 text-xs font-bold tracking-wide">
                            NUEVO
                          </span>
                        )}
                        {featuredProducts[currentProduct]?.EnOferta && (
                          <span className="text-white bg-red-600 px-2 py-1 text-xs font-bold tracking-wide">
                            OFERTA
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-4xl font-bold tracking-wide text-luxury-blue mb-4">
                        {featuredProducts[currentProduct]?.Nombre}
                      </h3>
                      <p className="text-xl text-luxury-white/80 tracking-wide mb-6 max-w-2xl">
                        {featuredProducts[currentProduct]?.Descripcion}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mb-8">
                        {featuredProducts[currentProduct]?.Textil && (
                          <span className="text-xs px-3 py-1 bg-luxury-white/10 backdrop-blur-sm border border-luxury-white/20">
                            {featuredProducts[currentProduct].Textil}
                          </span>
                        )}
                        {featuredProducts[currentProduct]?.Talla && (
                          <span className="text-xs px-3 py-1 bg-luxury-white/10 backdrop-blur-sm border border-luxury-white/20">
                            Talla {featuredProducts[currentProduct].Talla}
                          </span>
                        )}
                        {featuredProducts[currentProduct]?.Color && (
                          <span className="text-xs px-3 py-1 bg-luxury-white/10 backdrop-blur-sm border border-luxury-white/20">
                            {featuredProducts[currentProduct].Color}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-luxury-blue tracking-wider">
                          {(() => {
                            const priceInfo = formatPrice(
                              featuredProducts[currentProduct]?.Precio || 0,
                              featuredProducts[currentProduct]?.PorcentajeDescuento
                            );
                            return (
                              <div className="flex items-center space-x-3">
                                {priceInfo.hasDiscount ? (
                                  <>
                                    <span className="text-lg text-luxury-white/50 line-through">
                                      {priceInfo.original}
                                    </span>
                                    <span>{priceInfo.final}</span>
                                  </>
                                ) : (
                                  <span>{priceInfo.final}</span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        
                        <motion.a
                          href={`/productos/textil/${featuredProducts[currentProduct]?.Id}`}
                          className="inline-flex items-center space-x-3 bg-luxury-blue text-luxury-white px-8 py-3 font-bold tracking-widest hover:bg-luxury-blue/80 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <span>VER DETALLES</span>
                          <ArrowRightIcon className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Loading/Error states */}
            {productsLoading && (
              <div className="absolute inset-0 bg-luxury-black/60 flex items-center justify-center">
                <div className="text-center text-luxury-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-blue mx-auto mb-4"></div>
                  <p>CARGANDO COLECCIÓN...</p>
                </div>
              </div>
            )}

            {/* Indicadores de producto */}
            {featuredProducts.length > 0 && (
              <div className="absolute top-6 right-6 flex space-x-3">
                {featuredProducts.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentProduct ? 'w-12 bg-luxury-blue' : 'w-4 bg-luxury-blue/40'
                    }`}
                    onClick={() => setCurrentProduct(index)}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Grid de Productos Secundarios CON DATOS REALES */}
          {!productsLoading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredProducts.map((product, index) => {
                const priceInfo = formatPrice(product.Precio, product.PorcentajeDescuento);
                return (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer bg-luxury-black/60 backdrop-blur-xl border border-luxury-blue/20 hover:border-luxury-blue/40 transition-all duration-500 overflow-hidden"
                    onClick={() => setCurrentProduct(index)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={
                          product.imagenPrincipal?.RutaCompleta || 
                          product.ImagenPrincipal || 
                          '/images/textile/placeholder-textil.png'
                        }
                        alt={product.imagenPrincipal?.AltText || product.Nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/images/textile/placeholder-textil.png';
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 space-y-2">
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
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-sm font-bold tracking-wide mb-1 group-hover:text-luxury-blue transition-colors duration-300">
                        {product.Nombre}
                      </h4>
                      {product.Genero && (
                        <p className="text-luxury-white/60 text-xs tracking-wide mb-2">
                          {product.Genero} • {product.Talla}
                        </p>
                      )}
                      <div className="text-luxury-blue font-bold text-sm tracking-wider">
                        {priceInfo.hasDiscount ? (
                          <>
                            <span className="text-xs text-luxury-white/50 line-through mr-2">
                              {priceInfo.original}
                            </span>
                            {priceInfo.final}
                          </>
                        ) : (
                          priceInfo.final
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA Principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href="/productos/textil"
              className="inline-flex items-center space-x-4 bg-luxury-blue text-luxury-white px-12 py-4 hover:bg-luxury-blue/80 transition-all duration-300 text-lg font-bold tracking-widest group"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-6 h-6" />
              <span>VER TODA LA COLECCIÓN</span>
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Resto de secciones (tecnología, stats) - mantenidas igual */}
      <section className="py-24 px-6 bg-gradient-to-b from-luxury-medium/10 to-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="inline-block bg-luxury-blue/20 backdrop-blur-xl border border-luxury-blue/40 px-8 py-3 mb-8">
                <span className="text-luxury-blue text-sm tracking-widest font-medium">FIBER SCIENCE</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTechnology}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6 }}
                  className="border-l-2 border-luxury-blue/40 pl-8"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-luxury-blue mr-4">
                      {technologies[currentTechnology].icon}
                    </div>
                    <h3 className="text-2xl font-bold tracking-wide">
                      {technologies[currentTechnology].title}
                    </h3>
                  </div>
                  <p className="text-lg text-luxury-white/80 mb-4">
                    {technologies[currentTechnology].description}
                  </p>
                  <p className="text-luxury-white/60 leading-relaxed">
                    {technologies[currentTechnology].detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-luxury-medium/20 to-luxury-black border border-luxury-blue/30 flex items-center justify-center">
                <div className="text-8xl text-luxury-blue/50">
                  <SparklesIcon className="w-32 h-32" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
