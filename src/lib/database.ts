import sql from 'mssql'

// Configuración de la base de datos
const config: sql.config = {
  ...(process.env.DB_USER ? {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'KzsnHsv6Z1w3',
  } : {
    options: {
      trustedConnection: true,
    }
  }),
  server: process.env.DB_SERVER || '192.168.3.100',
  database: process.env.DB_DATABASE || 'EirosBCN',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 60000,
  requestTimeout: 60000,
}

let pool: sql.ConnectionPool | null = null

export async function getDbConnection(): Promise<sql.ConnectionPool> {
  try {
    if (pool) {
      // Verificar si el pool está conectado
      if (pool.connected) {
        return pool
      }
    }
    // Crear nuevo pool de conexiones
    pool = new sql.ConnectionPool(config)

    // Intentar conectar
    await pool.connect()
    return pool

  } catch (error) {
    // Limpiar pool fallido
    pool = null
    throw error
  }
}

export async function closeDbConnection(): Promise<void> {
  try {
    if (pool) {
      await pool.close()
      pool = null
    }
  } catch (error) {
    console.error('❌ [DB] Error cerrando conexión:', error)
  }
}

export { sql }
