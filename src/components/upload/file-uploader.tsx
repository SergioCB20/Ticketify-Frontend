'use client'

import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface FileUploaderProps {
  label?: string
  required?: boolean
  accept?: 'image' | 'video' | 'both'
  maxSizeMB?: number
  value?: File | null
  preview?: string | null
  onChange: (file: File | null) => void
  onPreviewChange?: (preview: string | null) => void
  error?: string
  hint?: string
  disabled?: boolean
  uploading?: boolean
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label = 'Archivo',
  required = false,
  accept = 'both',
  maxSizeMB = 5,
  value,
  preview,
  onChange,
  onPreviewChange,
  error,
  hint,
  disabled = false,
  uploading = false,
}) => {
  const [dragActive, setDragActive] = useState(false)
  
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`
  
  // Determine accepted file types
  const getAcceptAttribute = () => {
    if (accept === 'image') return 'image/*'
    if (accept === 'video') return 'video/*'
    return 'image/*,video/*'
  }
  
  const getAcceptedFormats = () => {
    if (accept === 'image') return 'JPG, PNG, GIF, WEBP'
    if (accept === 'video') return 'MP4, AVI, MOV, WMV, WEBM'
    return 'JPG, PNG, GIF, WEBP, MP4, AVI, MOV, WMV, WEBM'
  }
  
  const getIcon = () => {
    if (accept === 'image') return '📷'
    if (accept === 'video') return '🎥'
    return '📁'
  }
  
  const isImage = (file: File) => file.type.startsWith('image/')
  const isVideo = (file: File) => file.type.startsWith('video/')
  
  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null)
      onPreviewChange?.(null)
      return
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      // Error will be handled by parent component
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      onPreviewChange?.(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    onChange(file)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }
  
  const handleRemove = () => {
    onChange(null)
    onPreviewChange?.(null)
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled || uploading) return
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }
  
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {preview ? (
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Preview based on file type */}
          {value && isImage(value) && (
            <img 
              src={preview} 
              alt="Vista previa" 
              className="w-full h-64 object-cover"
            />
          )}
          
          {value && isVideo(value) && (
            <video 
              src={preview} 
              className="w-full h-48 object-cover"
              controls
            />
          )}
          
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar archivo"
          >
            <X size={20} />
          </button>
          
          {/* Change button overlay for images */}
          {value && isImage(value) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <input
                type="file"
                accept={getAcceptAttribute()}
                onChange={handleInputChange}
                className="hidden"
                id={`${inputId}-change`}
                disabled={disabled || uploading}
              />
              <label htmlFor={`${inputId}-change`} className="cursor-pointer">
                <Button variant="primary" size="sm" type="button" disabled={disabled || uploading}>
                  <Upload size={16} className="mr-2" />
                  Cambiar Archivo
                </Button>
              </label>
            </div>
          )}
          
          {/* File name badge */}
          {value && (
            <div className={`${isImage(value) ? 'absolute bottom-2 left-2' : 'mt-2'} bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow inline-block`}>
              ✓ {value.name}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer bg-gray-50 ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          } ${
            disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500 hover:bg-primary-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={getAcceptAttribute()}
            onChange={handleInputChange}
            className="hidden"
            id={inputId}
            disabled={disabled || uploading}
          />
          <label htmlFor={inputId} className={disabled || uploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
            <div className="text-7xl text-gray-300 mb-4">{getIcon()}</div>
            <div className="flex items-center justify-center space-x-2 text-primary-600 font-medium">
              <Upload size={20} />
              <span>{dragActive ? 'Suelta el archivo aquí' : 'Cargar Archivo'}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {getAcceptedFormats()} (Max. {maxSizeMB}MB)
            </p>
            {hint && (
              <p className="mt-1 text-xs text-gray-400">{hint}</p>
            )}
          </label>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {uploading && (
        <p className="mt-2 text-sm text-primary-600 flex items-center">
          <span className="animate-spin mr-2">⏳</span> Subiendo archivo...
        </p>
      )}
    </div>
  )
}

export default FileUploader
