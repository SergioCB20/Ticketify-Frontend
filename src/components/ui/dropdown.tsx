"use client";
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right'
}

const Dropdown = ({ trigger, children, className, align = 'right' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'danger'
  icon?: React.ReactNode
  danger?: boolean
}

const DropdownItem = ({ children, onClick, className, variant = 'default', icon, danger }: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2',
        'hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg',
        (variant === 'danger' || danger) && 'text-red-600 hover:bg-red-50',
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

const DropdownDivider = () => {
  return <div className="my-1 h-px bg-gray-200" />
}

export { Dropdown, DropdownItem, DropdownDivider }