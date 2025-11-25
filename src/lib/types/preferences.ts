export interface CategoryPreference {
  id: string
  userId: string
  categoryId: string
  categoryName: string
  isActive: boolean
  lastNotificationSentAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  userId: string
  emailNotifications: boolean
  categories: CategoryPreference[]
}

export interface UpdateCategoryPreferenceRequest {
  categoryId: string
  isActive: boolean
}

export interface UpdateEmailNotificationsRequest {
  emailNotifications: boolean
}

export interface BulkUpdateCategoryPreferencesRequest {
  preferences: UpdateCategoryPreferenceRequest[]
}
