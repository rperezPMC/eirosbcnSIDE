const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Configuración de conexión a la BD
const config = {
  user: 'sa',
  password: 'KzsnHsv6Z1w3',
  server: '192.168.3.100',
  database: 'EirosBCN',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  connectionTimeout: 60000,
  requestTimeout: 60000,
};

// Directorio de salida para los JSON
const outputDir = path.join(__dirname, '..', 'src', 'data');

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function extractData() {
  let pool;
  
  try {
    console.log('🔌 Conectando a base de datos...');
    pool = await sql.connect(config);
    console.log('✅ Conexión exitosa\n');

    // Extraer productos
    console.log('📦 Extrayendo productos...');
    const productosResult = await pool.request().query(`
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM ImagenProducto WHERE ProductoId = p.Id) as TotalImagenes
      FROM Productos p
      ORDER BY p.Id
    `);
    const productos = productosResult.recordset;
    console.log(`   ✓ ${productos.length} productos extraídos`);

    // Extraer imágenes
    console.log('🖼️  Extrayendo imágenes de productos...');
    const imagenesResult = await pool.request().query(`
      SELECT *
      FROM ImagenProducto
      ORDER BY ProductoId, Orden
    `);
    const imagenes = imagenesResult.recordset;
    console.log(`   ✓ ${imagenes.length} imágenes extraídas`);

    // Extraer colores
    console.log('🎨 Extrayendo colores...');
    const coloresResult = await pool.request().query(`
      SELECT *
      FROM Colores
      ORDER BY Nombre
    `);
    const colores = coloresResult.recordset;
    console.log(`   ✓ ${colores.length} colores extraídos`);

    // Extraer pedidos
    console.log('📋 Extrayendo pedidos...');
    const pedidosResult = await pool.request().query(`
      SELECT *
      FROM Pedidos
      ORDER BY FechaCreacion DESC
    `);
    const pedidos = pedidosResult.recordset;
    console.log(`   ✓ ${pedidos.length} pedidos extraídos\n`);

    // Organizar datos por producto
    const productosConImagenes = productos.map(producto => ({
      ...producto,
      imagenes: imagenes
        .filter(img => img.ProductoId === producto.Id)
        .map(img => ({
          Id: img.Id,
          ProductoId: img.ProductoId,
          UrlImagen: img.UrlImagen,
          Tipo: img.Tipo,
          Orden: img.Orden,
          EsPrincipal: img.EsPrincipal,
          FechaCreacion: img.FechaCreacion
        }))
    }));

    // Guardar productos completos
    console.log('💾 Guardando archivos JSON...');
    const productosPath = path.join(outputDir, 'productos.json');
    fs.writeFileSync(
      productosPath,
      JSON.stringify(productosConImagenes, null, 2),
      'utf-8'
    );
    console.log(`   ✓ productos.json guardado (${productosConImagenes.length} registros)`);

    // Guardar colores
    const coloresPath = path.join(outputDir, 'colores.json');
    fs.writeFileSync(
      coloresPath,
      JSON.stringify(colores, null, 2),
      'utf-8'
    );
    console.log(`   ✓ colores.json guardado (${colores.length} registros)`);

    // Guardar pedidos
    const pedidosPath = path.join(outputDir, 'pedidos.json');
    fs.writeFileSync(
      pedidosPath,
      JSON.stringify(pedidos, null, 2),
      'utf-8'
    );
    console.log(`   ✓ pedidos.json guardado (${pedidos.length} registros)\n`);

    // Guardar también productos separados por tipo
    const manillares = productosConImagenes.filter(p => p.TipoProducto === 'Manillares');
    const textil = productosConImagenes.filter(p => p.TipoProducto === 'Textil');

    const manillaresPath = path.join(outputDir, 'productos-manillares.json');
    fs.writeFileSync(
      manillaresPath,
      JSON.stringify(manillares, null, 2),
      'utf-8'
    );
    console.log(`   ✓ productos-manillares.json guardado (${manillares.length} registros)`);

    const textilPath = path.join(outputDir, 'productos-textil.json');
    fs.writeFileSync(
      textilPath,
      JSON.stringify(textil, null, 2),
      'utf-8'
    );
    console.log(`   ✓ productos-textil.json guardado (${textil.length} registros)\n`);

    // Resumen final
    console.log('🎉 EXTRACCIÓN COMPLETADA CON ÉXITO');
    console.log('═══════════════════════════════════');
    console.log(`📁 Archivos generados en: ${outputDir}`);
    console.log(`📊 Total productos: ${productos.length}`);
    console.log(`   - Manillares: ${manillares.length}`);
    console.log(`   - Textil: ${textil.length}`);
    console.log(`🖼️  Total imágenes: ${imagenes.length}`);
    console.log(`🎨 Total colores: ${colores.length}`);
    console.log(`📋 Total pedidos: ${pedidos.length}`);

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA EXTRACCIÓN:');
    console.error(error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar extracción
extractData();