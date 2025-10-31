/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Nueva paleta de colores con negro principal y azules como accent
      colors: {
        primary: {
          50: '#F8F9FC',   // Blanco azulado - más claro
          100: '#E6E9F4',  // Azul muy claro
          200: '#D1D8ED',  // Azul claro
          300: '#BCC7E6',  // Azul suave
          400: '#8FA3D3',  // Azul medio claro
          500: '#05308C',  // Azul royal (accent)
          600: '#042A7A',  // Azul royal oscuro
          700: '#032468',  // Azul marino medio
          800: '#033F51',  // Azul oscuro profundo
          900: '#000000',  // Negro principal
        },
        accent: {
          50: '#F8F9FC',
          100: '#E6E9F4',
          200: '#D1D8ED',
          300: '#BCC7E6',
          400: '#8FA3D3',
          500: '#05308C',  // Azul royal principal para accents
          600: '#042A7A',
          700: '#032468',
          800: '#033F51',
          900: '#001960',
        },
        luxury: {
          gold: '#05308C',
          silver: '#131936',
          platinum: '#F8F9FC',
          black: '#000000',
          white: '#F8F9FC',
          warm: '#131936',
          medium: '#001D51',
          navy: '#033F51',
          dark: '#001D51',
          blue: '#50A1B0',
          slate: '#131936',
          light: '#F8F9FC',
          teal: '#94c4c8',
          grey: '#a7a7a7',
          green: '#2FBF1E',
        }
      },
      // Tipografías premium
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        luxury: ['Cormorant Garamond', 'serif'],
        orbitron: ['var(--font-orbitron)', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        saira: ['var(--font-saira)', 'sans-serif']
      },
      // Animaciones y transiciones premium
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'parallax': 'parallax 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        parallax: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 144, 226, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.6)' }
        }
      },
      // Espaciado y medidas premium
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Variables de borde personalizadas
      borderColor: {
        'border': '#131936', // Azul grisáceo
      },
      // Efectos visuales avanzados
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
        'glow': '0 0 30px rgba(74, 144, 226, 0.4)',
        'glow-lg': '0 0 50px rgba(74, 144, 226, 0.5)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}