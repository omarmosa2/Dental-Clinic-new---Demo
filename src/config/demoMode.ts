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
export const getDefaultDemoData = (): DemoDataStructure => {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    patients: [
      {
        id: 'demo-patient-1',
        serial_number: 'P001',
        full_name: 'أحمد محمد علي',
        phone: '01234567890',
        email: 'ahmed@example.com',
        age: 35,
        gender: 'male',
        address: 'شارع الملك فهد، الرياض',
        patient_condition: 'صحة جيدة',
        allergies: 'لا توجد حساسية',
        medical_conditions: 'لا توجد حالات طبية',
        notes: 'مريض منتظم',
        date_added: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-patient-2',
        serial_number: 'P002',
        full_name: 'فاطمة أحمد السعيد',
        phone: '01234567891',
        email: 'fatima@example.com',
        age: 28,
        gender: 'female',
        address: 'شارع العليا، جدة',
        patient_condition: 'تحتاج متابعة',
        allergies: 'حساسية من البنسلين',
        medical_conditions: 'لا توجد حالات طبية',
        notes: 'تحتاج متابعة دورية',
        date_added: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-patient-3',
        serial_number: 'P003',
        full_name: 'محمد عبدالله القحطاني',
        phone: '01234567892',
        email: 'mohammed@example.com',
        age: 42,
        gender: 'male',
        address: 'شارع التحلية، الدمام',
        patient_condition: 'يحتاج عناية خاصة',
        allergies: 'لا توجد حساسية',
        medical_conditions: 'سكري',
        notes: 'يحتاج عناية خاصة',
        date_added: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    appointments: [
      {
        id: 'demo-appointment-1',
        patient_id: 'demo-patient-1',
        patient_name: 'أحمد محمد علي',
        date: tomorrow.toISOString(),
        time: '10:00',
        duration: 60,
        type: 'فحص دوري',
        status: 'scheduled',
        notes: 'فحص شامل للأسنان',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-appointment-2',
        patient_id: 'demo-patient-2',
        patient_name: 'فاطمة أحمد السعيد',
        date: nextWeek.toISOString(),
        time: '14:00',
        duration: 90,
        type: 'علاج',
        status: 'scheduled',
        notes: 'حشو الأسنان الأمامية',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    payments: [
      {
        id: 'demo-payment-1',
        patient_id: 'demo-patient-1',
        patient_name: 'أحمد محمد علي',
        amount: 500,
        currency: 'SAR',
        payment_method: 'cash',
        description: 'فحص دوري',
        date: now.toISOString(),
        status: 'completed',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-payment-2',
        patient_id: 'demo-patient-2',
        patient_name: 'فاطمة أحمد السعيد',
        amount: 1200,
        currency: 'SAR',
        payment_method: 'card',
        description: 'علاج الأسنان',
        date: now.toISOString(),
        status: 'completed',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    treatments: [
      {
        id: 'demo-treatment-1',
        patient_id: 'demo-patient-1',
        patient_name: 'أحمد محمد علي',
        treatment_type: 'فحص',
        description: 'فحص شامل للأسنان',
        cost: 500,
        status: 'completed',
        date: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-treatment-2',
        patient_id: 'demo-patient-2',
        patient_name: 'فاطمة أحمد السعيد',
        treatment_type: 'حشو',
        description: 'حشو الأسنان الأمامية',
        cost: 1200,
        status: 'in_progress',
        date: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    inventory: [
      {
        id: 'demo-inventory-1',
        name: 'حشوة بيضاء',
        category: 'مواد حشو',
        quantity: 50,
        unit: 'قطعة',
        cost_per_unit: 25,
        supplier: 'شركة المواد الطبية',
        expiry_date: '2025-12-31',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-inventory-2',
        name: 'مخدر موضعي',
        category: 'أدوية',
        quantity: 20,
        unit: 'زجاجة',
        cost_per_unit: 15,
        supplier: 'شركة الأدوية',
        expiry_date: '2024-12-31',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    labs: [
      {
        id: 'demo-lab-1',
        name: 'مختبر الأسنان المتقدم',
        address: 'شارع الملك عبدالعزيز، الرياض',
        phone: '0112345678',
        email: 'info@dental-lab.com',
        contact_person: 'د. سعد العتيبي',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    labOrders: [
      {
        id: 'demo-lab-order-1',
        patient_id: 'demo-patient-1',
        patient_name: 'أحمد محمد علي',
        lab_id: 'demo-lab-1',
        lab_name: 'مختبر الأسنان المتقدم',
        order_type: 'تاج',
        description: 'تاج خزفي للأسنان الأمامية',
        cost: 800,
        status: 'pending',
        order_date: now.toISOString(),
        expected_delivery: nextWeek.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    medications: [
      {
        id: 'demo-medication-1',
        name: 'أموكسيسيلين',
        dosage: '500mg',
        frequency: '3 مرات يومياً',
        duration: '7 أيام',
        instructions: 'يؤخذ مع الطعام',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 'demo-medication-2',
        name: 'ايبوبروفين',
        dosage: '400mg',
        frequency: 'عند الحاجة',
        duration: '3 أيام',
        instructions: 'يؤخذ عند الشعور بالألم',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    prescriptions: [
      {
        id: 'demo-prescription-1',
        patient_id: 'demo-patient-1',
        patient_name: 'أحمد محمد علي',
        medication_id: 'demo-medication-1',
        medication_name: 'أموكسيسيلين',
        dosage: '500mg',
        frequency: '3 مرات يومياً',
        duration: '7 أيام',
        instructions: 'يؤخذ مع الطعام',
        prescribed_date: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ],
    settings: {
      clinic_name: 'عيادة الأسنان التجريبية',
      clinic_address: 'شارع الملك فهد، الرياض',
      clinic_phone: '0112345678',
      clinic_email: 'info@dentalclinic-demo.com',
      currency: 'SAR',
      language: 'ar',
      theme: 'dark',
      backup_frequency: 'daily',
      password_enabled: 0,
      app_password: '',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    dentalTreatmentImages: [],
    toothTreatments: [],
    toothTreatmentImages: [],
    clinicExpenses: [
      {
        id: 'demo-expense-1',
        category: 'مواد طبية',
        description: 'شراء مواد حشو',
        amount: 500,
        currency: 'SAR',
        date: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ]
  }
}

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
