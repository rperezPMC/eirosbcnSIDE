import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    
    return NextResponse.json({
      success: true,
      message: "Endpoint debug básico funciona",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
