import React from 'react'
<<<<<<< HEAD
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
=======
import { cn } from '../../lib/utils'
>>>>>>> 685ffb4724d98a3de8339d16637dea0a4a18d947

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
<<<<<<< HEAD
  helperText?: string
  options: Array<{ label: string; value: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    options,
    disabled,
    ...props 
  }, ref) => {
    const hasError = Boolean(error)

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            className={cn(
              // Base styles
              'w-full px-4 py-2.5 pr-10 rounded-lg border text-base appearance-none',
              'transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              
              // States
              !hasError && !disabled && [
                'border-gray-300 bg-white text-gray-900',
                'hover:border-gray-400',
                'focus:border-primary-500 focus:ring-primary-500',
              ],
              hasError && [
                'border-error bg-red-50 text-gray-900',
                'focus:border-error focus:ring-error',
              ],
              disabled && [
                'bg-gray-100 text-gray-500 cursor-not-allowed',
                'border-gray-200',
              ],
              
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className={cn(
              'h-5 w-5',
              disabled ? 'text-gray-400' : 'text-gray-500'
            )} />
          </div>
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p className={cn(
            'mt-1.5 text-sm',
            hasError ? 'text-error' : 'text-gray-600'
          )}>
            {error || helperText}
          </p>
=======
  options?: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'appearance-none bg-no-repeat bg-right',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
          }}
          ref={ref}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
>>>>>>> 685ffb4724d98a3de8339d16637dea0a4a18d947
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
export type { SelectProps }
