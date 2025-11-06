import React from 'react'
import { cn } from '../../lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
}

/**
 * Avatar Component
 * Muestra imagen de usuario con fallback a iniciales
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt = 'Avatar', 
    fallback,
    size = 'md',
    shape = 'circle',
    ...props 
  }, ref) => {
    
    const [imageError, setImageError] = React.useState(false)

    const avatarSizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-24 w-24 text-2xl',
      '2xl': 'h-32 w-32 text-3xl',
    }

    const avatarShapes = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    }

    // Obtener iniciales del fallback
    const getInitials = (text?: string) => {
      if (!text) return '?'
      const parts = text.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return text.substring(0, 2).toUpperCase()
    }

    const showFallback = !src || imageError

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-400',
          'font-semibold text-white',
          avatarSizes[size],
          avatarShapes[shape],
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span>{getInitials(fallback || alt)}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
export type { AvatarProps }
