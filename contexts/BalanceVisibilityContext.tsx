'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BalanceVisibilityContextType {
  isBalanceVisible: boolean
  toggleBalanceVisibility: () => void
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined)

export function BalanceVisibilityProvider({ children }: { children: ReactNode }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prev => !prev)
  }

  return (
    <BalanceVisibilityContext.Provider value={{ isBalanceVisible, toggleBalanceVisibility }}>
      {children}
    </BalanceVisibilityContext.Provider>
  )
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext)
  if (context === undefined) {
    throw new Error('useBalanceVisibility must be used within a BalanceVisibilityProvider')
  }
  return context
}
