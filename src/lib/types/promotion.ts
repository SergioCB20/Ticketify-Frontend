// Tipos de promociones y descuentos
export interface Promotion {
  id: string
  name: string
  description?: string
  code: string
  promotion_type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  startDate: string
  endDate: string
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount?: number
  isActive?: boolean
  applicableEvents?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreatePromotionData {
  name: string
  code: string
  description?: string
  promotion_type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  startDate: string
  endDate: string
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  applicableEvents?: string[]
}

export interface ApplyPromotionData {
  code: string
  totalAmount: number
}

export interface PromotionValidation {
  isValid: boolean
  discount: number
  finalAmount: number
  message?: string
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT'
