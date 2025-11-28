'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { TicketTypeFormData } from '@/lib/types'

interface TicketTypeManagerProps {
  ticketTypes: TicketTypeFormData[]
  onChange: (ticketTypes: TicketTypeFormData[]) => void
  errors?: Record<string, string>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="mb-2 block text-sm font-semibold text-gray-800">{label}</label>}
        <textarea
          className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export function TicketTypeManager({ ticketTypes, onChange, errors = {} }: TicketTypeManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<Omit<TicketTypeFormData, 'tempId'>>({
    name: '',
    description: '',
    price: '',
    quantity: '',
    maxPerPurchase: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      maxPerPurchase: ''
    })
    setValidationErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    const price = parseFloat(formData.price)
    if (!formData.price) {
      errors.price = 'El precio es requerido'
    } else if (isNaN(price) || price < 0) {
      errors.price = 'El precio debe ser un número válido'
    } else if (price > 10000) {
      errors.price = 'El precio no puede exceder S/ 10,000'
    }

    const quantity = parseInt(formData.quantity)
    if (!formData.quantity) {
      errors.quantity = 'La cantidad es requerida'
    } else if (isNaN(quantity) || quantity <= 0) {
      errors.quantity = 'La cantidad debe ser mayor a 0'
    } else if (quantity > 100000) {
      errors.quantity = 'La cantidad no puede exceder 100,000'
    }

    if (formData.maxPerPurchase) {
      const maxPerPurchase = parseInt(formData.maxPerPurchase)
      if (isNaN(maxPerPurchase) || maxPerPurchase <= 0) {
        errors.maxPerPurchase = 'El máximo por compra debe ser mayor a 0'
      } else if (maxPerPurchase > quantity) {
        errors.maxPerPurchase = 'No puede ser mayor que la cantidad total'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    if (!validateForm()) {
      return
    }

    // Verificar nombres duplicados
    const isDuplicate = ticketTypes.some(
      tt => tt.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    )

    if (isDuplicate) {
      setValidationErrors({ name: 'Ya existe un tipo de entrada con este nombre' })
      return
    }

    const newTicketType: TicketTypeFormData = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      ...formData
    }

    onChange([...ticketTypes, newTicketType])
    resetForm()
    setIsAdding(false)
  }

  const handleEdit = (ticketType: TicketTypeFormData) => {
    setFormData({
      name: ticketType.name,
      description: ticketType.description,
      price: ticketType.price,
      quantity: ticketType.quantity,
      maxPerPurchase: ticketType.maxPerPurchase
    })
    setEditingId(ticketType.tempId)
    setValidationErrors({})
  }

  const handleSaveEdit = () => {
    if (!editingId || !validateForm()) {
      return
    }

    // Verificar nombres duplicados (excepto el actual)
    const isDuplicate = ticketTypes.some(
      tt => tt.tempId !== editingId && 
      tt.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    )

    if (isDuplicate) {
      setValidationErrors({ name: 'Ya existe un tipo de entrada con este nombre' })
      return
    }

    const updated = ticketTypes.map(tt => 
      tt.tempId === editingId 
        ? { ...tt, ...formData }
        : tt
    )
    
    onChange(updated)
    resetForm()
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingId(null)
    setIsAdding(false)
  }

  const handleDelete = (tempId: string) => {
    onChange(ticketTypes.filter(tt => tt.tempId !== tempId))
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tipos de Entrada <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configura los diferentes tipos de entradas con sus precios y capacidades
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAdding(true)}
            type="button"
          >
            <Plus size={16} className="mr-1" />
            Agregar Tipo
          </Button>
        )}
      </div>

      {errors.ticketTypes && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{errors.ticketTypes}</p>
        </div>
      )}

      {/* Formulario de agregar/editar */}
      {(isAdding || editingId) && (
        <Card variant="default" className="border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-blue-50 shadow-md">
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="bg-primary-100 border border-primary-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-primary-800">
                  {editingId ? '✏️ Editando tipo de entrada' : '➕ Agregando nuevo tipo de entrada'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={<>Nombre del Tipo <span className="text-red-500">*</span></>}
                  placeholder="Ej: General, VIP, Estudiante"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={validationErrors.name}
                />
                
                <Input
                  label={<>Precio (S/) <span className="text-red-500">*</span></>}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  error={validationErrors.price}
                />
              </div>

              <Textarea
                label="Descripción (opcional)"
                placeholder="Descripción breve del tipo de entrada (beneficios, restricciones, etc.)"
                rows={3}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={<>Cantidad Disponible <span className="text-red-500">*</span></>}
                  type="number"
                  min="1"
                  placeholder="Ej: 100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  error={validationErrors.quantity}
                />
                
                <Input
                  label="Máximo por Compra (opcional)"
                  type="number"
                  min="1"
                  placeholder="Ej: 10"
                  value={formData.maxPerPurchase}
                  onChange={(e) => setFormData({ ...formData, maxPerPurchase: e.target.value })}
                  error={validationErrors.maxPerPurchase}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  type="button"
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={editingId ? handleSaveEdit : handleAdd}
                  type="button"
                >
                  <Check size={16} className="mr-1" />
                  {editingId ? 'Guardar Cambios' : 'Agregar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tipos de entrada */}
      {ticketTypes.length > 0 ? (
        <div className="space-y-3">
          {ticketTypes.map((ticketType, index) => (
            <Card 
              key={ticketType.tempId} 
              variant="default"
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-400"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {ticketType.name}
                      </h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300">
                        S/ {formatPrice(ticketType.price)}
                      </span>
                    </div>
                    
                    {ticketType.description && (
                      <p className="text-sm text-gray-600 mb-2 ml-11">
                        {ticketType.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 ml-11 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600">🎟️</span>
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-semibold text-gray-900">{ticketType.quantity}</span>
                      </div>
                      {ticketType.maxPerPurchase && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-600">🛒</span>
                          <span className="text-gray-600">Máx. por compra:</span>
                          <span className="font-semibold text-gray-900">{ticketType.maxPerPurchase}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600">💰</span>
                        <span className="text-gray-600">Recaudación máx.:</span>
                        <span className="font-semibold text-green-700">
                          S/ {formatPrice((parseFloat(ticketType.price) * parseInt(ticketType.quantity)).toString())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(ticketType)}
                      className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors border border-transparent hover:border-primary-300"
                      type="button"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(ticketType.tempId)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-300"
                      type="button"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="default" className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="p-10 text-center">
            <div className="text-gray-300 mb-3">
              <Plus size={64} className="mx-auto" strokeWidth={1.5} />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">
              No hay tipos de entrada configurados
            </p>
            <p className="text-sm text-gray-500">
              Haz clic en "Agregar Tipo" para crear el primer tipo de entrada
            </p>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
