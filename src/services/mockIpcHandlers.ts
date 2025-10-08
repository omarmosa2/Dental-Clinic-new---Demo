/**
 * Mock IPC Handlers for Demo Mode
 * This service provides mock IPC functionality when the application is running in demo mode
 */

import { MockDatabaseService } from './mockDatabaseService'
import { mockLicenseManager } from './mockLicenseManager'

// Create a single instance of the mock database service
const mockDatabase = new MockDatabaseService()

/**
 * Mock IPC Handlers for Demo Mode
 * These handlers simulate the Electron IPC communication in demo mode
 */
export const mockIpcHandlers = {
  // ==================== LICENSE HANDLERS ====================

  'license:checkStatus': async (): Promise<{
    isValid: boolean
    isFirstRun: boolean
    error?: string
  }> => {
    return await mockLicenseManager.checkLicenseStatus()
  },

  'license:getMachineInfo': async (): Promise<{
    hwid: string
    platform: string
    arch: string
    error?: string
  }> => {
    return await mockLicenseManager.getMachineInfo()
  },

  'license:activate': async (licenseKey: string): Promise<{
    success: boolean
    error?: string
  }> => {
    const result = await mockLicenseManager.activateLicense(licenseKey)
    return {
      success: result.isValid,
      error: result.error
    }
  },

  'license:getInfo': async (): Promise<any> => {
    return await mockLicenseManager.getLicenseInfo()
  },

  'license:clear': async (): Promise<{ success: boolean }> => {
    await mockLicenseManager.clearLicenseData()
    return { success: true }
  },

  // ==================== PATIENT HANDLERS ====================

  'db:patients:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllPatients()
  },

  'db:patients:create': async (patient: any): Promise<any> => {
    return await mockDatabase.createPatient(patient)
  },

  'db:patients:update': async (id: string, patient: any): Promise<any> => {
    return await mockDatabase.updatePatient(id, patient)
  },

  'db:patients:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deletePatient(id)
  },

  'db:patients:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchPatients(query)
  },

  // ==================== APPOINTMENT HANDLERS ====================

  'db:appointments:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllAppointments()
  },

  'db:appointments:create': async (appointment: any): Promise<any> => {
    return await mockDatabase.createAppointment(appointment)
  },

  'db:appointments:update': async (id: string, appointment: any): Promise<any> => {
    return await mockDatabase.updateAppointment(id, appointment)
  },

  'db:appointments:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteAppointment(id)
  },

  'db:appointments:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchAppointments(query)
  },

  'db:appointments:checkConflict': async (startTime: string, endTime: string, excludeId?: string): Promise<boolean> => {
    return await mockDatabase.checkAppointmentConflict(startTime, endTime, excludeId)
  },

  // ==================== PAYMENT HANDLERS ====================

  'db:payments:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllPayments()
  },

  'db:payments:getByPatient': async (patientId: string): Promise<any[]> => {
    return await mockDatabase.getPaymentsByPatient(patientId)
  },

  'db:payments:create': async (payment: any): Promise<any> => {
    return await mockDatabase.createPayment(payment)
  },

  'db:payments:update': async (id: string, payment: any): Promise<any> => {
    return await mockDatabase.updatePayment(id, payment)
  },

  'db:payments:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deletePayment(id)
  },

  'db:payments:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchPayments(query)
  },

  // ==================== TREATMENT HANDLERS ====================

  'db:treatments:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllTreatments()
  },

  'db:treatments:create': async (treatment: any): Promise<any> => {
    return await mockDatabase.createTreatment(treatment)
  },

  'db:treatments:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchTreatments(query)
  },

  // ==================== INVENTORY HANDLERS ====================

  'db:inventory:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllInventoryItems()
  },

  'db:inventory:create': async (item: any): Promise<any> => {
    return await mockDatabase.createInventoryItem(item)
  },

  'db:inventory:update': async (id: string, item: any): Promise<any> => {
    return await mockDatabase.updateInventoryItem(id, item)
  },

  'db:inventory:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteInventoryItem(id)
  },

  // ==================== LAB HANDLERS ====================

  'db:labs:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllLabs()
  },

  'db:labs:create': async (lab: any): Promise<any> => {
    return await mockDatabase.createLab(lab)
  },

  'db:labs:update': async (id: string, lab: any): Promise<any> => {
    return await mockDatabase.updateLab(id, lab)
  },

  'db:labs:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteLab(id)
  },

  'db:labs:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchLabs(query)
  },

  // ==================== LAB ORDER HANDLERS ====================

  'db:labOrders:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllLabOrders()
  },

  'db:labOrders:create': async (labOrder: any): Promise<any> => {
    return await mockDatabase.createLabOrder(labOrder)
  },

  'db:labOrders:update': async (id: string, labOrder: any): Promise<any> => {
    return await mockDatabase.updateLabOrder(id, labOrder)
  },

  'db:labOrders:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteLabOrder(id)
  },

  'db:labOrders:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchLabOrders(query)
  },

  // ==================== MEDICATION HANDLERS ====================

  'db:medications:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllMedications()
  },

  'db:medications:create': async (medication: any): Promise<any> => {
    return await mockDatabase.createMedication(medication)
  },

  'db:medications:update': async (id: string, medication: any): Promise<any> => {
    return await mockDatabase.updateMedication(id, medication)
  },

  'db:medications:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteMedication(id)
  },

  'db:medications:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchMedications(query)
  },

  // ==================== PRESCRIPTION HANDLERS ====================

  'db:prescriptions:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllPrescriptions()
  },

  'db:prescriptions:create': async (prescription: any): Promise<any> => {
    return await mockDatabase.createPrescription(prescription)
  },

  'db:prescriptions:update': async (id: string, prescription: any): Promise<any> => {
    return await mockDatabase.updatePrescription(id, prescription)
  },

  'db:prescriptions:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deletePrescription(id)
  },

  'db:prescriptions:getByPatient': async (patientId: string): Promise<any[]> => {
    return await mockDatabase.getPrescriptionsByPatient(patientId)
  },

  'db:prescriptions:search': async (query: string): Promise<any[]> => {
    return await mockDatabase.searchPrescriptions(query)
  },

  // ==================== DENTAL TREATMENT IMAGE HANDLERS ====================

  'db:dentalTreatmentImages:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllDentalTreatmentImages()
  },

  'db:dentalTreatmentImages:getByTreatment': async (treatmentId: string): Promise<any[]> => {
    return await mockDatabase.getDentalTreatmentImagesByTreatment(treatmentId)
  },

  'db:dentalTreatmentImages:create': async (image: any): Promise<any> => {
    return await mockDatabase.createDentalTreatmentImage(image)
  },

  'db:dentalTreatmentImages:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteDentalTreatmentImage(id)
  },

  // ==================== TOOTH TREATMENT HANDLERS ====================

  'db:toothTreatments:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllToothTreatments()
  },

  'db:toothTreatments:getByPatient': async (patientId: string): Promise<any[]> => {
    return await mockDatabase.getToothTreatmentsByPatient(patientId)
  },

  'db:toothTreatments:getByTooth': async (patientId: string, toothNumber: number): Promise<any[]> => {
    return await mockDatabase.getToothTreatmentsByTooth(patientId, toothNumber)
  },

  'db:toothTreatments:create': async (treatment: any): Promise<any> => {
    return await mockDatabase.createToothTreatment(treatment)
  },

  'db:toothTreatments:update': async (id: string, treatment: any): Promise<boolean> => {
    await mockDatabase.updateToothTreatment(id, treatment)
    return true
  },

  'db:toothTreatments:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteToothTreatment(id)
  },

  'db:toothTreatments:reorder': async (patientId: string, toothNumber: number, treatmentIds: string[]): Promise<boolean> => {
    return await mockDatabase.reorderToothTreatments(patientId, toothNumber, treatmentIds)
  },

  // ==================== TOOTH TREATMENT IMAGE HANDLERS ====================

  'db:toothTreatmentImages:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllToothTreatmentImages()
  },

  'db:toothTreatmentImages:getByTreatment': async (treatmentId: string): Promise<any[]> => {
    return await mockDatabase.getToothTreatmentImagesByTreatment(treatmentId)
  },

  'db:toothTreatmentImages:getByTooth': async (patientId: string, toothNumber: number): Promise<any[]> => {
    return await mockDatabase.getToothTreatmentImagesByTooth(patientId, toothNumber)
  },

  'db:toothTreatmentImages:create': async (image: any): Promise<any> => {
    return await mockDatabase.createToothTreatmentImage(image)
  },

  'db:toothTreatmentImages:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteToothTreatmentImage(id)
  },

  // ==================== CLINIC EXPENSE HANDLERS ====================

  'db:clinicExpenses:getAll': async (): Promise<any[]> => {
    return await mockDatabase.getAllClinicExpenses()
  },

  'db:clinicExpenses:create': async (expense: any): Promise<any> => {
    return await mockDatabase.createClinicExpense(expense)
  },

  'db:clinicExpenses:update': async (id: string, expense: any): Promise<any> => {
    return await mockDatabase.updateClinicExpense(id, expense)
  },

  'db:clinicExpenses:delete': async (id: string): Promise<boolean> => {
    return await mockDatabase.deleteClinicExpense(id)
  },

  // ==================== SETTINGS HANDLERS ====================

  'settings:get': async (): Promise<any> => {
    return await mockDatabase.getSettings()
  },

  'settings:update': async (settings: any): Promise<any> => {
    return await mockDatabase.updateSettings(settings)
  },

  // ==================== DASHBOARD HANDLERS ====================

  'dashboard:getStats': async (): Promise<any> => {
    return await mockDatabase.getDashboardStats()
  },

  // ==================== FILE HANDLERS (MOCK) ====================

  'files:uploadDentalImage': async (fileBuffer: any, fileName: string, patientId: string, toothNumber: number, imageType: string, patientName: string, toothName: string): Promise<string> => {
    // Mock file upload - return a mock path
    return `dental_images/${patientId}/${toothNumber}/${imageType}/mock_${Date.now()}.jpg`
  },

  'files:saveDentalImage': async (base64Data: string, fileName: string, patientId: string, toothNumber: number, imageType: string, patientName: string, toothName: string): Promise<string> => {
    // Mock file save - return a mock path
    return `dental_images/${patientId}/${toothNumber}/${imageType}/mock_${Date.now()}.jpg`
  },

  'files:getDentalImage': async (imagePath: string): Promise<string> => {
    // Mock image retrieval - return a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD48L3N2Zz4='
  },

  'files:checkImageExists': async (imagePath: string): Promise<boolean> => {
    // Mock image existence check - always return true for demo
    return true
  },

  'files:openImagePreview': async (imagePath: string): Promise<void> => {
    // Mock image preview - just log
    console.log('Mock image preview opened for:', imagePath)
  },

  // ==================== BACKUP HANDLERS (MOCK) ====================

  'backup:create': async (): Promise<{ success: boolean; message: string; filePath?: string }> => {
    return {
      success: true,
      message: 'Mock backup created successfully',
      filePath: 'mock_backup.json'
    }
  },

  'backup:restore': async (backupPath: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: 'Mock backup restored successfully'
    }
  },

  'backup:list': async (): Promise<any[]> => {
    return [
      { name: 'mock_backup_1.json', date: new Date().toISOString(), size: '1.2 MB' },
      { name: 'mock_backup_2.json', date: new Date().toISOString(), size: '1.5 MB' }
    ]
  },

  'backup:delete': async (backupName: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: `Mock backup ${backupName} deleted successfully`
    }
  },

  // ==================== DIALOG HANDLERS (MOCK) ====================

  'dialog:showOpenDialog': async (options: any): Promise<{ canceled: boolean; filePaths: string[] }> => {
    return {
      canceled: false,
      filePaths: ['mock_file.json']
    }
  },

  'dialog:showSaveDialog': async (options: any): Promise<{ canceled: boolean; filePath?: string }> => {
    return {
      canceled: false,
      filePath: 'mock_save_file.json'
    }
  },

  // ==================== REPORTS HANDLERS (MOCK) ====================

  'reports:generatePatientReport': async (filter: any): Promise<any> => {
    return {
      patients: [],
      totalPatients: 0,
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:generateAppointmentReport': async (filter: any): Promise<any> => {
    return {
      appointments: [],
      totalAppointments: 0,
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:generateFinancialReport': async (filter: any): Promise<any> => {
    return {
      payments: [],
      totalRevenue: 0,
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:generateInventoryReport': async (filter: any): Promise<any> => {
    return {
      inventory: [],
      totalItems: 0,
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:generateTreatmentReport': async (filter: any): Promise<any> => {
    return {
      treatments: [],
      totalTreatments: 0,
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:generateAnalyticsReport': async (filter: any): Promise<any> => {
    return {
      kpis: {
        patientGrowthRate: 0,
        revenueGrowthRate: 0,
        appointmentUtilization: 0,
        averageRevenuePerPatient: 0,
        patientRetentionRate: 0,
        appointmentNoShowRate: 0
      },
      trends: {
        patientTrend: [],
        revenueTrend: [],
        appointmentTrend: []
      },
      comparisons: {
        currentPeriod: {},
        previousPeriod: {},
        changePercentage: 0
      },
      predictions: {
        nextMonthRevenue: 0,
        nextMonthAppointments: 0,
        confidence: 0
      }
    }
  },

  'reports:generateOverviewReport': async (filter: any): Promise<any> => {
    return {
      patients: { totalPatients: 0, patients: [] },
      appointments: { totalAppointments: 0, appointments: [] },
      financial: { totalRevenue: 0, payments: [] },
      inventory: { totalItems: 0, inventory: [] },
      generatedAt: new Date().toISOString(),
      filter
    }
  },

  'reports:exportReport': async (type: string, filter: any, options: any): Promise<{ success: boolean; message: string; filePath?: string }> => {
    return {
      success: true,
      message: `Mock ${type} report exported successfully`,
      filePath: `mock_${type}_report.${options.format || 'pdf'}`
    }
  }
}

// Export a global function for manual initialization
if (typeof window !== 'undefined') {
  (window as any).initializeMockElectronAPI = () => {
    console.log('🔧 Manual mock initialization called')
    initializeMockIpcHandlers()
  }
  
  (window as any).forceMockElectronAPI = () => {
    console.log('🔧 Force replacing electronAPI with mock version')
    try {
      // Create a completely new electronAPI object
      const newElectronAPI = {
        ...(window as any).electronAPI, // Preserve existing properties
        database: {
          // Patients
          getAllPatients: () => mockIpcHandlers['db:patients:getAll'](),
          createPatient: (patient: any) => mockIpcHandlers['db:patients:create'](patient),
          updatePatient: (id: string, patient: any) => mockIpcHandlers['db:patients:update'](id, patient),
          deletePatient: (id: string) => mockIpcHandlers['db:patients:delete'](id),
          searchPatients: (query: string) => mockIpcHandlers['db:patients:search'](query),
          
          // Appointments
          getAllAppointments: () => mockIpcHandlers['db:appointments:getAll'](),
          createAppointment: (appointment: any) => mockIpcHandlers['db:appointments:create'](appointment),
          updateAppointment: (id: string, appointment: any) => mockIpcHandlers['db:appointments:update'](id, appointment),
          deleteAppointment: (id: string) => mockIpcHandlers['db:appointments:delete'](id),
          searchAppointments: (query: string) => mockIpcHandlers['db:appointments:search'](query),
          checkAppointmentConflict: (startTime: string, endTime: string, excludeId?: string) => 
            mockIpcHandlers['db:appointments:checkConflict'](startTime, endTime, excludeId),
          
          // Payments
          getAllPayments: () => mockIpcHandlers['db:payments:getAll'](),
          getPaymentsByPatient: (patientId: string) => mockIpcHandlers['db:payments:getByPatient'](patientId),
          createPayment: (payment: any) => mockIpcHandlers['db:payments:create'](payment),
          updatePayment: (id: string, payment: any) => mockIpcHandlers['db:payments:update'](id, payment),
          deletePayment: (id: string) => mockIpcHandlers['db:payments:delete'](id),
          searchPayments: (query: string) => mockIpcHandlers['db:payments:search'](query),
          
          // Additional methods that might be needed
          getClinicSettings: () => mockIpcHandlers['settings:get'](),
          updateClinicSettings: (settings: any) => mockIpcHandlers['settings:update'](settings)
        }
      }
      
      // Try to replace the entire electronAPI
      try {
        (window as any).electronAPI = newElectronAPI
        console.log('✅ Force replaced electronAPI with mock version')
      } catch (replaceError) {
        console.log('⚠️ Direct replacement failed, trying Object.defineProperty')
        Object.defineProperty(window, 'electronAPI', {
          value: newElectronAPI,
          writable: true,
          configurable: true
        })
        console.log('✅ Force replaced electronAPI using Object.defineProperty')
      }
    } catch (error) {
      console.error('❌ Failed to force replace electronAPI:', error)
    }
  }
  
  (window as any).checkElectronAPI = () => {
    console.log('🔍 Current electronAPI status:', {
      exists: !!(window as any).electronAPI,
      hasDatabase: !!(window as any).electronAPI?.database,
      getAllPatients: typeof (window as any).electronAPI?.database?.getAllPatients,
      getAllAppointments: typeof (window as any).electronAPI?.database?.getAllAppointments,
      databaseKeys: Object.keys((window as any).electronAPI?.database || {}),
      fullStructure: (window as any).electronAPI
    })
  }
  
  (window as any).resetDemoData = () => {
    console.log('🔄 Resetting demo data...')
    try {
      // Clear existing demo data
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('dental_clinic_demo_')) {
          localStorage.removeItem(key)
        }
      })
      
      // Force reload the page to reinitialize with new data
      window.location.reload()
    } catch (error) {
      console.error('❌ Failed to reset demo data:', error)
    }
  }
}

/**
 * Initialize mock IPC handlers for demo mode
 */
export const initializeMockIpcHandlers = (): void => {
  console.log('🎭 initializeMockIpcHandlers called')
  if (typeof window !== 'undefined') {
    console.log('🎭 Window is available, checking existing electronAPI')
    // Check if electronAPI already exists and is read-only
    const existingElectronAPI = (window as any).electronAPI
    console.log('🎭 Existing electronAPI:', existingElectronAPI)
    console.log('🎭 electronAPI descriptor:', Object.getOwnPropertyDescriptor(window, 'electronAPI'))
    
    // Always initialize mock, but check if we need to override
    const needsOverride = !existingElectronAPI || 
      !existingElectronAPI.database || 
      !existingElectronAPI.database.getAllPatients ||
      !existingElectronAPI.database.getAllAppointments
    
    if (!needsOverride) {
      console.log('🎭 electronAPI already has required functions, skipping mock initialization')
      return
    }
    
    console.log('🎭 electronAPI needs mock initialization or override')

    // Create mock electronAPI object with database wrapper structure
    const mockElectronAPI = {
      license: {
        checkStatus: () => mockIpcHandlers['license:checkStatus'](),
        getMachineInfo: () => mockIpcHandlers['license:getMachineInfo'](),
        activate: (licenseKey: string) => mockIpcHandlers['license:activate'](licenseKey),
        getInfo: () => mockIpcHandlers['license:getInfo'](),
        clear: () => mockIpcHandlers['license:clear']()
      },
      database: {
        // Patients
        getAllPatients: () => mockIpcHandlers['db:patients:getAll'](),
        createPatient: (patient: any) => mockIpcHandlers['db:patients:create'](patient),
        updatePatient: (id: string, patient: any) => mockIpcHandlers['db:patients:update'](id, patient),
        deletePatient: (id: string) => mockIpcHandlers['db:patients:delete'](id),
        searchPatients: (query: string) => mockIpcHandlers['db:patients:search'](query),
        
        // Appointments
        getAllAppointments: () => mockIpcHandlers['db:appointments:getAll'](),
        createAppointment: (appointment: any) => mockIpcHandlers['db:appointments:create'](appointment),
        updateAppointment: (id: string, appointment: any) => mockIpcHandlers['db:appointments:update'](id, appointment),
        deleteAppointment: (id: string) => mockIpcHandlers['db:appointments:delete'](id),
        searchAppointments: (query: string) => mockIpcHandlers['db:appointments:search'](query),
        checkAppointmentConflict: (startTime: string, endTime: string, excludeId?: string) => 
          mockIpcHandlers['db:appointments:checkConflict'](startTime, endTime, excludeId),
        
        // Payments
        getAllPayments: () => mockIpcHandlers['db:payments:getAll'](),
        getPaymentsByPatient: (patientId: string) => mockIpcHandlers['db:payments:getByPatient'](patientId),
        createPayment: (payment: any) => mockIpcHandlers['db:payments:create'](payment),
        updatePayment: (id: string, payment: any) => mockIpcHandlers['db:payments:update'](id, payment),
        deletePayment: (id: string) => mockIpcHandlers['db:payments:delete'](id),
        searchPayments: (query: string) => mockIpcHandlers['db:payments:search'](query),
        
        // Treatments
        getAllTreatments: () => mockIpcHandlers['db:treatments:getAll'](),
        createTreatment: (treatment: any) => mockIpcHandlers['db:treatments:create'](treatment),
        searchTreatments: (query: string) => mockIpcHandlers['db:treatments:search'](query),
        
        // Inventory
        getAllInventoryItems: () => mockIpcHandlers['db:inventory:getAll'](),
        createInventoryItem: (item: any) => mockIpcHandlers['db:inventory:create'](item),
        updateInventoryItem: (id: string, item: any) => mockIpcHandlers['db:inventory:update'](id, item),
        deleteInventoryItem: (id: string) => mockIpcHandlers['db:inventory:delete'](id),
        
        // Labs
        getAllLabs: () => mockIpcHandlers['db:labs:getAll'](),
        createLab: (lab: any) => mockIpcHandlers['db:labs:create'](lab),
        updateLab: (id: string, lab: any) => mockIpcHandlers['db:labs:update'](id, lab),
        deleteLab: (id: string) => mockIpcHandlers['db:labs:delete'](id),
        searchLabs: (query: string) => mockIpcHandlers['db:labs:search'](query),
        
        // Lab Orders
        getAllLabOrders: () => mockIpcHandlers['db:labOrders:getAll'](),
        createLabOrder: (labOrder: any) => mockIpcHandlers['db:labOrders:create'](labOrder),
        updateLabOrder: (id: string, labOrder: any) => mockIpcHandlers['db:labOrders:update'](id, labOrder),
        deleteLabOrder: (id: string) => mockIpcHandlers['db:labOrders:delete'](id),
        searchLabOrders: (query: string) => mockIpcHandlers['db:labOrders:search'](query),
        
        // Medications
        getAllMedications: () => mockIpcHandlers['db:medications:getAll'](),
        createMedication: (medication: any) => mockIpcHandlers['db:medications:create'](medication),
        updateMedication: (id: string, medication: any) => mockIpcHandlers['db:medications:update'](id, medication),
        deleteMedication: (id: string) => mockIpcHandlers['db:medications:delete'](id),
        searchMedications: (query: string) => mockIpcHandlers['db:medications:search'](query),
        
        // Prescriptions
        getAllPrescriptions: () => mockIpcHandlers['db:prescriptions:getAll'](),
        createPrescription: (prescription: any) => mockIpcHandlers['db:prescriptions:create'](prescription),
        updatePrescription: (id: string, prescription: any) => mockIpcHandlers['db:prescriptions:update'](id, prescription),
        deletePrescription: (id: string) => mockIpcHandlers['db:prescriptions:delete'](id),
        getPrescriptionsByPatient: (patientId: string) => mockIpcHandlers['db:prescriptions:getByPatient'](patientId),
        searchPrescriptions: (query: string) => mockIpcHandlers['db:prescriptions:search'](query),
        
        // Dental Treatment Images
        getAllDentalTreatmentImages: () => mockIpcHandlers['db:dentalTreatmentImages:getAll'](),
        getDentalTreatmentImagesByTreatment: (treatmentId: string) => mockIpcHandlers['db:dentalTreatmentImages:getByTreatment'](treatmentId),
        createDentalTreatmentImage: (image: any) => mockIpcHandlers['db:dentalTreatmentImages:create'](image),
        deleteDentalTreatmentImage: (id: string) => mockIpcHandlers['db:dentalTreatmentImages:delete'](id),
        
        // Tooth Treatments
        getAllToothTreatments: () => mockIpcHandlers['db:toothTreatments:getAll'](),
        getToothTreatmentsByPatient: (patientId: string) => mockIpcHandlers['db:toothTreatments:getByPatient'](patientId),
        getToothTreatmentsByTooth: (patientId: string, toothNumber: number) => mockIpcHandlers['db:toothTreatments:getByTooth'](patientId, toothNumber),
        createToothTreatment: (treatment: any) => mockIpcHandlers['db:toothTreatments:create'](treatment),
        updateToothTreatment: (id: string, treatment: any) => mockIpcHandlers['db:toothTreatments:update'](id, treatment),
        deleteToothTreatment: (id: string) => mockIpcHandlers['db:toothTreatments:delete'](id),
        reorderToothTreatments: (patientId: string, toothNumber: number, treatmentIds: string[]) => 
          mockIpcHandlers['db:toothTreatments:reorder'](patientId, toothNumber, treatmentIds),
        
        // Tooth Treatment Images
        getAllToothTreatmentImages: () => mockIpcHandlers['db:toothTreatmentImages:getAll'](),
        getToothTreatmentImagesByTreatment: (treatmentId: string) => mockIpcHandlers['db:toothTreatmentImages:getByTreatment'](treatmentId),
        getToothTreatmentImagesByTooth: (patientId: string, toothNumber: number) => mockIpcHandlers['db:toothTreatmentImages:getByTooth'](patientId, toothNumber),
        createToothTreatmentImage: (image: any) => mockIpcHandlers['db:toothTreatmentImages:create'](image),
        deleteToothTreatmentImage: (id: string) => mockIpcHandlers['db:toothTreatmentImages:delete'](id),
        
        // Clinic Expenses
        getAllClinicExpenses: () => mockIpcHandlers['db:clinicExpenses:getAll'](),
        createClinicExpense: (expense: any) => mockIpcHandlers['db:clinicExpenses:create'](expense),
        updateClinicExpense: (id: string, expense: any) => mockIpcHandlers['db:clinicExpenses:update'](id, expense),
        deleteClinicExpense: (id: string) => mockIpcHandlers['db:clinicExpenses:delete'](id),

        // Additional methods that might be needed
        getClinicSettings: () => mockIpcHandlers['settings:get'](),
        updateClinicSettings: (settings: any) => mockIpcHandlers['settings:update'](settings)
      },
      settings: {
        get: () => mockIpcHandlers['settings:get'](),
        update: (settings: any) => mockIpcHandlers['settings:update'](settings)
      },
      dashboard: {
        getStats: () => mockIpcHandlers['dashboard:getStats']()
      },
      files: {
        uploadDentalImage: (fileBuffer: any, fileName: string, patientId: string, toothNumber: number, imageType: string, patientName: string, toothName: string) => 
          mockIpcHandlers['files:uploadDentalImage'](fileBuffer, fileName, patientId, toothNumber, imageType, patientName, toothName),
        saveDentalImage: (base64Data: string, fileName: string, patientId: string, toothNumber: number, imageType: string, patientName: string, toothName: string) => 
          mockIpcHandlers['files:saveDentalImage'](base64Data, fileName, patientId, toothNumber, imageType, patientName, toothName),
        getDentalImage: (imagePath: string) => mockIpcHandlers['files:getDentalImage'](imagePath),
        checkImageExists: (imagePath: string) => mockIpcHandlers['files:checkImageExists'](imagePath),
        openImagePreview: (imagePath: string) => mockIpcHandlers['files:openImagePreview'](imagePath)
      },
      backup: {
        create: () => mockIpcHandlers['backup:create'](),
        restore: (backupPath: string) => mockIpcHandlers['backup:restore'](backupPath),
        list: () => mockIpcHandlers['backup:list'](),
        delete: (backupName: string) => mockIpcHandlers['backup:delete'](backupName)
      },
      dialog: {
        showOpenDialog: (options: any) => mockIpcHandlers['dialog:showOpenDialog'](options),
        showSaveDialog: (options: any) => mockIpcHandlers['dialog:showSaveDialog'](options)
      },
      reports: {
        generatePatientReport: (filter: any) => mockIpcHandlers['reports:generatePatientReport'](filter),
        generateAppointmentReport: (filter: any) => mockIpcHandlers['reports:generateAppointmentReport'](filter),
        generateFinancialReport: (filter: any) => mockIpcHandlers['reports:generateFinancialReport'](filter),
        generateInventoryReport: (filter: any) => mockIpcHandlers['reports:generateInventoryReport'](filter),
        generateTreatmentReport: (filter: any) => mockIpcHandlers['reports:generateTreatmentReport'](filter),
        generateAnalyticsReport: (filter: any) => mockIpcHandlers['reports:generateAnalyticsReport'](filter),
        generateOverviewReport: (filter: any) => mockIpcHandlers['reports:generateOverviewReport'](filter),
        exportReport: (type: string, filter: any, options: any) => mockIpcHandlers['reports:exportReport'](type, filter, options)
      }
    }

    // Try to assign the mock API, with fallback to defineProperty if needed
    try {
      (window as any).electronAPI = mockElectronAPI
      console.log('✅ Mock electronAPI assigned successfully')
      console.log('🔍 Mock electronAPI structure:', {
        hasDatabase: !!(window as any).electronAPI?.database,
        hasGetAllPatients: !!(window as any).electronAPI?.database?.getAllPatients,
        hasGetAllAppointments: !!(window as any).electronAPI?.database?.getAllAppointments,
        databaseKeys: Object.keys((window as any).electronAPI?.database || {})
      })
      
      // Add global debug function
      (window as any).debugElectronAPI = () => {
        console.log('🔍 Debug electronAPI:', {
          exists: !!(window as any).electronAPI,
          hasDatabase: !!(window as any).electronAPI?.database,
          getAllPatients: typeof (window as any).electronAPI?.database?.getAllPatients,
          getAllAppointments: typeof (window as any).electronAPI?.database?.getAllAppointments,
          databaseKeys: Object.keys((window as any).electronAPI?.database || {}),
          fullStructure: (window as any).electronAPI
        })
      }
    } catch (error) {
      console.log('⚠️ Direct assignment failed, using Object.defineProperty')
      try {
        Object.defineProperty(window, 'electronAPI', {
          value: mockElectronAPI,
          writable: true,
          configurable: true
        })
        console.log('✅ Mock electronAPI defined successfully using Object.defineProperty')
        console.log('🔍 Mock electronAPI structure after defineProperty:', {
          hasDatabase: !!(window as any).electronAPI?.database,
          hasGetAllPatients: !!(window as any).electronAPI?.database?.getAllPatients,
          hasGetAllAppointments: !!(window as any).electronAPI?.database?.getAllAppointments,
          databaseKeys: Object.keys((window as any).electronAPI?.database || {})
        })
        
        // Add global debug function
        (window as any).debugElectronAPI = () => {
          console.log('🔍 Debug electronAPI:', {
            exists: !!(window as any).electronAPI,
            hasDatabase: !!(window as any).electronAPI?.database,
            getAllPatients: typeof (window as any).electronAPI?.database?.getAllPatients,
            getAllAppointments: typeof (window as any).electronAPI?.database?.getAllAppointments,
            databaseKeys: Object.keys((window as any).electronAPI?.database || {}),
            fullStructure: (window as any).electronAPI
          })
        }
      } catch (defineError) {
        console.error('❌ Failed to define electronAPI:', defineError)
      }
    }
    
    // Add a delayed check to ensure the mock is working
    setTimeout(() => {
      console.log('🔍 Delayed check - electronAPI status:', {
        exists: !!(window as any).electronAPI,
        hasDatabase: !!(window as any).electronAPI?.database,
        getAllPatients: typeof (window as any).electronAPI?.database?.getAllPatients,
        getAllAppointments: typeof (window as any).electronAPI?.database?.getAllAppointments
      })
      
      // If the functions are still not available, try to replace the entire electronAPI
      if (!(window as any).electronAPI?.database?.getAllPatients) {
        console.log('🔧 Attempting to replace electronAPI with mock version')
        try {
          // Create a completely new electronAPI object
          const newElectronAPI = {
            ...(window as any).electronAPI, // Preserve existing properties
            database: {
              // Patients
              getAllPatients: () => mockIpcHandlers['db:patients:getAll'](),
              createPatient: (patient: any) => mockIpcHandlers['db:patients:create'](patient),
              updatePatient: (id: string, patient: any) => mockIpcHandlers['db:patients:update'](id, patient),
              deletePatient: (id: string) => mockIpcHandlers['db:patients:delete'](id),
              searchPatients: (query: string) => mockIpcHandlers['db:patients:search'](query),
              
              // Appointments
              getAllAppointments: () => mockIpcHandlers['db:appointments:getAll'](),
              createAppointment: (appointment: any) => mockIpcHandlers['db:appointments:create'](appointment),
              updateAppointment: (id: string, appointment: any) => mockIpcHandlers['db:appointments:update'](id, appointment),
              deleteAppointment: (id: string) => mockIpcHandlers['db:appointments:delete'](id),
              searchAppointments: (query: string) => mockIpcHandlers['db:appointments:search'](query),
              checkAppointmentConflict: (startTime: string, endTime: string, excludeId?: string) => 
                mockIpcHandlers['db:appointments:checkConflict'](startTime, endTime, excludeId),
              
              // Payments
              getAllPayments: () => mockIpcHandlers['db:payments:getAll'](),
              getPaymentsByPatient: (patientId: string) => mockIpcHandlers['db:payments:getByPatient'](patientId),
              createPayment: (payment: any) => mockIpcHandlers['db:payments:create'](payment),
              updatePayment: (id: string, payment: any) => mockIpcHandlers['db:payments:update'](id, payment),
              deletePayment: (id: string) => mockIpcHandlers['db:payments:delete'](id),
              searchPayments: (query: string) => mockIpcHandlers['db:payments:search'](query),
              
              // Additional methods that might be needed
              getClinicSettings: () => mockIpcHandlers['settings:get'](),
              updateClinicSettings: (settings: any) => mockIpcHandlers['settings:update'](settings)
            }
          }
          
          // Try to replace the entire electronAPI
          try {
            (window as any).electronAPI = newElectronAPI
            console.log('✅ Replaced electronAPI with mock version')
          } catch (replaceError) {
            console.log('⚠️ Direct replacement failed, trying Object.defineProperty')
            Object.defineProperty(window, 'electronAPI', {
              value: newElectronAPI,
              writable: true,
              configurable: true
            })
            console.log('✅ Replaced electronAPI using Object.defineProperty')
          }
        } catch (error) {
          console.error('❌ Failed to replace electronAPI:', error)
        }
      }
    }, 1000)
  }
}
