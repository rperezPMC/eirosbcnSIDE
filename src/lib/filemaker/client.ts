// Cliente FileMaker Data API

import { fileMakerConfig } from './config'
import { fileMakerConnection } from './connection'
import { FileMakerResponse, FindOptions } from './types'

class FileMakerClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<FileMakerResponse<T>> {
    const token = await fileMakerConnection.getToken()

    const url = `${fileMakerConfig.host}/fmi/data/${fileMakerConfig.apiVersion}/databases/${fileMakerConfig.dbFrontend}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`FileMaker request failed: ${response.status} ${response.statusText}`)
      }

      const data: FileMakerResponse<T> = await response.json()

      if (data.messages[0]?.code !== '0') {
        throw new Error(`FileMaker error: ${data.messages[0]?.message}`)
      }

      return data

    } catch (error) {
      console.error('[FileMaker] Request error:', error)
      throw error
    }
  }

  // Obtener todos los registros de un layout
  async getAllRecords<T>(
    layout: string,
    options?: { limit?: number; offset?: number }
  ): Promise<T[]> {
    const params = new URLSearchParams()
    if (options?.limit) params.append('_limit', options.limit.toString())
    if (options?.offset) params.append('_offset', options.offset.toString())

    const queryString = params.toString() ? `?${params.toString()}` : ''
    const endpoint = `/layouts/${layout}/records${queryString}`

    const data = await this.makeRequest<T>(endpoint)

    return data.response.data?.map(record => record.fieldData) || []
  }

  // Buscar registros con query
  async findRecords<T>(
    layout: string,
    query: any[],
    options?: FindOptions
  ): Promise<{
    records: T[]
    dataInfo?: FileMakerResponse<T>['response']['dataInfo']
  }> {
    const body: any = { query }

    if (options?.sort) body.sort = options.sort
    if (options?.limit) body.limit = options.limit
    if (options?.offset) body.offset = options.offset
    if (options?.portal) body.portal = options.portal

    const endpoint = `/layouts/${layout}/_find`

    const data = await this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    return {
      records: data.response.data?.map(record => record.fieldData) || [],
      dataInfo: data.response.dataInfo
    }
  }

  // Obtener un registro por ID
  async getRecordById<T>(
    layout: string,
    recordId: string | number
  ): Promise<T | null> {
    try {
      const endpoint = `/layouts/${layout}/records/${recordId}`
      const data = await this.makeRequest<T>(endpoint)

      return data.response.data?.[0]?.fieldData || null
    } catch (error) {
      console.error(`[FileMaker] Error obteniendo registro ${recordId}:`, error)
      return null
    }
  }

  // Crear un registro
  async createRecord<T>(
    layout: string,
    fieldData: Partial<T>
  ): Promise<{ recordId: string; fieldData: T } | null> {
    try {
      const endpoint = `/layouts/${layout}/records`
      const data = await this.makeRequest<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ fieldData })
      })

      return {
        recordId: data.response.data?.[0]?.recordId || '',
        fieldData: data.response.data?.[0]?.fieldData as T
      }
    } catch (error) {
      console.error('[FileMaker] Error creando registro:', error)
      return null
    }
  }

  // Editar un registro
  async editRecord<T>(
    layout: string,
    recordId: string | number,
    fieldData: Partial<T>
  ): Promise<boolean> {
    try {
      const endpoint = `/layouts/${layout}/records/${recordId}`
      await this.makeRequest<T>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ fieldData })
      })

      return true
    } catch (error) {
      console.error(`[FileMaker] Error editando registro ${recordId}:`, error)
      return false
    }
  }

  // Eliminar un registro
  async deleteRecord(
    layout: string,
    recordId: string | number
  ): Promise<boolean> {
    try {
      const endpoint = `/layouts/${layout}/records/${recordId}`
      await this.makeRequest(endpoint, { method: 'DELETE' })

      return true
    } catch (error) {
      console.error(`[FileMaker] Error eliminando registro ${recordId}:`, error)
      return false
    }
  }
}

// Instancia singleton
export const fileMakerClient = new FileMakerClient()
