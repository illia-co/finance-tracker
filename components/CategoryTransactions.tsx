'use client'

import { useState, useEffect } from 'react'
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext'

interface Transaction {
  id: string
  type: string
  assetType: string
  assetId: string
  amount: number
  price?: number
  quantity?: number
  description?: string
  date: string
  assetInfo?: {
    name: string
    bank?: string
    symbol?: string
    location?: string
  } | null
}

interface CategoryTransactionsProps {
  assetType: string
  categoryName: string
  refreshTrigger?: number // Add this to trigger refresh when transactions are added
}

export default function CategoryTransactions({ assetType, categoryName, refreshTrigger }: CategoryTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { isBalanceVisible } = useBalanceVisibility()

  useEffect(() => {
    fetchTransactions()
  }, [assetType, refreshTrigger])

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?assetType=${assetType}`)
      const data = await response.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (!isBalanceVisible) {
      return '••••••'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      buy: 'Buy',
      sell: 'Sell',
      dividend: 'Dividend'
    }
    return labels[type] || type
  }

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      deposit: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
      withdrawal: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
      buy: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
      sell: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
      dividend: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20'
    }
    return colors[type] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'
  }

  const getAssetDisplayName = (transaction: Transaction) => {
    if (!transaction.assetInfo) return 'Unknown Asset'
    
    const { assetInfo } = transaction
    
    switch (transaction.assetType) {
      case 'account':
        return `${assetInfo.name} (${assetInfo.bank})`
      case 'investment':
        return `${assetInfo.name} (${assetInfo.symbol})`
      case 'crypto':
        return `${assetInfo.name} (${assetInfo.symbol})`
      case 'cash':
        return assetInfo.location ? `${assetInfo.name} (${assetInfo.location})` : assetInfo.name
      default:
        return assetInfo.name
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {categoryName} Transactions
      </h3>
      
      {!transactions || transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first transaction using the "Transaction" button above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  
                  {/* Asset Information */}
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getAssetDisplayName(transaction)}
                    </span>
                  </div>
                  
                  {transaction.description && (
                    <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">
                      Amount: {formatCurrency(transaction.amount)}
                    </span>
                    
                    {transaction.price && (
                      <span>
                        Price: {formatCurrency(transaction.price)}
                      </span>
                    )}
                    
                    {transaction.quantity && (
                      <span>
                        Qty: {transaction.quantity}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    transaction.type === 'deposit' || transaction.type === 'buy' || transaction.type === 'dividend' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'buy' || transaction.type === 'dividend' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
