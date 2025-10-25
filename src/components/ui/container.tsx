import React from 'react'
import { cn } from '../../lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}

/**
 * Container Component
 * Centra el contenido con padding responsivo y ancho máximo configurable
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', children, ...props }, ref) => {
    
    const containerSizes = {
      sm: 'max-w-3xl',   // ~768px
      md: 'max-w-5xl',   // ~1024px
      lg: 'max-w-6xl',   // ~1152px
      xl: 'max-w-7xl',   // ~1280px
      full: 'max-w-full', // Sin límite
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          containerSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export { Container }
export type { ContainerProps }
