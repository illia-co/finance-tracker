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
}

interface TransactionHistoryProps {
  assetType: string
  assetId: string
  assetName: string
}

export default function TransactionHistory({ assetType, assetId, assetName }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { isBalanceVisible } = useBalanceVisibility()

  useEffect(() => {
    fetchTransactions()
  }, [assetType, assetId])

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions/${assetType}/${assetId}`)
      const data = await response.json()
      // Ensure data is an array
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
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
      deposit: 'text-green-600 dark:text-green-400',
      withdrawal: 'text-red-600 dark:text-red-400',
      buy: 'text-blue-600 dark:text-blue-400',
      sell: 'text-orange-600 dark:text-orange-400',
      dividend: 'text-purple-600 dark:text-purple-400'
    }
    return colors[type] || 'text-gray-600'
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
        Transaction History - {assetName}
      </h3>
      
      {!transactions || transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-3 border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  
                  {transaction.description && (
                    <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="font-medium">
                      Amount: {formatCurrency(transaction.amount)}
                    </span>
                    
                    {transaction.price && (
                      <span className="text-gray-600">
                        Price: {formatCurrency(transaction.price)}
                      </span>
                    )}
                    
                    {transaction.quantity && (
                      <span className="text-gray-600">
                        Quantity: {transaction.quantity}
                      </span>
                    )}
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
