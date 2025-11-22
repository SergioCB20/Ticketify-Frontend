// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  icon?: string
  color?: string
  imageUrl?: string
  isFeatured: boolean
  isActive: boolean
  sortOrder: number
  eventCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  slug: string
  icon?: string
  color?: string
  imageUrl?: string
  isFeatured?: boolean
  sortOrder?: number
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  slug?: string
  icon?: string
  color?: string
  imageUrl?: string
  isFeatured?: boolean
  sortOrder?: number
}
