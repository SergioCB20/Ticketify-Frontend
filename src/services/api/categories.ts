/**
 * Categories API Service
 * Handles all API calls related to event categories
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

import type { Category } from '@/lib/types'

export interface CategoriesResponse {
  categories: Category[]
  total: number
}

/**
 * Get all categories
 */
export async function getCategories(activeOnly: boolean = true): Promise<CategoriesResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/?active_only=${activeOnly}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al obtener las categorías')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Get featured categories
 */
export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/featured`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al obtener las categorías destacadas')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    throw error
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al obtener la categoría')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching category:', error)
    throw error
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al obtener la categoría')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    throw error
  }
}
