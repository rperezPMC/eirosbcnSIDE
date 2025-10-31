# Luxury Timepieces - E-commerce Premium

Un sitio web de comercio electrónico de lujo inspirado en el diseño de Richard Mille, que combina una landing page empresarial con funcionalidades de e-commerce avanzadas.

## 🎯 Características Principales

- **Diseño Premium**: Estética minimalista con efectos visuales sofisticados
- **Performance Optimizada**: Next.js 14 con SSR/SSG para carga ultra-rápida
- **Efectos Visuales**: Animaciones Framer Motion y efectos parallax
- **Responsive Design**: Completamente adaptativo a todos los dispositivos
- **TypeScript**: Código type-safe y mantenible
- **SEO Optimizado**: Metadata completa y structured data

## 🛠 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animaciones**: Framer Motion
- **Iconos**: Heroicons + Lucide React
- **Deployment**: Vercel (recomendado)

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18.0.0 o superior
- npm 8.0.0 o superior

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd eiros-bcn
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globales premium
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── loading.tsx        # Loading states
├── components/            # Componentes reutilizables
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Secciones principales
│   ├── ui/               # Componentes UI básicos
│   └── common/           # Componentes comunes
├── lib/                  # Utilidades y configuración
├── types/                # Definiciones TypeScript
├── hooks/                # Custom hooks React
└── styles/               # Estilos adicionales
```

## 🎨 Características de Diseño

### Paleta de Colores Premium
- **Luxury Gold**: #D4AF37
- **Luxury Silver**: #C0C0C0
- **Luxury Black**: #0A0A0A
- **Luxury White**: #FAFAFA

### Tipografías
- **Heading**: Playfair Display (serif elegante)
- **Body**: Inter (sans-serif moderna)
- **Luxury**: Cormorant Garamond (serif de lujo)

### Efectos Visuales
- Parallax scrolling
- Animaciones Framer Motion
- Video backgrounds
- Hover effects sofisticados
- Transiciones suaves

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint

# Verificación de tipos
npm run type-check
```

## 📋 Features por Implementar

### Fase 1 - Base (Completada)
- ✅ Setup inicial Next.js 14 + TypeScript
- ✅ Configuración Tailwind CSS premium
- ✅ Header sticky con animaciones
- ✅ Hero section con video background
- ✅ Estructura de componentes básica

### Fase 2 - UI/UX Premium
- [ ] Viewer 360° de productos
- [ ] Galería de productos con filtros
- [ ] Páginas de producto individuales
- [ ] Sistema de navegación avanzado
- [ ] Footer completo

### Fase 3 - E-commerce
- [ ] Carrito de compras
- [ ] Checkout process
- [ ] Integración Stripe
- [ ] Gestión de productos
- [ ] Panel de usuario

### Fase 4 - Optimización
- [ ] Performance optimization
- [ ] SEO avanzado
- [ ] Analytics integration
- [ ] Testing suite

## 🎯 Inspiración de Diseño

Este proyecto está inspirado en la estética premium de Richard Mille:
- **Minimalismo elegante**: Espacios blancos y líneas limpias
- **Motion graphics**: Animaciones sutiles y profesionales
- **Calidad premium**: Materiales visuales de alta gama
- **Experiencia inmersiva**: Navegación fluida y engaging

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Otros Providers
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo `LICENSE.md` para detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño**: Inspirado en Richard Mille
- **Cliente**: [Nombre del Cliente]

## 📞 Soporte

Para soporte y preguntas:
- Email: [tu-email@ejemplo.com]
- Issue Tracker: [GitHub Issues]

---

**Nota**: Este es un proyecto base que incluye la estructura fundamental y los componentes principales. Las funcionalidades avanzadas de e-commerce se irán implementando en fases posteriores.
