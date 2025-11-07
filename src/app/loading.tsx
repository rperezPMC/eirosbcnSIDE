'use client'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black">
      <img
        src="/images/logos/logo_small_azul.svg"
        alt="Cargando"
        className="w-16 h-16 animate-pulse"
      />
    </div>
  )
}
