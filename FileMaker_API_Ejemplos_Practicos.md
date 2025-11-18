# Guía Práctica - FileMaker Data API vs SQL Server

**Proyecto:** EirosBCN  
**Fecha:** Noviembre 2025  
**Propósito:** Ejemplos prácticos de conversión de consultas

---

## Índice

1. [Autenticación](#autenticación)
2. [Consultas Básicas](#consultas-básicas)
3. [Filtrado y Búsqueda](#filtrado-y-búsqueda)
4. [Datos con Portals](#datos-con-portals)
5. [Paginación](#paginación)
6. [Ordenamiento](#ordenamiento)
7. [Inserción de Datos](#inserción-de-datos)
8. [Errores Comunes](#errores-comunes)

---

## Autenticación

### SQL Server (Actual)
```javascript
// Conexión directa con credenciales
import sql from 'mssql'

const config = {
  user: 'sa',
  password: 'KzsnHsv6Z1w3',
  server: '192.168.3.100',
  database: 'EirosBCN',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

const pool = await sql.connect(config)
```

### FileMaker Data API (Nuevo)
```javascript
// Paso 1: Obtener token
const authResponse = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/sessions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic d2ViX2Vpcm9zOldlYmVpcm9zOTYh' // web_eiros:Webeiros96!
    },
    body: JSON.stringify({
      fmDataSource: [{
        database: 'EIROS_ERP',
        username: 'api',
        password: 'api'
      }]
    })
  }
)

const { response } = await authResponse.json()
const token = response.token // Válido 15 minutos

// Paso 2: Usar token en consultas posteriores
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

**Nota importante:** El token expira en 15 minutos. Implementar renovación automática cada 13-14 minutos.

---

## Consultas Básicas

### Ejemplo 1: Obtener Todos los Productos Activos

#### SQL Server
```sql
SELECT 
  Id, Nombre, Precio, Stock, Activo
FROM BikeComponents
WHERE Activo = 1
ORDER BY Nombre ASC
```

```javascript
const result = await pool.request()
  .input('activo', sql.Bit, 1)
  .query(`
    SELECT Id, Nombre, Precio, Stock, Activo
    FROM BikeComponents
    WHERE Activo = @activo
    ORDER BY Nombre ASC
  `)

const productos = result.recordset
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [
        { Activo: "1" }  // Nota: como texto "1" no número 1
      ],
      sort: [
        { fieldName: "Nombre", sortOrder: "ascend" }
      ]
    })
  }
)

const { response: { data } } = await response.json()
const productos = data.map(record => record.fieldData)
```

**Diferencias clave:**
- FileMaker usa `_find` endpoint con JSON query
- Valores como texto, incluso numbers: `"1"` no `1`
- `sortOrder` puede ser `"ascend"` o `"descend"`
- Resultado en `data[].fieldData`

---

### Ejemplo 2: Obtener Un Producto por ID

#### SQL Server
```sql
SELECT * FROM BikeComponents WHERE Id = 3
```

```javascript
const result = await pool.request()
  .input('id', sql.Int, 3)
  .query('SELECT * FROM BikeComponents WHERE Id = @id')

const producto = result.recordset[0]
```

#### FileMaker Data API
```javascript
// Opción 1: Usando _find
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{ Id: "3" }]
    })
  }
)

const { response: { data } } = await response.json()
const producto = data[0]?.fieldData

// Opción 2: Usando recordId (si conoces el recordId interno)
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/records/79',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

const { response: { data } } = await response.json()
const producto = data[0]?.fieldData
```

**Nota:** `recordId` (ej: 79) es diferente de `Id` del producto (ej: 3). El `recordId` es interno de FileMaker.

---

## Filtrado y Búsqueda

### Ejemplo 3: Filtrado por Múltiples Condiciones (AND)

#### SQL Server
```sql
SELECT * FROM BikeComponents
WHERE CategoriaId = 1
  AND Stock > 0
  AND Activo = 1
```

```javascript
const result = await pool.request()
  .input('categoriaId', sql.Int, 1)
  .input('stockMin', sql.Int, 0)
  .input('activo', sql.Bit, 1)
  .query(`
    SELECT * FROM BikeComponents
    WHERE CategoriaId = @categoriaId
      AND Stock > @stockMin
      AND Activo = @activo
  `)
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [
        {
          CategoriaId: "1",
          Stock: ">0",      // Operador de rango
          Activo: "1"
        }
      ]
    })
  }
)
```

**Operadores de rango en FileMaker:**
- `>0` - Mayor que 0
- `<100` - Menor que 100
- `>=50` - Mayor o igual que 50
- `50...100` - Entre 50 y 100 (inclusivo)

---

### Ejemplo 4: Búsqueda por Texto (LIKE)

#### SQL Server
```sql
SELECT * FROM BikeComponents
WHERE Nombre LIKE '%Atena%'
```

```javascript
const result = await pool.request()
  .input('nombre', sql.NVarChar, '%Atena%')
  .query('SELECT * FROM BikeComponents WHERE Nombre LIKE @nombre')
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [
        { Nombre: "*Atena*" }  // * es equivalente a % en SQL LIKE
      ]
    })
  }
)
```

**Wildcards en FileMaker:**
- `*` - Equivalente a `%` en SQL (cualquier secuencia de caracteres)
- `@` - Equivalente a `_` en SQL (un solo carácter)

**Ejemplos:**
- `*Atena*` - Contiene "Atena"
- `Atena*` - Empieza con "Atena"
- `*Atena` - Termina con "Atena"

---

### Ejemplo 5: Filtrado OR (Múltiples Opciones)

#### SQL Server
```sql
SELECT * FROM BikeComponents
WHERE CategoriaId = 1 OR CategoriaId = 2 OR CategoriaId = 3
```

```javascript
const result = await pool.request()
  .query(`
    SELECT * FROM BikeComponents
    WHERE CategoriaId IN (1, 2, 3)
  `)
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [
        { CategoriaId: "1" },
        { CategoriaId: "2" },
        { CategoriaId: "3" }
      ]
      // Múltiples objetos en array = OR
    })
  }
)
```

**Lógica de query array:**
- Múltiples campos en **mismo objeto** = AND
- Múltiples **objetos separados** = OR

```javascript
// Ejemplo complejo: (Cat=1 AND Stock>0) OR (Cat=2 AND Destacado=1)
query: [
  { CategoriaId: "1", Stock: ">0" },      // AND dentro del objeto
  { CategoriaId: "2", Destacado: "1" }    // OR entre objetos
]
```

---

## Datos con Portals

### Ejemplo 6: Producto con Imágenes (JOIN)

#### SQL Server
```sql
SELECT 
  p.Id, p.Nombre, p.Precio,
  i.RutaArchivo, i.TipoImagen, i.EsPrincipal
FROM BikeComponents p
LEFT JOIN BikeComponentsImagenes i ON p.Id = i.ProductoId
WHERE p.Id = 3
  AND i.Activa = 1
ORDER BY i.Orden
```

```javascript
const result = await pool.request()
  .input('id', sql.Int, 3)
  .query(`
    SELECT 
      p.Id, p.Nombre, p.Precio,
      i.RutaArchivo, i.TipoImagen, i.EsPrincipal
    FROM BikeComponents p
    LEFT JOIN BikeComponentsImagenes i ON p.Id = i.ProductoId
    WHERE p.Id = @id AND i.Activa = 1
    ORDER BY i.Orden
  `)

// Resultado: array plano con duplicación de datos del producto
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{ Id: "3" }],
      portal: ["BikeComponentsImagenes"]  // Incluir portal de imágenes
    })
  }
)

const { response: { data } } = await response.json()
const record = data[0]

// Estructura de respuesta
const producto = {
  id: record.fieldData.Id,
  nombre: record.fieldData.Nombre,
  precio: record.fieldData.Precio,
  imagenes: record.portalData.BikeComponentsImagenes.map(img => ({
    rutaArchivo: img['BikeComponentsImagenes::RutaArchivo'],
    tipoImagen: img['BikeComponentsImagenes::TipoImagen'],
    esPrincipal: img['BikeComponentsImagenes::EsPrincipal']
  }))
}
```

**Estructura de respuesta FileMaker:**
```json
{
  "response": {
    "data": [
      {
        "fieldData": {
          "Id": "3",
          "Nombre": "Atena",
          "Precio": "149.99"
        },
        "portalData": {
          "BikeComponentsImagenes": [
            {
              "BikeComponentsImagenes::RutaArchivo": "/images/atena_1.jpg",
              "BikeComponentsImagenes::TipoImagen": "GALERIA",
              "BikeComponentsImagenes::EsPrincipal": "1",
              "recordId": "45",
              "modId": "2"
            },
            {
              "BikeComponentsImagenes::RutaArchivo": "/images/atena_2.jpg",
              "BikeComponentsImagenes::TipoImagen": "GALERIA",
              "BikeComponentsImagenes::EsPrincipal": "0",
              "recordId": "46",
              "modId": "1"
            }
          ]
        },
        "recordId": "79",
        "modId": "4"
      }
    ]
  }
}
```

**Nota importante:** Los campos del portal tienen prefijo con el nombre de la tabla: `BikeComponentsImagenes::RutaArchivo`

---

### Ejemplo 7: Producto con Múltiples Portals

#### SQL Server
```sql
-- Requiere múltiples queries o subconsultas complejas
SELECT * FROM BikeComponents WHERE Id = 3

SELECT * FROM BikeComponentsVariantes WHERE ProductoId = 3
SELECT * FROM BikeComponentsPesos WHERE ProductoId = 3
SELECT * FROM BikeComponentsImagenes WHERE ProductoId = 3 AND Activa = 1
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{ Id: "3" }],
      portal: [
        "BikeComponentsVariantes",
        "BikeComponentsPesos",
        "BikeComponentsPotencia",
        "BikeComponentsImagenes",
        "BikeComponentsEspecificaciones"
      ]
    })
  }
)

const { response: { data } } = await response.json()
const record = data[0]

// Todos los datos relacionados en una sola llamada
const producto = {
  ...record.fieldData,
  variantes: record.portalData.BikeComponentsVariantes || [],
  pesos: record.portalData.BikeComponentsPesos || [],
  potencias: record.portalData.BikeComponentsPotencia || [],
  imagenes: record.portalData.BikeComponentsImagenes || [],
  especificaciones: record.portalData.BikeComponentsEspecificaciones?.[0] || null
}
```

**Ventaja:** Una sola llamada API trae todo. En SQL Server requerirías 5 queries separadas o JOINs complejos.

---

### Ejemplo 8: Producto con Traducción por Idioma

#### SQL Server
```sql
SELECT 
  p.Id, p.Nombre AS NombreOriginal, p.Precio,
  COALESCE(t.Nombre, p.Nombre) AS Nombre,
  COALESCE(t.Descripcion, p.Descripcion) AS Descripcion
FROM BikeComponents p
LEFT JOIN BikeComponentsTraduccion t 
  ON p.Id = t.ProductoId AND t.IdiomaId = 1  -- 1=español
WHERE p.CategoriaId = 1
```

#### FileMaker Data API
```javascript
const idiomaId = 1 // 1=es, 2=ca, 3=en

const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{ CategoriaId: "1" }],
      portal: ["BikeComponentsTraduccion"]
    })
  }
)

const { response: { data } } = await response.json()

const productos = data.map(record => {
  // Buscar traducción para el idioma específico
  const traducciones = record.portalData.BikeComponentsTraduccion || []
  const traduccion = traducciones.find(t => 
    t['BikeComponentsTraduccion::IdiomaId'] === String(idiomaId)
  )

  return {
    id: record.fieldData.Id,
    nombre: traduccion?.['BikeComponentsTraduccion::Nombre'] || record.fieldData.Nombre,
    descripcion: traduccion?.['BikeComponentsTraduccion::Descripcion'] || record.fieldData.Descripcion,
    precio: record.fieldData.Precio
  }
})
```

**Lógica de fallback:** Si no existe traducción para el idioma, usar el valor del campo base.

---

## Paginación

### Ejemplo 9: Listado Paginado

#### SQL Server
```sql
SELECT * FROM BikeComponents
WHERE Activo = 1
ORDER BY Nombre
OFFSET 20 ROWS
FETCH NEXT 10 ROWS ONLY
```

```javascript
const pagina = 3       // Página actual (1-indexed)
const tamanoPagina = 10

const result = await pool.request()
  .input('offset', sql.Int, (pagina - 1) * tamanoPagina)
  .input('limit', sql.Int, tamanoPagina)
  .query(`
    SELECT * FROM BikeComponents
    WHERE Activo = 1
    ORDER BY Nombre
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY
  `)
```

#### FileMaker Data API
```javascript
const pagina = 3
const tamanoPagina = 10

const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{ Activo: "1" }],
      sort: [{ fieldName: "Nombre", sortOrder: "ascend" }],
      offset: (pagina - 1) * tamanoPagina,  // 20
      limit: tamanoPagina                    // 10
    })
  }
)

const { response: { data, dataInfo } } = await response.json()

const resultado = {
  productos: data.map(r => r.fieldData),
  paginaActual: pagina,
  tamanoPagina: tamanoPagina,
  totalRegistros: dataInfo.foundCount,
  totalPaginas: Math.ceil(dataInfo.foundCount / tamanoPagina)
}
```

**Información de paginación en dataInfo:**
```json
{
  "dataInfo": {
    "database": "WEB_EIROS",
    "layout": "BikeComponents_Web",
    "table": "BikeComponents",
    "totalRecordCount": 156,    // Total en tabla
    "foundCount": 42,            // Total que coinciden con query
    "returnedCount": 10          // Registros en esta página
  }
}
```

---

## Ordenamiento

### Ejemplo 10: Ordenamiento Múltiple

#### SQL Server
```sql
SELECT * FROM BikeComponents
ORDER BY Destacado DESC, Precio ASC, Nombre ASC
```

```javascript
const result = await pool.request()
  .query(`
    SELECT * FROM BikeComponents
    ORDER BY Destacado DESC, Precio ASC, Nombre ASC
  `)
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/BikeComponents_Web/_find',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: [{}],  // Todos los registros
      sort: [
        { fieldName: "Destacado", sortOrder: "descend" },
        { fieldName: "Precio", sortOrder: "ascend" },
        { fieldName: "Nombre", sortOrder: "ascend" }
      ]
    })
  }
)
```

**Nota:** FileMaker aplica los sorts en orden secuencial. Primer sort es prioritario.

---

## Inserción de Datos

### Ejemplo 11: Crear Pedido

#### SQL Server
```sql
INSERT INTO Pedidos (
  NumeroPedido, BikeComponentId, NombreCliente, EmailCliente,
  TelefonoCliente, PaisCliente, CiudadCliente, ColorSeleccionado,
  PrecioTotal, EstadoPedido, FechaPedido
) VALUES (
  'PED-2025-0001', 3, 'Juan Pérez', 'juan@example.com',
  '+34666777888', 'España', 'Barcelona', 'carbon black',
  149.99, 'PENDIENTE', GETDATE()
)
```

```javascript
const result = await pool.request()
  .input('numeroPedido', sql.VarChar, 'PED-2025-0001')
  .input('bikeComponentId', sql.Int, 3)
  .input('nombreCliente', sql.NVarChar, 'Juan Pérez')
  .input('emailCliente', sql.NVarChar, 'juan@example.com')
  .input('telefonoCliente', sql.VarChar, '+34666777888')
  .input('paisCliente', sql.NVarChar, 'España')
  .input('ciudadCliente', sql.NVarChar, 'Barcelona')
  .input('colorSeleccionado', sql.NVarChar, 'carbon black')
  .input('precioTotal', sql.Decimal(10,2), 149.99)
  .input('estadoPedido', sql.VarChar, 'PENDIENTE')
  .query(`
    INSERT INTO Pedidos (...) VALUES (...)
  `)

const pedidoId = result.recordset[0].Id
```

#### FileMaker Data API
```javascript
const response = await fetch(
  'https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/Pedidos_Web/records',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fieldData: {
        NumeroPedido: 'PED-2025-0001',
        BikeComponentId: 3,                 // Número sin comillas
        NombreCliente: 'Juan Pérez',
        EmailCliente: 'juan@example.com',
        TelefonoCliente: '+34666777888',
        PaisCliente: 'España',
        CiudadCliente: 'Barcelona',
        ColorSeleccionado: 'carbon black',
        PrecioTotal: 149.99,                // Número decimal
        EstadoPedido: 'PENDIENTE',
        FechaPedido: new Date().toISOString()  // ISO format
      }
    })
  }
)

const { response: { recordId } } = await response.json()
// recordId es el ID interno de FileMaker, no el Id del campo
```

**Diferencia importante:** 
- FileMaker devuelve `recordId` (ID interno)
- Para obtener el `Id` del campo necesitas hacer otra consulta

```javascript
// Obtener el registro recién creado
const getResponse = await fetch(
  `https://192.168.200.101/fmi/data/vLatest/databases/WEB_EIROS/layouts/Pedidos_Web/records/${recordId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

const { response: { data } } = await getResponse.json()
const pedidoId = data[0].fieldData.Id
```

---

## Errores Comunes

### Error 1: Token Expirado

**Síntoma:**
```json
{
  "messages": [
    {
      "code": "952",
      "message": "Invalid FileMaker Data API token"
    }
  ],
  "response": {}
}
```

**Solución:**
```javascript
// Implementar renovación automática
let token = null
let tokenExpiry = 0

async function getValidToken() {
  // Si token está por expirar (falta menos de 2 min), renovar
  if (!token || Date.now() > tokenExpiry - 120000) {
    const authResponse = await fetch(/* ... auth endpoint ... */)
    const { response } = await authResponse.json()
    token = response.token
    tokenExpiry = Date.now() + 14 * 60 * 1000  // 14 minutos
  }
  return token
}

// Usar en todas las llamadas
const token = await getValidToken()
```

---

### Error 2: Valores Numéricos como Texto

**Error común:**
```javascript
// ❌ INCORRECTO
query: [{ Id: 3 }]  // Número sin comillas

// ✅ CORRECTO
query: [{ Id: "3" }]  // Texto con comillas
```

**Regla:** Todos los valores en `query` deben ser strings, incluso números.

---

### Error 3: Portal Data Vacío

**Síntoma:**
```json
{
  "portalData": {}  // Vacío en lugar de array
}
```

**Causa:** No se especificó el portal en la consulta.

**Solución:**
```javascript
// ❌ Sin portal
body: JSON.stringify({
  query: [{ Id: "3" }]
})

// ✅ Con portal
body: JSON.stringify({
  query: [{ Id: "3" }],
  portal: ["BikeComponentsImagenes"]  // Especificar portal
})
```

---

### Error 4: Campos del Portal sin Prefijo

**Error común:**
```javascript
// ❌ INCORRECTO
const imagen = portalRecord.RutaArchivo

// ✅ CORRECTO
const imagen = portalRecord['BikeComponentsImagenes::RutaArchivo']
```

**Regla:** Los campos del portal siempre tienen prefijo `NombreTabla::`

---

### Error 5: Certificado SSL No Válido

**Síntoma:**
```
Error: unable to verify the first certificate
```

**Solución temporal (desarrollo):**
```javascript
// Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Fetch con node-fetch
const https = require('https')
const agent = new https.Agent({
  rejectUnauthorized: false
})

fetch(url, { agent })
```

**Solución permanente:** Instalar certificado SSL válido en FileMaker Server.

---

### Error 6: Layout No Encontrado

**Síntoma:**
```json
{
  "messages": [
    {
      "code": "105",
      "message": "Layout is missing"
    }
  ]
}
```

**Causa:** Nombre de layout incorrecto en URL.

**Verificar:**
- Nombre exacto del layout (case-sensitive)
- Layout tiene privilegios para usuario `api`
- Layout existe en base de datos `EIROS_ERP`

---

## Resumen de Diferencias Clave

| Aspecto | SQL Server | FileMaker Data API |
|---------|-----------|-------------------|
| **Conexión** | Pool persistente | Token temporal (15 min) |
| **Filtrado** | WHERE clause | JSON query array |
| **Joins** | JOIN en SQL | Portal en request |
| **Ordenamiento** | ORDER BY | sort array |
| **Paginación** | OFFSET/FETCH | offset/limit |
| **Inserción** | INSERT INTO | POST /records |
| **Valores** | Tipados (int, string) | Todo como string "1" |
| **Resultado** | recordset plano | fieldData + portalData |
| **Errores** | SQL errors | FileMaker error codes |

---

## Checklist de Migración

- [ ] Implementar gestión de tokens con renovación automática
- [ ] Convertir todas las consultas SQL a formato JSON
- [ ] Mapear campos con prefijos de portal
- [ ] Implementar manejo de errores FileMaker
- [ ] Agregar retry logic para 401/952 errors
- [ ] Testing de performance vs SQL Server
- [ ] Implementar caché si es necesario
- [ ] Documentar todos los endpoints

---

**Documento preparado por:** Ramón Pérez  
**Fecha:** Noviembre 2025  
**Versión:** 1.0
