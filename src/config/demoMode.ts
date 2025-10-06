/**
 * Demo Mode Configuration
 * This file handles the demo mode functionality for the dental clinic application
 */

// Check if we're in demo mode
export const isDemoMode = (): boolean => {
  // Check environment variable first
  if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
    return true
  }
  
  // Fallback to environment variable
  return import.meta.env.VITE_DEMO_MODE === 'true'
}

// Demo mode constants
export const DEMO_MODE_CONFIG = {
  // Demo data will be stored in localStorage with this prefix
  STORAGE_PREFIX: 'dental_clinic_demo_',
  
  // Demo mode indicator
  IS_DEMO: isDemoMode(),
  
  // Demo mode features
  FEATURES: {
    // Disable database operations
    DISABLE_DATABASE: true,
    // Disable license validation
    DISABLE_LICENSE: true,
    // Use localStorage for data persistence
    USE_LOCAL_STORAGE: true,
    // Show demo mode indicator
    SHOW_DEMO_INDICATOR: true
  }
} as const

// Demo mode utilities
export const demoModeUtils = {
  /**
   * Get storage key for demo mode
   */
  getStorageKey: (key: string): string => {
    return `${DEMO_MODE_CONFIG.STORAGE_PREFIX}${key}`
  },

  /**
   * Save data to localStorage in demo mode
   */
  saveToStorage: (key: string, data: any): void => {
    if (DEMO_MODE_CONFIG.IS_DEMO) {
      try {
        const storageKey = demoModeUtils.getStorageKey(key)
        localStorage.setItem(storageKey, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }
  },

  /**
   * Load data from localStorage in demo mode
   */
  loadFromStorage: (key: string, defaultValue: any = null): any => {
    if (DEMO_MODE_CONFIG.IS_DEMO) {
      try {
        const storageKey = demoModeUtils.getStorageKey(key)
        const data = localStorage.getItem(storageKey)
        return data ? JSON.parse(data) : defaultValue
      } catch (error) {
        console.error('Failed to load from localStorage:', error)
        return defaultValue
      }
    }
    return defaultValue
  },

  /**
   * Clear all demo data
   */
  clearDemoData: (): void => {
    if (DEMO_MODE_CONFIG.IS_DEMO) {
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith(DEMO_MODE_CONFIG.STORAGE_PREFIX)) {
            localStorage.removeItem(key)
          }
        })
        console.log('Demo data cleared successfully')
      } catch (error) {
        console.error('Failed to clear demo data:', error)
      }
    }
  },

  /**
   * Get all demo data keys
   */
  getDemoDataKeys: (): string[] => {
    if (DEMO_MODE_CONFIG.IS_DEMO) {
      try {
        const keys = Object.keys(localStorage)
        return keys.filter(key => key.startsWith(DEMO_MODE_CONFIG.STORAGE_PREFIX))
      } catch (error) {
        console.error('Failed to get demo data keys:', error)
        return []
      }
    }
    return []
  }
}

// Demo mode data structure
export interface DemoDataStructure {
  patients: any[]
  appointments: any[]
  payments: any[]
  treatments: any[]
  inventory: any[]
  labs: any[]
  labOrders: any[]
  medications: any[]
  prescriptions: any[]
  settings: any
  dentalTreatmentImages: any[]
  toothTreatments: any[]
  toothTreatmentImages: any[]
  clinicExpenses: any[]
}

// Default demo data
export const getDefaultDemoData = (): DemoDataStructure => ({
  patients: [],
  appointments: [],
  payments: [],
  treatments: [],
  inventory: [],
  labs: [],
  labOrders: [],
  medications: [],
  prescriptions: [],
  settings: {
    clinic_name: 'عيادة الأسنان التجريبية',
    clinic_address: 'العنوان التجريبي',
    clinic_phone: '0123456789',
    clinic_email: 'demo@dentalclinic.com',
    currency: 'USD',
    language: 'ar',
    theme: 'light',
    backup_frequency: 'daily'
  },
  dentalTreatmentImages: [],
  toothTreatments: [],
  toothTreatmentImages: [],
  clinicExpenses: []
})

// Demo mode initialization
export const initializeDemoMode = (): void => {
  if (DEMO_MODE_CONFIG.IS_DEMO) {
    console.log('🎭 Initializing Demo Mode...')
    
    // Initialize demo data if not exists
    const existingData = demoModeUtils.loadFromStorage('initialized')
    if (!existingData) {
      const defaultData = getDefaultDemoData()
      demoModeUtils.saveToStorage('initialized', true)
      demoModeUtils.saveToStorage('data', defaultData)
      console.log('✅ Demo data initialized')
    }
    
    console.log('🎭 Demo Mode initialized successfully')
  }
}
