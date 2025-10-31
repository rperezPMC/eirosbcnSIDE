import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  return (
    <div 
      className={clsx(
        'inline-block animate-spin rounded-full border-solid border-r-transparent',
        {
          'h-4 w-4 border-2': size === 'small',
          'h-8 w-8 border-2': size === 'medium', 
          'h-12 w-12 border-4': size === 'large',
        },
        'border-luxury-gold',
        className
      )}
    >
      <span className='sr-only'>Cargando...</span>
    </div>
  )
}
