import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext'

export function formatCurrency(amount: number, currency: string = 'EUR', isVisible: boolean = true) {
  if (!isVisible) {
    return '••••••'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatHiddenCurrency(amount: number, currency: string = 'EUR') {
  return '••••••'
}
