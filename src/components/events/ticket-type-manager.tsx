'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { TicketTypeFormData } from '@/lib/types'

interface TicketTypeManagerProps {
  ticketTypes: TicketTypeFormData[]
  onChange: (ticketTypes: TicketTypeFormData[]) => void
  errors?: Record<string, string>
}

export function TicketTypeManager({ ticketTypes, onChange, errors = {} }: TicketTypeManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
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
  }

  const handleAdd = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
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
  }

  const handleSaveEdit = () => {
    if (!editingId) return

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
        <p className="text-sm text-red-600">{errors.ticketTypes}</p>
      )}

      {/* Formulario de agregar/editar */}
      {(isAdding || editingId) && (
        <Card variant="default" className="border-2 border-primary-200 bg-primary-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Tipo"
                  placeholder="Ej: General, VIP, Estudiante"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <Input
                  label="Precio (S/)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Descripción (opcional)"
                placeholder="Descripción breve del tipo de entrada"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cantidad Disponible"
                  type="number"
                  min="1"
                  placeholder="Ej: 100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
                
                <Input
                  label="Máximo por Compra (opcional)"
                  type="number"
                  min="1"
                  placeholder="Ej: 10"
                  value={formData.maxPerPurchase}
                  onChange={(e) => setFormData({ ...formData, maxPerPurchase: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
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
                  disabled={!formData.name || !formData.price || !formData.quantity}
                >
                  <Check size={16} className="mr-1" />
                  {editingId ? 'Guardar' : 'Agregar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tipos de entrada */}
      {ticketTypes.length > 0 ? (
        <div className="space-y-3">
          {ticketTypes.map((ticketType) => (
            <Card 
              key={ticketType.tempId} 
              variant="default"
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {ticketType.name}
                      </h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        S/ {formatPrice(ticketType.price)}
                      </span>
                    </div>
                    
                    {ticketType.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {ticketType.description}
                      </p>
                    )}
                    
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        <strong>Cantidad:</strong> {ticketType.quantity}
                      </span>
                      {ticketType.maxPerPurchase && (
                        <span>
                          <strong>Máx. por compra:</strong> {ticketType.maxPerPurchase}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ticketType)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      type="button"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(ticketType.tempId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <Card variant="default" className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Plus size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">
              No hay tipos de entrada configurados
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Haz clic en "Agregar Tipo" para crear el primer tipo de entrada
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Tickets */}
      {ticketTypes.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Tipos</div>
              <div className="text-2xl font-bold text-primary-600">{ticketTypes.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Tickets</div>
              <div className="text-2xl font-bold text-primary-600">
                {ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Recaudación Máx.</div>
              <div className="text-2xl font-bold text-green-600">
                S/ {formatPrice(
                  ticketTypes.reduce((sum, tt) => 
                    sum + (parseFloat(tt.price || '0') * parseInt(tt.quantity || '0')), 0
                  ).toString()
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
