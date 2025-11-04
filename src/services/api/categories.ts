import { Category } from '@/lib/types/event'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'


export async function getCategories(activeOnly: boolean = true): Promise<Category[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/?is_active=${activeOnly}`,
      { /* ... headers ... */ }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al obtener las categorías')
    }

    const data = await response.json() 
    console.log('Fetched categories data:', data) // Esto muestra (6) [...]
    
    // ✅ LA SOLUCIÓN: Devuelve el array directamente
    return data 

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