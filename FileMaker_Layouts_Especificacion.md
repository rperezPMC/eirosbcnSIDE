# Especificación de Layouts FileMaker - EirosBCN

**Fecha:** Noviembre 2025  
**Proyecto:** Migración SQL Server → FileMaker Data API  
**Para:** Informático del cliente

---

## Tabla de Contenidos

1. [Configuración de Base de Datos](#configuración-de-base-de-datos)
2. [Layouts Principales](#layouts-principales)
3. [Tablas Lookup](#tablas-lookup)
4. [Relaciones y Portals](#relaciones-y-portals)
5. [Índices Necesarios](#índices-necesarios)
6. [Mapeo de Tipos de Datos](#mapeo-de-tipos-de-datos)

---

## Configuración de Base de Datos

### Base de Datos Principal
- **Nombre:** EIROS_ERP (backend)
- **Gateway:** WEB_EIROS (frontend auth)
- **Credenciales API:** api / api
- **Puerto:** HTTPS (443)
- **Certificado:** SSL válido requerido para producción

---

## Layouts Principales

### 1. Layout: BikeComponents_Web

Tabla origen: BikeComponents  
Descripción: Productos principales de bicicleta (manillares, stems, etc.)

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único del producto | Id (INT) |
| CategoriaId | Number | - | Sí | FK a Categorias | CategoriaId (INT) |
| SubcategoriaId | Number | - | No | FK a Subcategorias | SubcategoriaId (INT) |
| Nombre | Text | 200 | Sí | Nombre del producto | Nombre (NVARCHAR) |
| Slogan | Text | 255 | No | Slogan corto | Slogan (NVARCHAR) |
| SKU | Text | 50 | No | Código único de producto | SKU (VARCHAR) |
| Precio | Number (Decimal) | 10,2 | Sí | Precio en EUR | Precio (DECIMAL) |
| Descripcion | Text | 2000 | No | Descripción completa | Descripcion (NVARCHAR) |
| DescripcionCorta | Text | 500 | No | Descripción resumida | DescripcionCorta (NVARCHAR) |
| DescripcionHistoria | Text | 2000 | No | Historia del producto | DescripcionHistoria (NVARCHAR) |
| NombreSvgRuta | Text | 255 | No | Ruta al logo SVG | NombreSvgRuta (NVARCHAR) |
| Activo | Number | 1 | Sí | 1=Activo, 0=Inactivo | Activo (BIT) |
| Destacado | Number | 1 | No | 1=Destacado, 0=Normal | Destacado (BIT) |
| Novedad | Number | 1 | No | 1=Novedad, 0=Normal | Novedad (BIT) |
| EnOferta | Number | 1 | No | 1=En oferta, 0=Normal | EnOferta (BIT) |
| PorcentajeDescuento | Number (Decimal) | 5,2 | No | % descuento (0-100) | PorcentajeDescuento (DECIMAL) |
| Stock | Number | - | Sí | Unidades disponibles | Stock (INT) |
| StockMinimo | Number | - | No | Stock mínimo para alerta | StockMinimo (INT) |
| PermitirPreorden | Number | 1 | No | 1=Permitir, 0=No | PermitirPreorden (BIT) |
| FechaCreacion | Timestamp | - | Sí | Fecha de creación | FechaCreacion (DATETIME) |
| FechaModificacion | Timestamp | - | No | Última modificación | FechaModificacion (DATETIME) |
| UsuarioCreacion | Text | 100 | No | Usuario creador | UsuarioCreacion (NVARCHAR) |
| UsuarioModificacion | Text | 100 | No | Usuario modificador | UsuarioModificacion (NVARCHAR) |
| SlugUrl | Text | 255 | No | URL amigable | SlugUrl (VARCHAR) |
| MetaTitulo | Text | 255 | No | SEO - Título | MetaTitulo (NVARCHAR) |
| MetaDescripcion | Text | 500 | No | SEO - Descripción | MetaDescripcion (NVARCHAR) |
| MetaPalabrasClaves | Text | 500 | No | SEO - Keywords | MetaPalabrasClaves (NVARCHAR) |

#### Portals Necesarios en BikeComponents_Web

1. **Portal: BikeComponentsTraduccion**
   - Relación: BikeComponents::Id = BikeComponentsTraduccion::ProductoId
   - Campos: IdiomaId, Nombre, Slogan, DescripcionCorta, Descripcion, DescripcionHistoria
   - Orden: IdiomaId

2. **Portal: BikeComponentsVariantes**
   - Relación: BikeComponents::Id = BikeComponentsVariantes::ProductoId
   - Campos: Id, Color, CodigoHex, ColorId, Stock, Disponible, Orden
   - Orden: Orden

3. **Portal: BikeComponentsPesos**
   - Relación: BikeComponents::Id = BikeComponentsPesos::ProductoId
   - Campos: Id, Peso, Stock, Disponible, EsPrincipal, Orden
   - Orden: Orden

4. **Portal: BikeComponentsPotencia**
   - Relación: BikeComponents::Id = BikeComponentsPotencia::ProductoId
   - Campos: Id, Potencia, Width, Rise, Stock, Disponible, Orden
   - Orden: Orden

5. **Portal: BikeComponentsImagenes**
   - Relación: BikeComponents::Id = BikeComponentsImagenes::ProductoId
   - Campos: Id, RutaArchivo, TipoImagen, VarianteId, ColorId, EsPrincipal, Orden, Activa
   - Orden: Orden

6. **Portal: BikeComponentsEspecificaciones**
   - Relación: BikeComponents::Id = BikeComponentsEspecificaciones::ProductoId
   - Campos: Backsweep, Upsweep, ClampDiameter, Material, Construction, Autoclave, Informacion, Caracteristicas

---

### 2. Layout: BikeComponentsTraduccion_Web

Tabla origen: BikeComponentsTraduccion  
Descripción: Traducciones de productos en múltiples idiomas

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único traducción | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| IdiomaId | Number | - | Sí | FK a Idiomas (1=es, 2=ca, 3=en) | IdiomaId (INT) |
| Nombre | Text | 200 | Sí | Nombre traducido | Nombre (NVARCHAR) |
| Slogan | Text | 255 | No | Slogan traducido | Slogan (NVARCHAR) |
| DescripcionCorta | Text | 500 | No | Descripción resumida | DescripcionCorta (NVARCHAR) |
| Descripcion | Text | 2000 | No | Descripción completa | Descripcion (NVARCHAR) |
| DescripcionHistoria | Text | 2000 | No | Historia traducida | DescripcionHistoria (NVARCHAR) |
| MetaTitulo | Text | 255 | No | SEO - Título | MetaTitulo (NVARCHAR) |
| MetaDescripcion | Text | 500 | No | SEO - Descripción | MetaDescripcion (NVARCHAR) |
| MetaPalabrasClaves | Text | 500 | No | SEO - Keywords | MetaPalabrasClaves (NVARCHAR) |

---

### 3. Layout: BikeComponentsVariantes_Web

Tabla origen: BikeComponentsVariantes  
Descripción: Variantes de color/acabado por producto

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único variante | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| Color | Text | 100 | Sí | Nombre del color | Color (NVARCHAR) |
| CodigoHex | Text | 7 | No | Código hex (#FFFFFF) | CodigoHex (VARCHAR) |
| ColorId | Number | - | No | FK a Colores | ColorId (INT) |
| Stock | Number | - | Sí | Stock de esta variante | Stock (INT) |
| Disponible | Number | 1 | Sí | 1=Disponible, 0=No | Disponible (BIT) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |

#### Portal en BikeComponentsVariantes_Web

1. **Portal: Colores_Info**
   - Relación: BikeComponentsVariantes::ColorId = Colores::Id
   - Campos: Nombre, RutaLogo, CodigoHex

---

### 4. Layout: BikeComponentsPesos_Web

Tabla origen: BikeComponentsPesos  
Descripción: Pesos disponibles por producto

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único peso | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| Peso | Number (Decimal) | 8,2 | Sí | Peso en gramos | Peso (DECIMAL) |
| Stock | Number | - | Sí | Stock disponible | Stock (INT) |
| Disponible | Number | 1 | Sí | 1=Disponible, 0=No | Disponible (BIT) |
| EsPrincipal | Number | 1 | No | 1=Peso principal, 0=No | EsPrincipal (BIT) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |

---

### 5. Layout: BikeComponentsPotencia_Web

Tabla origen: BikeComponentsPotencia  
Descripción: Potencias/stems disponibles

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único potencia | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| Potencia | Text | 50 | Sí | Medida (ej: "90mm") | Potencia (VARCHAR) |
| Width | Text | 50 | No | Ancho (ej: "800mm") | Width (VARCHAR) |
| Rise | Text | 50 | No | Rise (ej: "20mm") | Rise (VARCHAR) |
| Stock | Number | - | Sí | Stock disponible | Stock (INT) |
| Disponible | Number | 1 | Sí | 1=Disponible, 0=No | Disponible (BIT) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |

---

### 6. Layout: BikeComponentsImagenes_Web

Tabla origen: BikeComponentsImagenes  
Descripción: Imágenes asociadas a productos

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único imagen | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| RutaArchivo | Text | 500 | Sí | Ruta relativa imagen | RutaArchivo (NVARCHAR) |
| TipoImagen | Text | 50 | Sí | Tipo: "GALERIA", "HOVER", "LOGO" | TipoImagen (VARCHAR) |
| VarianteId | Number | - | No | FK a Variantes | VarianteId (INT) |
| ColorId | Number | - | No | FK a Colores | ColorId (INT) |
| EsPrincipal | Number | 1 | No | 1=Imagen principal, 0=No | EsPrincipal (BIT) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |
| Activa | Number | 1 | Sí | 1=Activa, 0=Inactiva | Activa (BIT) |
| FechaSubida | Timestamp | - | Sí | Fecha de subida | FechaSubida (DATETIME) |

---

### 7. Layout: BikeComponentsEspecificaciones_Web

Tabla origen: BikeComponentsEspecificaciones  
Descripción: Especificaciones técnicas detalladas

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único especificación | Id (INT) |
| ProductoId | Number | - | Sí | FK a BikeComponents | ProductoId (INT) |
| Backsweep | Text | 50 | No | Backsweep en grados | Backsweep (VARCHAR) |
| Upsweep | Text | 50 | No | Upsweep en grados | Upsweep (VARCHAR) |
| ClampDiameter | Text | 50 | No | Diámetro de abrazadera | ClampDiameter (VARCHAR) |
| Material | Text | 100 | No | Material (ej: "Carbon UD") | Material (NVARCHAR) |
| Construction | Text | 200 | No | Tipo construcción | Construction (NVARCHAR) |
| Autoclave | Number | 1 | No | 1=Con autoclave, 0=Sin | Autoclave (BIT) |
| Informacion | Text | 2000 | No | Información adicional | Informacion (NVARCHAR) |
| Caracteristicas | Text | 2000 | No | Características técnicas | Caracteristicas (NVARCHAR) |

---

## Tablas Lookup

### 8. Layout: Categorias_Web

Tabla origen: Categorias  
Descripción: Categorías principales (mountain, gravel, road, etc.)

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único categoría | Id (INT) |
| Codigo | Text | 50 | Sí | Código único (mountain, gravel) | Codigo (VARCHAR) |
| TipoProducto | Text | 50 | Sí | "BikeComponents" o "GearUp" | TipoProducto (VARCHAR) |
| Icono | Text | 255 | No | Ruta al icono | Icono (NVARCHAR) |
| Color | Text | 7 | No | Color hex categoría | Color (VARCHAR) |
| Imagen | Text | 255 | No | Imagen de categoría | Imagen (NVARCHAR) |
| SlugUrl | Text | 100 | No | URL amigable | SlugUrl (VARCHAR) |
| Activo | Number | 1 | Sí | 1=Activo, 0=Inactivo | Activo (BIT) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |
| FechaCreacion | Timestamp | - | Sí | Fecha de creación | FechaCreacion (DATETIME) |
| FechaModificacion | Timestamp | - | No | Última modificación | FechaModificacion (DATETIME) |

#### Portal en Categorias_Web

1. **Portal: CategoriasTraduccion**
   - Relación: Categorias::Id = CategoriasTraduccion::CategoriaId
   - Campos: IdiomaId, Nombre, Descripcion

---

### 9. Layout: CategoriasTraduccion_Web

Tabla origen: CategoriasTraduccion  
Descripción: Traducciones de categorías

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único traducción | Id (INT) |
| CategoriaId | Number | - | Sí | FK a Categorias | CategoriaId (INT) |
| IdiomaId | Number | - | Sí | FK a Idiomas | IdiomaId (INT) |
| Nombre | Text | 100 | Sí | Nombre traducido | Nombre (NVARCHAR) |
| Descripcion | Text | 500 | No | Descripción traducida | Descripcion (NVARCHAR) |

---

### 10. Layout: Colores_Web

Tabla origen: Colores  
Descripción: Colores disponibles con logos

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único color | Id (INT) |
| Nombre | Text | 100 | Sí | Nombre del color | Nombre (NVARCHAR) |
| RutaLogo | Text | 255 | No | Ruta al logo del color | RutaLogo (NVARCHAR) |
| CodigoHex | Text | 7 | Sí | Código hex (#FFFFFF) | CodigoHex (VARCHAR) |
| Orden | Number | - | Sí | Orden de visualización | Orden (INT) |
| Activo | Number | 1 | Sí | 1=Activo, 0=Inactivo | Activo (BIT) |

---

### 11. Layout: Idiomas_Web

Tabla origen: Idiomas  
Descripción: Idiomas disponibles en la web

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único idioma | Id (INT) |
| Codigo | Text | 10 | Sí | Código ISO (es, ca, en) | Codigo (VARCHAR) |
| Nombre | Text | 100 | Sí | Nombre del idioma | Nombre (NVARCHAR) |
| NombreNativo | Text | 100 | No | Nombre nativo | NombreNativo (NVARCHAR) |
| Activo | Number | 1 | Sí | 1=Activo, 0=Inactivo | Activo (BIT) |
| Orden | Number | - | No | Orden de visualización | Orden (INT) |

**Datos iniciales requeridos:**
```
Id=1, Codigo='es', Nombre='Español', NombreNativo='Español', Activo=1, Orden=1
Id=2, Codigo='ca', Nombre='Catalán', NombreNativo='Català', Activo=1, Orden=2
Id=3, Codigo='en', Nombre='Inglés', NombreNativo='English', Activo=1, Orden=3
```

---

### 12. Layout: Pedidos_Web

Tabla origen: Pedidos  
Descripción: Pedidos realizados por clientes

#### Campos del Layout

| Campo FileMaker | Tipo | Tamaño | Obligatorio | Descripción | SQL Original |
|----------------|------|--------|-------------|-------------|--------------|
| Id | Number | - | Sí | ID único pedido | Id (INT) |
| NumeroPedido | Text | 50 | Sí | Número único (PED-2025-0001) | NumeroPedido (VARCHAR) |
| BikeComponentId | Number | - | Sí | FK a BikeComponents | BikeComponentId (INT) |
| NombreCliente | Text | 200 | Sí | Nombre del cliente | NombreCliente (NVARCHAR) |
| EmailCliente | Text | 255 | Sí | Email del cliente | EmailCliente (NVARCHAR) |
| TelefonoCliente | Text | 50 | Sí | Teléfono del cliente | TelefonoCliente (VARCHAR) |
| PaisCliente | Text | 100 | Sí | País del cliente | PaisCliente (NVARCHAR) |
| CiudadCliente | Text | 100 | Sí | Ciudad del cliente | CiudadCliente (NVARCHAR) |
| MensajeCliente | Text | 2000 | No | Mensaje adicional | MensajeCliente (NVARCHAR) |
| ColorSeleccionado | Text | 100 | No | Color seleccionado | ColorSeleccionado (NVARCHAR) |
| PotenciaSeleccionada | Text | 50 | No | Potencia seleccionada | PotenciaSeleccionada (VARCHAR) |
| PesoSeleccionado | Number (Decimal) | 8,2 | No | Peso seleccionado | PesoSeleccionado (DECIMAL) |
| PrecioTotal | Number (Decimal) | 10,2 | Sí | Precio total del pedido | PrecioTotal (DECIMAL) |
| EstadoPedido | Text | 50 | Sí | Estado: PENDIENTE, PROCESANDO, COMPLETADO, CANCELADO | EstadoPedido (VARCHAR) |
| FechaPedido | Timestamp | - | Sí | Fecha del pedido | FechaPedido (DATETIME) |
| FechaActualizacion | Timestamp | - | No | Última actualización | FechaActualizacion (DATETIME) |
| NotasInternas | Text | 2000 | No | Notas del administrador | NotasInternas (NVARCHAR) |

---

## Relaciones y Portals

### Esquema de Relaciones

```
BikeComponents (1) -----< (N) BikeComponentsTraduccion
       |
       +-------------< (N) BikeComponentsVariantes
       |                         |
       |                         +--------> (1) Colores
       |
       +-------------< (N) BikeComponentsPesos
       |
       +-------------< (N) BikeComponentsPotencia
       |
       +-------------< (N) BikeComponentsImagenes
       |
       +-------------< (1) BikeComponentsEspecificaciones
       |
       +-----------> (1) Categorias -----< (N) CategoriasTraduccion

Pedidos (N) ------------> (1) BikeComponents
```

### Configuración de Relaciones en FileMaker

#### Relación 1: BikeComponents → BikeComponentsTraduccion
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsTraduccion
- Campo Join: BikeComponents::Id = BikeComponentsTraduccion::ProductoId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 2: BikeComponents → BikeComponentsVariantes
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsVariantes
- Campo Join: BikeComponents::Id = BikeComponentsVariantes::ProductoId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 3: BikeComponentsVariantes → Colores
- Tabla Origen: BikeComponentsVariantes
- Tabla Destino: Colores
- Campo Join: BikeComponentsVariantes::ColorId = Colores::Id
- Tipo: N:1
- Permitir crear registros: No
- Permitir borrar registros: No

#### Relación 4: BikeComponents → BikeComponentsPesos
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsPesos
- Campo Join: BikeComponents::Id = BikeComponentsPesos::ProductoId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 5: BikeComponents → BikeComponentsPotencia
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsPotencia
- Campo Join: BikeComponents::Id = BikeComponentsPotencia::ProductoId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 6: BikeComponents → BikeComponentsImagenes
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsImagenes
- Campo Join: BikeComponents::Id = BikeComponentsImagenes::ProductoId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 7: BikeComponents → BikeComponentsEspecificaciones
- Tabla Origen: BikeComponents
- Tabla Destino: BikeComponentsEspecificaciones
- Campo Join: BikeComponents::Id = BikeComponentsEspecificaciones::ProductoId
- Tipo: 1:1
- Permitir crear registros: Sí
- Permitir borrar registros: Sí (cascada)

#### Relación 8: BikeComponents → Categorias
- Tabla Origen: BikeComponents
- Tabla Destino: Categorias
- Campo Join: BikeComponents::CategoriaId = Categorias::Id
- Tipo: N:1
- Permitir crear registros: No
- Permitir borrar registros: No

#### Relación 9: Categorias → CategoriasTraduccion
- Tabla Origen: Categorias
- Tabla Destino: CategoriasTraduccion
- Campo Join: Categorias::Id = CategoriasTraduccion::CategoriaId
- Tipo: 1:N
- Permitir crear registros: No
- Permitir borrar registros: Sí (cascada)

#### Relación 10: Pedidos → BikeComponents
- Tabla Origen: Pedidos
- Tabla Destino: BikeComponents
- Campo Join: Pedidos::BikeComponentId = BikeComponents::Id
- Tipo: N:1
- Permitir crear registros: No
- Permitir borrar registros: No

---

## Índices Necesarios

### Índices en BikeComponents
- **PRIMARY KEY:** Id (único)
- **INDEX:** CategoriaId (búsquedas por categoría)
- **INDEX:** SubcategoriaId (búsquedas por subcategoría)
- **INDEX:** Activo (filtros de activos)
- **INDEX:** SKU (búsquedas por código)
- **UNIQUE:** SKU (si debe ser único)

### Índices en BikeComponentsTraduccion
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** ProductoId + IdiomaId (una traducción por idioma)
- **INDEX:** ProductoId (joins)
- **INDEX:** IdiomaId (filtros por idioma)

### Índices en BikeComponentsVariantes
- **PRIMARY KEY:** Id (único)
- **INDEX:** ProductoId (joins)
- **INDEX:** ColorId (joins con Colores)
- **INDEX:** Orden (ordenamiento)

### Índices en BikeComponentsPesos
- **PRIMARY KEY:** Id (único)
- **INDEX:** ProductoId (joins)
- **INDEX:** EsPrincipal (filtro peso principal)
- **INDEX:** Orden (ordenamiento)

### Índices en BikeComponentsPotencia
- **PRIMARY KEY:** Id (único)
- **INDEX:** ProductoId (joins)
- **INDEX:** Orden (ordenamiento)

### Índices en BikeComponentsImagenes
- **PRIMARY KEY:** Id (único)
- **INDEX:** ProductoId (joins)
- **INDEX:** VarianteId (joins)
- **INDEX:** ColorId (joins)
- **INDEX:** EsPrincipal (filtro imagen principal)
- **INDEX:** Activa (filtro imágenes activas)
- **INDEX:** Orden (ordenamiento)

### Índices en BikeComponentsEspecificaciones
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** ProductoId (una especificación por producto)

### Índices en Categorias
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** Codigo (códigos únicos)
- **INDEX:** Activo (filtros)
- **INDEX:** Orden (ordenamiento)

### Índices en CategoriasTraduccion
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** CategoriaId + IdiomaId
- **INDEX:** CategoriaId (joins)
- **INDEX:** IdiomaId (filtros)

### Índices en Colores
- **PRIMARY KEY:** Id (único)
- **INDEX:** Activo (filtros)
- **INDEX:** Orden (ordenamiento)

### Índices en Idiomas
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** Codigo (códigos únicos)
- **INDEX:** Activo (filtros)

### Índices en Pedidos
- **PRIMARY KEY:** Id (único)
- **UNIQUE INDEX:** NumeroPedido (números únicos)
- **INDEX:** BikeComponentId (joins)
- **INDEX:** EstadoPedido (filtros)
- **INDEX:** FechaPedido (ordenamiento)

---

## Mapeo de Tipos de Datos

### SQL Server → FileMaker

| SQL Server | FileMaker | Notas |
|-----------|-----------|-------|
| INT | Number | Sin decimales |
| DECIMAL(10,2) | Number (Decimal) | 2 decimales para precios |
| DECIMAL(8,2) | Number (Decimal) | 2 decimales para pesos |
| BIT | Number | 0 o 1 (boolean) |
| VARCHAR(n) | Text | Texto corto |
| NVARCHAR(n) | Text | Texto Unicode |
| DATETIME | Timestamp | Fecha y hora |
| DATETIME2 | Timestamp | Fecha y hora precisa |

### Valores Boolean en FileMaker
En FileMaker, los campos boolean se almacenan como Number:
- `1` = True / Sí / Activo
- `0` = False / No / Inactivo

**Importante:** Al consultar desde API, FileMaker devolverá "1" o "0" como texto en el JSON.

---

## Permisos y Seguridad

### Configuración de Privilegios

#### Usuario API (api/api)
**Permisos de lectura:**
- Todos los layouts terminados en `_Web`
- Solo registros con `Activo = 1` (excepto admin)

**Permisos de escritura:**
- Layout: Pedidos_Web (INSERT solo)
- No permitir DELETE
- No permitir UPDATE en otros layouts

#### Usuario Admin (web_eiros/Webeiros96!)
**Permisos completos:**
- Todos los layouts
- Todos los registros (incluidos inactivos)
- CREATE, READ, UPDATE, DELETE

---

## Datos de Prueba Requeridos

### Idiomas (3 registros)
```
INSERT: Id=1, Codigo='es', Nombre='Español', Activo=1, Orden=1
INSERT: Id=2, Codigo='ca', Nombre='Catalán', Activo=1, Orden=2
INSERT: Id=3, Codigo='en', Nombre='Inglés', Activo=1, Orden=3
```

### Categorias (mínimo 3 registros)
```
INSERT: Id=1, Codigo='mountain', TipoProducto='BikeComponents', Color='#50A1B0', Activo=1, Orden=1
INSERT: Id=2, Codigo='gravel', TipoProducto='BikeComponents', Color='#8B7355', Activo=1, Orden=2
INSERT: Id=3, Codigo='road', TipoProducto='BikeComponents', Color='#DC143C', Activo=1, Orden=3
```

### CategoriasTraduccion (9 registros: 3 categorías × 3 idiomas)
```
Mountain:
  INSERT: CategoriaId=1, IdiomaId=1, Nombre='Montaña', Descripcion='Productos para bicicletas de montaña'
  INSERT: CategoriaId=1, IdiomaId=2, Nombre='Muntanya', Descripcion='Productes per bicicletes de muntanya'
  INSERT: CategoriaId=1, IdiomaId=3, Nombre='Mountain', Descripcion='Products for mountain bikes'

Gravel:
  INSERT: CategoriaId=2, IdiomaId=1, Nombre='Gravel', Descripcion='Productos para bicicletas gravel'
  INSERT: CategoriaId=2, IdiomaId=2, Nombre='Gravel', Descripcion='Productes per bicicletes gravel'
  INSERT: CategoriaId=2, IdiomaId=3, Nombre='Gravel', Descripcion='Products for gravel bikes'

Road:
  INSERT: CategoriaId=3, IdiomaId=1, Nombre='Carretera', Descripcion='Productos para bicicletas de carretera'
  INSERT: CategoriaId=3, IdiomaId=2, Nombre='Carretera', Descripcion='Productes per bicicletes de carretera'
  INSERT: CategoriaId=3, IdiomaId=3, Nombre='Road', Descripcion='Products for road bikes'
```

### Colores (6 registros mínimos)
```
INSERT: Id=1, Nombre='carbon white', RutaLogo='/images/logos/colors/logo_blanco.png', CodigoHex='#DEDEDE', Orden=1, Activo=1
INSERT: Id=2, Nombre='carbon obsidian', RutaLogo='/images/logos/colors/logo_carbon.png', CodigoHex='#1A1A1A', Orden=2, Activo=1
INSERT: Id=3, Nombre='carbon matte black', RutaLogo='/images/logos/colors/logo_gris.png', CodigoHex='#333333', Orden=3, Activo=1
INSERT: Id=4, Nombre='carbon black', RutaLogo='/images/logos/colors/logo_negro.png', CodigoHex='#000000', Orden=4, Activo=1
INSERT: Id=5, Nombre='carbon red', RutaLogo='/images/logos/colors/logo_rojo.png', CodigoHex='#910000', Orden=5, Activo=1
INSERT: Id=6, Nombre='carbon custom', RutaLogo='/images/logos/colors/logo_patron_rojo.png', CodigoHex='#DC143C', Orden=6, Activo=1
```

---

## Checklist de Implementación

### Fase 1: Configuración Básica
- [ ] Crear tablas en EIROS_ERP
- [ ] Configurar layouts en WEB_EIROS
- [ ] Definir relaciones entre tablas
- [ ] Crear índices necesarios
- [ ] Configurar permisos de usuario api/api
- [ ] Configurar permisos de usuario web_eiros/Webeiros96!

### Fase 2: Portals
- [ ] Portal BikeComponentsTraduccion en layout BikeComponents_Web
- [ ] Portal BikeComponentsVariantes en layout BikeComponents_Web
- [ ] Portal BikeComponentsPesos en layout BikeComponents_Web
- [ ] Portal BikeComponentsPotencia en layout BikeComponents_Web
- [ ] Portal BikeComponentsImagenes en layout BikeComponents_Web
- [ ] Portal BikeComponentsEspecificaciones en layout BikeComponents_Web
- [ ] Portal CategoriasTraduccion en layout Categorias_Web
- [ ] Portal Colores_Info en layout BikeComponentsVariantes_Web

### Fase 3: Datos Iniciales
- [ ] Insertar 3 idiomas (es, ca, en)
- [ ] Insertar 3 categorías (mountain, gravel, road)
- [ ] Insertar 9 traducciones de categorías
- [ ] Insertar 6 colores básicos

### Fase 4: Migración de Datos
- [ ] Exportar datos de SQL Server
- [ ] Validar integridad de datos exportados
- [ ] Importar datos en FileMaker
- [ ] Verificar relaciones y portals
- [ ] Validar integridad referencial

### Fase 5: Testing
- [ ] Prueba de autenticación con usuario api/api
- [ ] Prueba de consulta de productos con portals
- [ ] Prueba de filtrado por categoría
- [ ] Prueba de traducciones por idioma
- [ ] Prueba de consulta de imágenes
- [ ] Prueba de inserción de pedidos
- [ ] Verificar tiempos de respuesta

---

## Notas Finales

### Convenciones de Nombres
- Layouts terminan en `_Web` para identificar endpoints API
- Campos con sufijo `Id` son Foreign Keys
- Campos boolean usan número (1/0)
- Fechas con prefijo `Fecha`

### Consideraciones de Performance
- Índices son críticos para consultas rápidas
- Portals con muchos registros pueden afectar rendimiento
- Considerar límites de registros en portals (max 100)
- Usar query específico en lugar de cargar todos los registros

### Próximos Pasos
1. Revisar esta especificación con el informático
2. Aclarar dudas sobre estructura de datos
3. Definir proceso de migración de datos SQL → FileMaker
4. Establecer calendario de implementación
5. Preparar entorno de pruebas

---

**Documento preparado para:** Informático del cliente  
**Fecha:** Noviembre 2025  
**Versión:** 1.0  
**Contacto:** Ramón Pérez  
