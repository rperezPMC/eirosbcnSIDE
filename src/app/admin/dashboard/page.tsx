'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  const stats = [
    {
      name: 'Total Productos',
      value: '24',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: '/admin/productos',
      gradient: 'from-primary-500 to-primary-700',
      change: '+12%'
    },
    {
      name: 'Imágenes',
      value: '156',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/imagenes',
      gradient: 'from-luxury-teal to-luxury-blue',
      change: '+8%'
    },
    {
      name: 'Colores',
      value: '12',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      href: '/admin/colores',
      gradient: 'from-accent-500 to-accent-700',
      change: '+3'
    },
  ]

  const quickActions = [
    {
      name: 'Nuevo Producto',
      description: 'Crear un nuevo producto mountain',
      href: '/admin/productos/nuevo',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      name: 'Subir Imágenes',
      description: 'Cargar nuevas imágenes de productos',
      href: '/admin/imagenes/upload',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      gradient: 'from-luxury-teal to-luxury-blue'
    },
    {
      name: 'Gestionar Colores',
      description: 'Añadir o editar paleta de colores',
      href: '/admin/colores',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      gradient: 'from-accent-500 to-accent-700'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-luxury-black p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header con bienvenida */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-4xl font-montserrat font-bold text-luxury-white">
            Bienvenido de nuevo, <span className="bg-gradient-to-r from-primary-500 to-luxury-teal bg-clip-text text-transparent">{session?.user?.name || 'Admin'}</span>
          </h1>
          <p className="text-luxury-grey text-lg">
            Panel de administración de Eiros BCN
          </p>
        </motion.div>

        {/* Estadísticas principales */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring" as const, stiffness: 300 }}
            >
              <Link href={stat.href}>
                <div className="relative overflow-hidden bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-6 group hover:border-primary-500/50 transition-all duration-300">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                       style={{ background: `linear-gradient(135deg, ${stat.gradient})` }} />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-luxury-grey text-sm font-medium">{stat.name}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-luxury-white">{stat.value}</p>
                        <span className="text-luxury-teal text-sm font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ background: `linear-gradient(90deg, ${stat.gradient})` }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-montserrat font-bold text-luxury-white">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring" as const, stiffness: 300 }}
              >
                <Link href={action.href}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-8 group hover:border-primary-500/50 transition-all duration-300 h-full">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                         style={{ background: `linear-gradient(135deg, ${action.gradient})` }} />
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      <div className={`bg-gradient-to-br ${action.gradient} p-5 rounded-2xl text-white shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300`}>
                        {action.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-montserrat font-bold text-luxury-white">{action.name}</h3>
                        <p className="text-sm text-luxury-grey">{action.description}</p>
                      </div>
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="absolute bottom-4 right-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actividad reciente */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-montserrat font-bold text-luxury-white">
            Actividad Reciente
          </h2>
          <div className="bg-gradient-to-br from-luxury-dark to-luxury-navy border border-primary-800/30 rounded-2xl p-8">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="bg-primary-900/50 p-6 rounded-full">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-luxury-grey text-center">
                No hay actividad reciente para mostrar
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
