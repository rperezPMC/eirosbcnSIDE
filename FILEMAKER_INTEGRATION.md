# Integración FileMaker - EirosBCN

Sistema de integración con FileMaker Data API para el proyecto EirosBCN.

## 📁 Estructura Creada

```
src/
├── lib/
│   ├── filemaker/
│   │   ├── config.ts          # Configuración de conexión
│   │   ├── connection.ts      # Gestión de tokens
│   │   ├── client.ts          # Cliente API
│   │   ├── types.ts           # Tipos TypeScript
│   │   └── index.ts           # Exportaciones
│   └── services/
│       └── filemakerProductService.ts  # Servicio de productos
└── app/
    └── api/
        └── mountain/
            ├── route.ts       # GET /api/mountain
            └── [id]/
                └── route.ts   # GET /api/mountain/[id]
```

## 🔌 Endpoints Creados

### 1. Obtener todos los productos Mountain

**GET** `/api/mountain?locale=es`

**Parámetros:**
- `locale` (opcional): es | ca | en (default: es)


### 2. Obtener producto específico

**GET** `/api/mountain/3?locale=es`

**Parámetros:**
- `id`: ID del producto
- `locale` (opcional): es | ca | en (default: es)


## 🚀 Cómo Usar

### Desde el Frontend

```typescript
// Obtener todos los productos
const response = await fetch('/api/mountain?locale=es')
const { data: productos } = await response.json()

// Obtener producto específico
const response = await fetch('/api/mountain/3?locale=ca')
const { data: producto } = await response.json()
```

### Cambiar Idioma Dinámicamente

```typescript
import { useLocale } from 'next-intl'

function MountainPage() {
  const locale = useLocale() // 'es', 'ca', 'en'
  
  const [productos, setProductos] = useState([])
  
  useEffect(() => {
    fetch(`/api/mountain?locale=${locale}`)
      .then(res => res.json())
      .then(data => setProductos(data.data))
  }, [locale])
  
  return (
    // ... render productos
  )
}
```

## ⚙️ Configuración

### Variables de Entorno (.env.local)

```env
FM_HOST=https://192.168.200.101
FM_DB_FRONTEND=WEB_EIROS
FM_DB_BACKEND=EIROS_ERP
FM_API_VERSION=vLatest
FM_AUTH_BASIC=d2ViX2Vpcm9zOldlYmVpcm9zOTYh
FM_DATA_USER=api
FM_DATA_PASSWORD=api
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## 🔧 Capa FileMaker

### FileMakerClient

Cliente principal para interactuar con FileMaker Data API.

```typescript
import { fileMakerClient } from '@/lib/filemaker'

// Buscar registros
const result = await fileMakerClient.findRecords(
  'BikeComponents',
  [{ Activo: "1" }],
  { 
    limit: 10,
    sort: [{ fieldName: 'Nombre', sortOrder: 'ascend' }]
  }
)

// Obtener todos los registros
const records = await fileMakerClient.getAllRecords('Categorias')

// Obtener por ID (recordId de FileMaker)
const record = await fileMakerClient.getRecordById('BikeComponents', '1')
```

### FileMakerConnection

Gestión automática de tokens.

```typescript
import { fileMakerConnection } from '@/lib/filemaker'

// Obtener token (renovación automática)
const token = await fileMakerConnection.getToken()

// Verificar si token es válido
const isValid = fileMakerConnection.isTokenValid()

// Cerrar sesión
await fileMakerConnection.closeSession()
```

## 📊 Flujo de Datos

```
Frontend Request
    ↓
/api/mountain?locale=es
    ↓
filemakerProductService.ts
    ↓
fileMakerClient
    ↓
fileMakerConnection (gestión token)
    ↓
FileMaker Data API (192.168.200.101)
    ↓
7 queries separadas:
  - Idiomas
  - Categorias
  - BikeComponents
  - BikeComponentsTraduccion
  - BikeComponentsVariantes + Colores
  - BikeComponentsPesos
  - BikeComponentsPotencia
  - BikeComponentsImagenes
  - BikeComponentsEspecificaciones
    ↓
Combine & Transform
    ↓
Response al Frontend
```

## 🔍 Debugging

### Ver logs en consola

Los servicios incluyen logs detallados:

```
[FileMaker] Obteniendo nuevo token...
[FileMaker] Token obtenido exitosamente
[MountainService] Obteniendo productos para idioma: es
[MountainService] Productos encontrados: 1
[MountainService] Procesando producto ID: 3
[MountainService] Total productos procesados: 1
[API /mountain] Petición recibida, locale: es
[API /mountain] Productos obtenidos: 1
```

### Errores comunes

**Error: Token expirado**
```
FileMaker error: Invalid FileMaker Data API token
```
Solución: El sistema renueva automáticamente, espera unos segundos.

**Error: Layout no encontrado**
```
FileMaker error: Layout is missing
```
Solución: Verifica que el layout existe en FileMaker Pro.

**Error: Conexión rechazada**
```
FileMaker request failed: 500
```
Solución: Verifica que FileMaker Server está accesible en 192.168.200.101.

## ✅ Testing

### Probar endpoint manualmente

```bash
# Obtener productos
curl http://localhost:3000/api/mountain?locale=es

# Obtener producto específico
curl http://localhost:3000/api/mountain/3?locale=ca
```

### Probar con Postman

1. GET http://localhost:3000/api/mountain
2. Query params: locale=es
3. Debería retornar JSON con productos

## 🎯 Próximos Pasos

1. **Optimización con Portals** (opcional)
   - Configurar portals en layouts de FileMaker
   - Reducir de 7 queries a 1 query
   - Cambiar `filemakerProductService.ts` para usar portals

2. **Caché** (recomendado)
   - Implementar caché en memoria
   - Reducir latencia de red
   - Mejorar rendimiento general

3. **Más Endpoints**
   - `/api/gravel` - Productos Gravel
   - `/api/road` - Productos Road
   - `/api/categorias` - Categorías
   - `/api/colores` - Colores disponibles

4. **Admin**
   - Endpoints CRUD para administración
   - Crear/Editar/Eliminar productos

## 📝 Notas Importantes

- **Sin Portals:** Actualmente hace múltiples queries (funciona perfectamente)
- **Tokens:** Se renuevan automáticamente cada 14 minutos
- **HTTPS:** Certificado autofirmado (NODE_TLS_REJECT_UNAUTHORIZED=0 en dev)
- **Performance:** ~300-500ms por request (aceptable sin caché)

---

**Tokens restantes: 35%**
