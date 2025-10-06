/**
 * Mock License Manager for Demo Mode
 * This service provides mock license functionality when the application is running in demo mode
 */

import { demoModeUtils } from '../config/demoMode'

export interface MockLicenseData {
  license: string
  hwid: string
  timestamp: number
  activated: boolean
}

export interface MockLicenseValidationResult {
  isValid: boolean
  error?: string
  licenseData?: MockLicenseData
}

export interface MockMachineInfo {
  hwid: string
  platform: string
  arch: string
  error?: string
}

export class MockLicenseManager {
  private static instance: MockLicenseManager
  private currentHWID: string

  private constructor() {
    this.currentHWID = this.generateMockHWID()
  }

  public static getInstance(): MockLicenseManager {
    if (!MockLicenseManager.instance) {
      MockLicenseManager.instance = new MockLicenseManager()
    }
    return MockLicenseManager.instance
  }

  /**
   * Generate a mock hardware ID for demo mode
   */
  private generateMockHWID(): string {
    // Generate a consistent mock HWID for demo mode
    const mockHWID = 'DEMO-HWID-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    return mockHWID
  }

  /**
   * Get current hardware ID
   */
  public getCurrentHWID(): string {
    return this.currentHWID
  }

  /**
   * Get machine information (mock)
   */
  public async getMachineInfo(): Promise<MockMachineInfo> {
    return {
      hwid: this.currentHWID,
      platform: 'demo',
      arch: 'x64'
    }
  }

  /**
   * Check if license is required (always false in demo mode)
   */
  public isFirstRun(): boolean {
    return false
  }

  /**
   * Validate stored license (always valid in demo mode)
   */
  public async validateStoredLicense(): Promise<MockLicenseValidationResult> {
    // In demo mode, always return valid license
    const mockLicenseData: MockLicenseData = {
      license: 'DEMO-LICENSE-KEY',
      hwid: this.currentHWID,
      timestamp: Date.now(),
      activated: true
    }

    return {
      isValid: true,
      licenseData: mockLicenseData
    }
  }

  /**
   * Activate license (always succeeds in demo mode)
   */
  public async activateLicense(licenseKey: string): Promise<MockLicenseValidationResult> {
    // In demo mode, accept any license key
    const mockLicenseData: MockLicenseData = {
      license: licenseKey || 'DEMO-LICENSE-KEY',
      hwid: this.currentHWID,
      timestamp: Date.now(),
      activated: true
    }

    // Store the mock license data
    demoModeUtils.saveToStorage('mock_license', mockLicenseData)

    return {
      isValid: true,
      licenseData: mockLicenseData
    }
  }

  /**
   * Get license information (mock)
   */
  public async getLicenseInfo(): Promise<MockLicenseData | null> {
    const storedLicense = demoModeUtils.loadFromStorage('mock_license')
    if (storedLicense) {
      return storedLicense
    }

    // Return default mock license info
    return {
      license: 'DEMO-LICENSE-KEY',
      hwid: this.currentHWID,
      timestamp: Date.now(),
      activated: true
    }
  }

  /**
   * Clear license data (mock)
   */
  public async clearLicenseData(): Promise<void> {
    demoModeUtils.saveToStorage('mock_license', null)
  }

  /**
   * Validate license key format (mock - always returns true)
   */
  public validateLicenseFormat(licenseKey: string): boolean {
    // In demo mode, accept any non-empty string
    return licenseKey && licenseKey.trim().length > 0
  }

  /**
   * Check license status (always valid in demo mode)
   */
  public async checkLicenseStatus(): Promise<{
    isValid: boolean
    isFirstRun: boolean
    error?: string
  }> {
    return {
      isValid: true,
      isFirstRun: false
    }
  }
}

// Export singleton instance
export const mockLicenseManager = MockLicenseManager.getInstance()
