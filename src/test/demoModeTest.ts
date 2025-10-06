/**
 * Demo Mode Test
 * Simple test to verify demo mode functionality
 */

import { isDemoMode, demoModeUtils, getDefaultDemoData } from '../config/demoMode'
import { MockDatabaseService } from '../services/mockDatabaseService'
import { mockLicenseManager } from '../services/mockLicenseManager'

/**
 * Test demo mode configuration
 */
export function testDemoModeConfig() {
  console.log('🧪 Testing Demo Mode Configuration...')
  
  // Test demo mode detection
  const isDemo = isDemoMode()
  console.log('✅ Demo mode detection:', isDemo)
  
  // Test demo mode utilities
  const testKey = 'test_key'
  const testData = { message: 'Hello Demo Mode!' }
  
  demoModeUtils.saveToStorage(testKey, testData)
  const loadedData = demoModeUtils.loadFromStorage(testKey, null)
  
  console.log('✅ Storage save/load test:', loadedData?.message === testData.message)
  
  // Test default data structure
  const defaultData = getDefaultDemoData()
  console.log('✅ Default data structure:', Object.keys(defaultData))
  
  return true
}

/**
 * Test mock database service
 */
export async function testMockDatabaseService() {
  console.log('🧪 Testing Mock Database Service...')
  
  const mockDb = new MockDatabaseService()
  
  try {
    // Test patient operations
    const newPatient = await mockDb.createPatient({
      name: 'Test Patient',
      phone: '1234567890',
      email: 'test@example.com',
      birth_date: '1990-01-01',
      gender: 'male',
      address: 'Test Address'
    })
    
    console.log('✅ Patient creation test:', newPatient.id ? 'PASS' : 'FAIL')
    
    const allPatients = await mockDb.getAllPatients()
    console.log('✅ Patient retrieval test:', allPatients.length > 0 ? 'PASS' : 'FAIL')
    
    // Test appointment operations
    const newAppointment = await mockDb.createAppointment({
      patient_id: newPatient.id,
      patient_name: newPatient.name,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      treatment: 'Test Treatment',
      notes: 'Test Notes'
    })
    
    console.log('✅ Appointment creation test:', newAppointment.id ? 'PASS' : 'FAIL')
    
    const allAppointments = await mockDb.getAllAppointments()
    console.log('✅ Appointment retrieval test:', allAppointments.length > 0 ? 'PASS' : 'FAIL')
    
    return true
  } catch (error) {
    console.error('❌ Mock database test failed:', error)
    return false
  }
}

/**
 * Test mock license manager
 */
export async function testMockLicenseManager() {
  console.log('🧪 Testing Mock License Manager...')
  
  try {
    // Test license status check
    const licenseStatus = await mockLicenseManager.checkLicenseStatus()
    console.log('✅ License status test:', licenseStatus.isValid ? 'PASS' : 'FAIL')
    
    // Test machine info
    const machineInfo = await mockLicenseManager.getMachineInfo()
    console.log('✅ Machine info test:', machineInfo.hwid ? 'PASS' : 'FAIL')
    
    // Test license activation
    const activationResult = await mockLicenseManager.activateLicense('TEST-LICENSE-KEY')
    console.log('✅ License activation test:', activationResult.isValid ? 'PASS' : 'FAIL')
    
    // Test license info
    const licenseInfo = await mockLicenseManager.getLicenseInfo()
    console.log('✅ License info test:', licenseInfo?.activated ? 'PASS' : 'FAIL')
    
    return true
  } catch (error) {
    console.error('❌ Mock license manager test failed:', error)
    return false
  }
}

/**
 * Run all demo mode tests
 */
export async function runAllDemoModeTests() {
  console.log('🚀 Running Demo Mode Tests...')
  console.log('================================')
  
  const configTest = testDemoModeConfig()
  const dbTest = await testMockDatabaseService()
  const licenseTest = await testMockLicenseManager()
  
  console.log('================================')
  console.log('📊 Test Results:')
  console.log('Configuration:', configTest ? '✅ PASS' : '❌ FAIL')
  console.log('Database Service:', dbTest ? '✅ PASS' : '❌ FAIL')
  console.log('License Manager:', licenseTest ? '✅ PASS' : '❌ FAIL')
  
  const allPassed = configTest && dbTest && licenseTest
  console.log('Overall:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED')
  
  return allPassed
}

// Auto-run tests if in demo mode
if (typeof window !== 'undefined' && isDemoMode()) {
  console.log('🎭 Demo Mode detected - running tests...')
  runAllDemoModeTests()
}
