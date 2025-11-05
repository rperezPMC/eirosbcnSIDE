import { NextResponse } from 'next/server'
import { enviarCorreoNewsletterAdmin, enviarCorreoNewsletterBienvenida } from '@/lib/services/emailService'

export const runtime = 'nodejs' // necesario para nodemailer

// regex simple de validación de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { email, locale = 'es' } = await req.json()

    // validar email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // enviar correo al admin (notificación interna)
    await enviarCorreoNewsletterAdmin({ email, locale })

    // enviar correo de confirmación / bienvenida al cliente
    await enviarCorreoNewsletterBienvenida({ email, locale })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('❌ Error al procesar newsletter:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}
