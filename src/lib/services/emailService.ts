import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuración SMTP:', error)
  } else {
    console.log('Servidor SMTP listo para enviar correos')
  }
})

interface PedidoEmail {
  numPedido: string
  pedidoId: number
  nombreCliente: string
  email: string
  telefono?: string
  pais: string
  ciudad: string
  nombreProducto: string
  sku: string
  colorSeleccionado: string
  potenciaSeleccionada: string
  pesoSeleccionado: string
  precio: number
  mensaje?: string
  locale?: string
  especificaciones?: {
    backsweep?: string
    upsweep?: string
    clampDiameter?: string
    material?: string
    construction?: string
  }
}

// Textos multiidioma para correo cliente
const emailTexts = {
  es: {
    subject: 'Confirmación de Pedido',
    header: '¡Pedido Recibido!',
    thanks: 'Gracias por confiar en Eiros BCN',
    greeting: 'Hola',
    message1: 'Hemos recibido tu solicitud de reserva correctamente. Nuestro equipo revisará tu pedido y se pondrá en contacto contigo muy pronto para confirmar la disponibilidad y coordinar los siguientes pasos a realizar.',
    message2: 'Tu número de pedido es:',
    summaryTitle: 'Resumen de tu Pedido',
    product: 'Producto',
    color: 'Color',
    potency: 'Potencia',
    weight: 'Peso',
    total: 'Total',
    nextSteps: 'Próximos pasos:',
    step1: '1. Verificaremos la disponibilidad del producto',
    step2: '2. Te contactaremos para confirmar tu pedido',
    step3: '3. Te proporcionaremos información sobre el pago y envío',
    footerTitle: 'Eiros BCN',
    footerSubtitle: 'Componentes de fibra de carbono fabricados en Barcelona',
    question: '¿Tienes alguna pregunta?',
    orderDate: 'Pedido realizado el'
  },
  ca: {
    subject: 'Confirmació de Comanda',
    header: 'Comanda Rebuda!',
    thanks: 'Gràcies per confiar en Eiros BCN',
    greeting: 'Hola',
    message1: 'Hem rebut la teva sol·licitud de reserva correctament. El nostre equip revisarà la teva comanda i es posarà en contacte amb tu molt aviat per confirmar la disponibilitat i coordinar els següents passos a realitzar.',
    message2: 'El teu número de comanda és:',
    summaryTitle: 'Resum de la teva Comanda',
    product: 'Producte',
    color: 'Color',
    potency: 'Potència',
    weight: 'Pes',
    total: 'Total',
    nextSteps: 'Propers passos:',
    step1: '1. Verificarem la disponibilitat del producte',
    step2: '2. Et contactarem per confirmar la teva comanda',
    step3: '3. Et proporcionarem informació sobre el pagament i enviament',
    footerTitle: 'Eiros BCN',
    footerSubtitle: 'Components de fibra de carboni fabricats a Barcelona',
    question: 'Tens alguna pregunta?',
    orderDate: 'Comanda realitzada el'
  },
  en: {
    subject: 'Order Confirmation',
    header: 'Order Received!',
    thanks: 'Thank you for trusting Eiros BCN',
    greeting: 'Hello',
    message1: 'We have successfully received your reservation request. Our team will review your order and contact you very soon to confirm availability and coordinate the next steps to be taken.',
    message2: 'Your order number is:',
    summaryTitle: 'Order Summary',
    product: 'Product',
    color: 'Color',
    potency: 'Stem',
    weight: 'Weight',
    total: 'Total',
    nextSteps: 'Next steps:',
    step1: '1. We will verify product availability',
    step2: '2. We will contact you to confirm your order',
    step3: '3. We will provide payment and shipping information',
    footerTitle: 'Eiros BCN',
    footerSubtitle: 'Carbon fiber components manufactured in Barcelona',
    question: 'Have any questions?',
    orderDate: 'Order placed on'
  }
}

const nlTexts = {
  es: {
    subject: 'Bienvenido a la newsletter',
    title: '¡Bienvenido!',
    p1: 'Te has suscrito correctamente a nuestra newsletter.',
    p2: 'Pronto recibirás noticias, lanzamientos y ofertas exclusivas.',
    bye: 'Gracias por unirte a la comunidad Eiros BCN.',
  },
  ca: {
    subject: 'Benvingut al butlletí',
    title: 'Benvingut!',
    p1: 'T’has subscrit correctament al nostre butlletí.',
    p2: 'Aviat rebràs notícies, llançaments i ofertes exclusives.',
    bye: 'Gràcies per unir-te a la comunitat Eiros BCN.',
  },
  en: {
    subject: 'Welcome to our newsletter',
    title: 'Welcome!',
    p1: 'You have successfully subscribed to our newsletter.',
    p2: 'You will soon receive news, launches and exclusive offers.',
    bye: 'Thanks for joining the Eiros BCN community.',
  }
}

// Correo al admin (siempre en español)
export async function enviarCorreoPedido(pedido: PedidoEmail) {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', Arial, sans-serif; background: #f4f4f4; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #50a1b0 0%, #3d8291 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .section:last-child { border-bottom: none; margin-bottom: 0; }
        .section h3 { color: #50a1b0; border-bottom: 2px solid #50a1b0; padding-bottom: 10px; margin-bottom: 15px; font-size: 18px; }
        .info-row { display: flex; margin-bottom: 10px; align-items: flex-start; }
        .info-label { font-weight: 600; min-width: 160px; color: #666; font-size: 14px; }
        .info-value { color: #333; font-size: 14px; flex: 1; }
        .price { font-size: 26px; color: #50a1b0; font-weight: bold; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nuevo Pedido</h1>
          <p>${pedido.numPedido}</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>📋 Información del Cliente</h3>
            <div class="info-row"><span class="info-label">Nombre:</span><span class="info-value">${pedido.nombreCliente}</span></div>
            <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${pedido.email}</span></div>
            <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${pedido.telefono || 'No especificado'}</span></div>
            <div class="info-row"><span class="info-label">Ubicación:</span><span class="info-value">${pedido.ciudad}, ${pedido.pais}</span></div>
          </div>
          <div class="section">
            <h3>🚴 Detalles del Producto</h3>
            <div class="info-row"><span class="info-label">Producto:</span><span class="info-value"><strong>${pedido.nombreProducto}</strong></span></div>
            <div class="info-row"><span class="info-label">Color:</span><span class="info-value">${pedido.colorSeleccionado}</span></div>
            <div class="info-row"><span class="info-label">Mensaje:</span><span class="info-value">${pedido.mensaje}</span></div>
          </div>
        </div>
        <div class="footer"><p>Pedido recibido: ${new Date().toLocaleString('es-ES')}</p></div>
      </div>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Eiros BCN" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 Nuevo Pedido ${pedido.numPedido} - ${pedido.nombreProducto}`,
      html
    })
    console.log('✅ Correo enviado al admin:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error enviando correo:', error)
    throw new Error('Error al enviar correo de notificación')
  }
}

// Correo al cliente (multiidioma)
export async function enviarCorreoConfirmacionCliente(pedido: PedidoEmail) {
  const locale = pedido.locale || 'es'
  const t = emailTexts[locale as keyof typeof emailTexts] || emailTexts.es

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', Arial, sans-serif; background: #f4f4f4; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #50a1b0 0%, #3d8291 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
        .header p { margin: 15px 0 0 0; font-size: 16px; opacity: 0.9; }
        .check-icon { font-size: 64px; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .message-box { background: #f0f9fb; border-left: 4px solid #50a1b0; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .message-box p { color: #555; line-height: 1.8; margin-bottom: 10px; }
        .message-box p:last-child { margin-bottom: 0; }
        .section { margin-bottom: 25px; padding: 20px; background: #f8f8f8; border-radius: 8px; }
        .section h3 { color: #50a1b0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #50a1b0; padding-bottom: 8px; }
        .info-row { display: flex; margin-bottom: 12px; align-items: flex-start; }
        .info-label { font-weight: 600; min-width: 140px; color: #666; font-size: 14px; }
        .info-value { color: #333; font-size: 14px; flex: 1; }
        .price-highlight { text-align: center; padding: 20px; background: linear-gradient(135deg, #50a1b0 0%, #3d8291 100%); color: white; border-radius: 8px; margin: 25px 0; }
        .price-highlight p { margin: 0; font-size: 14px; opacity: 0.9; }
        .price { font-size: 36px; font-weight: bold; margin: 10px 0; }
        .order-number { display: inline-block; background: #50a1b0; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .footer { background: #2a2a2a; padding: 30px; text-align: center; color: #ccc; }
        .footer p { margin: 8px 0; font-size: 13px; }
        .footer strong { color: #50a1b0; }
        .contact-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #444; }
        @media only screen and (max-width: 600px) {
          .info-row { flex-direction: column; }
          .info-label { min-width: auto; margin-bottom: 5px; }
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="check-icon">✓</div>
          <h1>${t.header}</h1>
          <p>${t.thanks}</p>
        </div>
        
        <div class="content">
          <p class="greeting">${t.greeting} <strong>${pedido.nombreCliente}</strong>,</p>
          
          <div class="message-box">
            <p>${t.message1}</p>
          </div>

          <div class="section">
            <h3>🚴 ${t.summaryTitle}</h3>
            <div class="info-row"><span class="info-label">${t.product}:</span><span class="info-value"><strong>${pedido.nombreProducto}</strong></span></div>
            <div class="info-row"><span class="info-label">${t.color}:</span><span class="info-value">${pedido.colorSeleccionado}</span></div>
          </div>

        </div>
        
        <div class="footer">
          <p><strong>${t.footerTitle}</strong></p>
          <p>${t.footerSubtitle}</p>
          <div class="contact-info">
            <p>${t.question}</p>
            <p><strong>Email:</strong> ${process.env.ADMIN_EMAIL}</p>
          </div>
          <p style="margin-top: 20px; font-size: 11px; color: #888;">
            ${t.orderDate} ${new Date().toLocaleString(locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-US' : 'es-ES', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Eiros BCN" <${process.env.SMTP_USER}>`,
      to: pedido.email,
      subject: `✓ ${t.subject} ${pedido.numPedido} - Eiros BCN`,
      html
    })
    console.log(`✅ Correo confirmación enviado al cliente (${locale}):`, info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error enviando correo confirmación:', error)
    throw new Error('Error al enviar correo de confirmación al cliente')
  }
}

// --- en emailService.ts ---
export async function enviarCorreoNewsletterAdmin(params: { email: string; locale?: string }) {
  const { email, locale } = params
  const html = `
  <!DOCTYPE html>
  <html lang="es"><head><meta charset="UTF-8">
    <style>
      body { font-family: Montserrat, Arial, sans-serif; background:#f4f4f4; padding:20px; }
      .container { max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #50a1b0 0%, #3d8291 100%); color:#fff; padding:24px 30px; text-align:center; }
      .content { padding:30px; color:#333; }
      .row { margin-bottom:10px; }
      .label { color:#666; min-width:140px; display:inline-block; }
      .footer { background:#f8f8f8; padding:16px; text-align:center; color:#999; font-size:12px; }
    </style>
  </head><body>
    <div class="container">
      <div class="header"><h1>📰 Nuevo suscriptor Newsletter</h1></div>
      <div class="content">
        <div class="row"><span class="label">Email:</span> <strong>${email}</strong></div>
        <div class="row"><span class="label">Idioma:</span> ${locale || 'es'}</div>
        <div class="row"><span class="label">Fecha:</span> ${new Date().toLocaleString('es-ES')}</div>
      </div>
      <div class="footer">Eiros BCN — Newsletter</div>
    </div>
  </body></html>`

  const info = await transporter.sendMail({
    from: `"Eiros BCN" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📰 Nuevo suscriptor newsletter: ${email}`,
    html
  })
  console.log('✅ Newsletter admin:', info.messageId)
  return { success: true, messageId: info.messageId }
}

export async function enviarCorreoNewsletterBienvenida(params: { email: string; locale?: string }) {
  const { email, locale = 'es' } = params
  const t = (nlTexts as any)[locale] || nlTexts.es

  const html = `
  <!DOCTYPE html>
  <html lang="${locale}"><head><meta charset="UTF-8">
    <style>
      body { font-family: Montserrat, Arial, sans-serif; background:#f4f4f4; padding:20px; }
      .container { max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #50a1b0 0%, #3d8291 100%); color:#fff; padding:36px 30px; text-align:center; }
      .header h1 { margin:0; }
      .content { padding:30px; color:#333; line-height:1.7; }
      .footer { background:#2a2a2a; color:#ccc; text-align:center; padding:18px; font-size:12px; }
    </style>
  </head><body>
    <div class="container">
      <div class="header"><h1>${t.title}</h1></div>
      <div class="content">
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <p style="margin-top:12px;">${t.bye}</p>
      </div>
      <div class="footer">
        Eiros BCN · ${new Date().toLocaleDateString(locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-US' : 'es-ES')}
      </div>
    </div>
  </body></html>`

  const info = await transporter.sendMail({
    from: `"Eiros BCN" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `✓ ${t.subject} - Eiros BCN`,
    html
  })
  console.log('✅ Newsletter bienvenida:', info.messageId)
  return { success: true, messageId: info.messageId }
}
