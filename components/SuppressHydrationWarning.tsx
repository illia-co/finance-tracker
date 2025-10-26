'use client'

import { useEffect } from 'react'

export default function SuppressHydrationWarning() {
  useEffect(() => {
    // Suppress hydration warnings from browser extensions
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn
    
    console.error = (...args) => {
      // Filter out hydration warnings from browser extensions
      const message = args[0]?.toString() || ''
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('cz-shortcut-listen') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed')
      ) {
        return
      }
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      // Filter out hydration warnings from browser extensions
      const message = args[0]?.toString() || ''
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('cz-shortcut-listen') ||
        message.includes('data-new-gr-c-s-check-loaded') ||
        message.includes('data-gr-ext-installed')
      ) {
        return
      }
      originalConsoleWarn.apply(console, args)
    }

    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }, [])

  return null
}
