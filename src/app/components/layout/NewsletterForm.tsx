'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export function NewsletterForm() {
  const t = useTranslations('Footer')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [botField, setBotField] = useState('')
  const [showButton, setShowButton] = useState(false) // CTA superpuesto visible
  const inputRef = useRef<HTMLInputElement>(null)

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  )

  // Debounce: mostrar CTA cuando el usuario deja de escribir y el email es válido
  useEffect(() => {
    const to = setTimeout(() => setShowButton(isValidEmail && email.trim().length > 0), 350)
    return () => clearTimeout(to)
  }, [email, isValidEmail])

  // Esc para volver a editar
  useEffect(() => {
    if (!showButton) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowButton(false)
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showButton])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (botField || !isValidEmail) return
    setLoading(true); setError(null); setOk(false)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setOk(true)
      setEmail('')
      setShowButton(false)
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const backToEdit = () => {
    setShowButton(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        value={botField}
        onChange={(e) => setBotField(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="relative w-full h-9">
        {/* Input visible cuando no hay CTA */}
        {!showButton && (
          <input
            ref={inputRef}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('social.newsletterPlaceholder')}
            className="w-full h-full bg-white/20 rounded-[30px] px-4 text-sm text-luxury-grey text-center placeholder:text-luxury-grey font-montserrat outline-none border-none transition-all"
          />
        )}

        {/* CTA superpuesto (mismo tamaño que el input) */}
        {showButton && (
          <>
            <button
              type="submit"
              disabled={loading || !isValidEmail}
              className="absolute top-0 left-0 w-full h-full rounded-[30px] text-sm font-semibold bg-[#50a1b0] text-white hover:bg-[#5bb5c5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('social.newsletterSending') : t('social.newsletterCTA')}
            </button>

            {/* Botón “Cambiar” para volver a editar */}
            <button
              type="button"
              onClick={backToEdit}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] px-2 py-0.5 rounded-full bg-white/25 hover:bg-white/35 text-white font-medium"
              aria-label="Cambiar email"
            >
              ✎ {t('social.newsletterEdit') ?? 'Cambiar'}
            </button>
          </>
        )}
      </div>

      {ok && (
        <p role="status" className="mt-2 text-xs text-[#50a1b0] text-center">
          {t('social.newsletterSuccess')}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400 text-center">
          {t('social.newsletterError')}
        </p>
      )}
    </form>
  )
}