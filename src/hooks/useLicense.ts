import { useState, useEffect, useCallback } from 'react'
import { isDemoMode } from '../config/demoMode'

interface LicenseData {
  license?: string
  hwid: string
  activated: boolean
  timestamp?: number
}

interface MachineInfo {
  hwid: string
  platform: string
  arch: string
  error?: string
}

interface LicenseStatus {
  isValid: boolean
  error?: string
  isFirstRun: boolean
  licenseData?: LicenseData
}


interface LicenseState {
  isLicenseValid: boolean
  isFirstRun: boolean
  isLoading: boolean
  error: string | null
  licenseData: LicenseData | null
  machineInfo: MachineInfo | null
}

export function useLicense() {
  const [licenseState, setLicenseState] = useState<LicenseState>({
    isLicenseValid: false,
    isFirstRun: true,
    isLoading: true,
    error: null,
    licenseData: null,
    machineInfo: null
  })

  /**
   * Check license status from main process
   */
  const checkLicenseStatus = useCallback(async (): Promise<LicenseStatus> => {
    try {
      console.log('🔐 Checking license status...')
      
      // Always return valid license - license validation is completely disabled
      console.log('🎭 License validation disabled - returning valid license status')
      return {
        isValid: true,
        isFirstRun: false
      }
    } catch (error) {
      console.error('❌ Error checking license status:', error)
      return {
        isValid: true, // Always return valid even on error
        isFirstRun: false
      }
    }
  }, [])

  /**
   * Get machine information
   */
  const getMachineInfo = useCallback(async (): Promise<MachineInfo> => {
    try {
      console.log('🔐 Getting machine info...')
      
      // Return mock machine info since license validation is disabled
      console.log('🎭 License validation disabled - returning mock machine info')
      return {
        hwid: 'MOCK-HWID-123456789',
        platform: 'desktop',
        arch: 'x64'
      }
    } catch (error) {
      console.error('❌ Error getting machine info:', error)
      return {
        hwid: 'MOCK-HWID-123456789',
        platform: 'desktop',
        arch: 'x64'
      }
    }
  }, [])


  /**
   * Get detailed license information
   */
  const getLicenseInfo = useCallback(async (): Promise<LicenseData | null> => {
    try {
      console.log('🔐 Getting license info...')
      
      // Return mock license info since license validation is disabled
      console.log('🎭 License validation disabled - returning mock license info')
      return {
        license: 'MOCK-LICENSE-KEY',
        hwid: 'MOCK-HWID-123456789',
        activated: true,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('❌ Error getting license info:', error)
      return {
        license: 'MOCK-LICENSE-KEY',
        hwid: 'MOCK-HWID-123456789',
        activated: true,
        timestamp: Date.now()
      }
    }
  }, [])

  /**
   * Clear license data (development only)
   */
  const clearLicenseData = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Clearing license data...')
      
      if (!window.electronAPI?.license?.clearData) {
        throw new Error('License API not available')
      }

      const result = await window.electronAPI.license.clearData()
      console.log('🔐 License clear result:', result.success)
      
      if (result.success) {
        // Refresh license status after clearing
        await refreshLicenseStatus()
      }
      
      return result
    } catch (error) {
      console.error('❌ Error clearing license data:', error)
      return {
        success: false,
        error: 'Failed to clear license data'
      }
    }
  }, [])

  /**
   * Refresh license status and update state
   */
  const refreshLicenseStatus = useCallback(async () => {
    setLicenseState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Get license status and machine info in parallel
      const [licenseStatus, machineInfo, licenseInfo] = await Promise.all([
        checkLicenseStatus(),
        getMachineInfo(),
        getLicenseInfo()
      ])

      setLicenseState({
        isLicenseValid: licenseStatus.isValid,
        isFirstRun: licenseStatus.isFirstRun,
        isLoading: false,
        error: licenseStatus.error || machineInfo.error || null,
        licenseData: licenseInfo,
        machineInfo: machineInfo
      })

      console.log('🔐 License state updated:', {
        isValid: licenseStatus.isValid,
        isFirstRun: licenseStatus.isFirstRun,
        hasError: !!(licenseStatus.error || machineInfo.error)
      })

    } catch (error) {
      console.error('❌ Error refreshing license status:', error)
      setLicenseState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh license status'
      }))
    }
  }, [checkLicenseStatus, getMachineInfo, getLicenseInfo])

  /**
   * Initialize license checking on mount
   */
  useEffect(() => {
    console.log('🔐 Initializing license hook...')
    refreshLicenseStatus()
  }, [refreshLicenseStatus])

  /**
   * Validate license key format
   */
  const validateLicenseFormat = useCallback((licenseKey: string): boolean => {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return false
    }
    
    const regex = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/
    return regex.test(licenseKey.trim().toUpperCase())
  }, [])

  /**
   * Format license key for display
   */
  const formatLicenseKey = useCallback((value: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    
    // Split into groups of 5 characters
    const groups = []
    for (let i = 0; i < cleaned.length; i += 5) {
      groups.push(cleaned.slice(i, i + 5))
    }
    
    // Join with hyphens, limit to 4 groups (20 characters total)
    return groups.slice(0, 4).join('-')
  }, [])

  return {
    // State
    isLicenseValid: licenseState.isLicenseValid,
    isFirstRun: licenseState.isFirstRun,
    isLoading: licenseState.isLoading,
    error: licenseState.error,
    licenseData: licenseState.licenseData,
    machineInfo: licenseState.machineInfo,

    // Actions
    refreshLicenseStatus,
    clearLicenseData,
    getLicenseInfo,
    getMachineInfo,
    checkLicenseStatus,

    // Utilities
    validateLicenseFormat,
    formatLicenseKey
  }
}
