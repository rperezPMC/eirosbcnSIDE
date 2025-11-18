// Configuración de FileMaker Data API

export const fileMakerConfig = {
  host: process.env.FM_HOST || 'https://192.168.200.101',
  dbFrontend: process.env.FM_DB_FRONTEND || 'WEB_EIROS',
  dbBackend: process.env.FM_DB_BACKEND || 'EIROS_ERP',
  apiVersion: process.env.FM_API_VERSION || 'vLatest',
  
  // Autenticación frontend (WEB_EIROS)
  authBasic: process.env.FM_AUTH_BASIC || 'd2ViX2Vpcm9zOldlYmVpcm9zOTYh',
  
  // Autenticación backend (EIROS_ERP)
  dataUser: process.env.FM_DATA_USER || 'api',
  dataPassword: process.env.FM_DATA_PASSWORD || 'api',
  
  // Configuración de tokens
  tokenExpiryMinutes: 14, // Renovar antes de 15 min
  
  // Configuración de requests
  requestTimeout: 30000, // 30 segundos
  maxRetries: 3
}

export type FileMakerConfig = typeof fileMakerConfig
