// Gestión de conexión y tokens de FileMaker

import { fileMakerConfig } from './config'

class FileMakerConnection {
  private token: string | null = null
  private tokenExpiry: number = 0

  async getToken(): Promise<string> {
    // Si el token está válido y no expira en los próximos 2 minutos, reutilizarlo
    if (this.token && Date.now() < this.tokenExpiry - 120000) {
      return this.token
    }

    console.log('[FileMaker] Obteniendo nuevo token...')

    try {
      const response = await fetch(
        `${fileMakerConfig.host}/fmi/data/${fileMakerConfig.apiVersion}/databases/${fileMakerConfig.dbFrontend}/sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${fileMakerConfig.authBasic}`
          },
          body: JSON.stringify({
            fmDataSource: [{
              database: fileMakerConfig.dbBackend,
              username: fileMakerConfig.dataUser,
              password: fileMakerConfig.dataPassword
            }]
          })
        }
      )

      if (!response.ok) {
        throw new Error(`FileMaker auth failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.messages[0]?.code !== '0') {
        throw new Error(`FileMaker error: ${data.messages[0]?.message}`)
      }

      this.token = data.response.token
      this.tokenExpiry = Date.now() + fileMakerConfig.tokenExpiryMinutes * 60 * 1000

      console.log('[FileMaker] Token obtenido exitosamente')
      return this.token

    } catch (error) {
      console.error('[FileMaker] Error obteniendo token:', error)
      this.token = null
      this.tokenExpiry = 0
      throw error
    }
  }

  async closeSession(): Promise<void> {
    if (!this.token) return

    try {
      await fetch(
        `${fileMakerConfig.host}/fmi/data/${fileMakerConfig.apiVersion}/databases/${fileMakerConfig.dbFrontend}/sessions/${this.token}`,
        { method: 'DELETE' }
      )
      console.log('[FileMaker] Sesión cerrada')
    } catch (error) {
      console.error('[FileMaker] Error cerrando sesión:', error)
    } finally {
      this.token = null
      this.tokenExpiry = 0
    }
  }

  isTokenValid(): boolean {
    return this.token !== null && Date.now() < this.tokenExpiry
  }
}

// Instancia singleton
export const fileMakerConnection = new FileMakerConnection()
