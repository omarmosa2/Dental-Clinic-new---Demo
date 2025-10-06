import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import {
  CurrencyConfig,
  getCurrencyConfig,
  setDefaultCurrency,
  getDefaultCurrency,
  SUPPORTED_CURRENCIES,
  formatCurrency,
  formatCurrencyWithConfig,
  formatCurrencySymbol
} from '../lib/utils'

interface CurrencyContextType {
  // Current currency configuration
  currentCurrency: string
  currencyConfig: CurrencyConfig

  // Currency management
  setCurrency: (currency: string) => void
  getSupportedCurrencies: () => { [key: string]: CurrencyConfig }

  // Formatting functions that use current currency
  formatAmount: (amount: number, currency?: string) => string
  formatAmountSymbol: (amount: number, currency?: string) => string
  formatAmountWithConfig: (amount: number, config?: CurrencyConfig) => string

  // Currency information
  getCurrencySymbol: (currency?: string) => string
  getCurrencyName: (currency?: string, useArabic?: boolean) => string
  getCurrencyDecimals: (currency?: string) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const { currency, setCurrency: setStoreCurrency, settings, loadSettings } = useSettingsStore()

  // Load settings on mount if not already loaded
  useEffect(() => {
    if (!settings) {
      loadSettings()
    }
  }, [settings, loadSettings])

  // Get current currency from settings or default
  const currentCurrency = currency || settings?.currency || 'USD'
  const currencyConfig = getCurrencyConfig(currentCurrency)

  // Update default currency when it changes
  useEffect(() => {
    setDefaultCurrency(currentCurrency)
  }, [currentCurrency])

  // Currency management functions
  const setCurrency = (newCurrency: string) => {
    if (SUPPORTED_CURRENCIES[newCurrency]) {
      setStoreCurrency(newCurrency)
      setDefaultCurrency(newCurrency)
    } else {
      console.warn(`Unsupported currency: ${newCurrency}`)
    }
  }

  const getSupportedCurrencies = () => {
    return SUPPORTED_CURRENCIES
  }

  // Formatting functions that use current currency by default
  const formatAmount = (amount: number, currency?: string) => {
    return formatCurrency(amount, currency || currentCurrency)
  }

  const formatAmountSymbol = (amount: number, currency?: string) => {
    return formatCurrencySymbol(amount, currency || currentCurrency)
  }

  const formatAmountWithConfig = (amount: number, config?: CurrencyConfig) => {
    return formatCurrencyWithConfig(amount, config || currencyConfig)
  }

  // Currency information functions
  const getCurrencySymbol = (currency?: string) => {
    const config = getCurrencyConfig(currency || currentCurrency)
    return config.symbol
  }

  const getCurrencyName = (currency?: string, useArabic: boolean = false) => {
    const config = getCurrencyConfig(currency || currentCurrency)
    return useArabic ? config.nameAr : config.name
  }

  const getCurrencyDecimals = (currency?: string) => {
    const config = getCurrencyConfig(currency || currentCurrency)
    return config.decimals
  }

  const contextValue: CurrencyContextType = {
    // Current currency configuration
    currentCurrency,
    currencyConfig,

    // Currency management
    setCurrency,
    getSupportedCurrencies,

    // Formatting functions
    formatAmount,
    formatAmountSymbol,
    formatAmountWithConfig,

    // Currency information
    getCurrencySymbol,
    getCurrencyName,
    getCurrencyDecimals
  }

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook to use currency context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Convenience hooks for common operations
export function useFormatCurrency() {
  const { formatAmount } = useCurrency()
  return formatAmount
}

export function useCurrencySymbol() {
  const { getCurrencySymbol } = useCurrency()
  return getCurrencySymbol()
}

export function useCurrentCurrency() {
  const { currentCurrency, currencyConfig } = useCurrency()
  return { currency: currentCurrency, config: currencyConfig }
}

export default CurrencyContext
