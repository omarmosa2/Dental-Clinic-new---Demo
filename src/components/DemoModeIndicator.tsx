/**
 * Demo Mode Indicator Component
 * Shows a visual indicator when the application is running in demo mode
 */

import React from 'react'
import { isDemoMode } from '../config/demoMode'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

interface DemoModeIndicatorProps {
  className?: string
}

export default function DemoModeIndicator({ className = '' }: DemoModeIndicatorProps) {
  // Only show in demo mode
  if (!isDemoMode()) {
    return null
  }

  return (
    <Badge 
      variant="destructive" 
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium ${className}`}
    >
      <AlertTriangle className="w-3 h-3" />
      <span>وضع تجريبي</span>
    </Badge>
  )
}
