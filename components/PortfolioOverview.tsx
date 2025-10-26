'use client'

import { useState } from 'react'

interface PortfolioData {
  total: number
  breakdown: {
    accounts: number
    investments: number
    crypto: number
    cash: number
  }
}

interface PortfolioOverviewProps {
  data: PortfolioData
  onRefresh: () => void
}

export default function PortfolioOverview({ data, onRefresh }: PortfolioOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  }

  // Add safety check for data
  if (!data || !data.breakdown) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  const categories = [
    {
      name: 'Bank Accounts',
      value: data.breakdown.accounts,
      color: 'bg-blue-500',
      percentage: getPercentage(data.breakdown.accounts, data.total)
    },
    {
      name: 'Investments',
      value: data.breakdown.investments,
      color: 'bg-green-500',
      percentage: getPercentage(data.breakdown.investments, data.total)
    },
    {
      name: 'Crypto',
      value: data.breakdown.crypto,
      color: 'bg-yellow-500',
      percentage: getPercentage(data.breakdown.crypto, data.total)
    },
    {
      name: 'Cash',
      value: data.breakdown.cash,
      color: 'bg-purple-500',
      percentage: getPercentage(data.breakdown.cash, data.total)
    }
  ]

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Total Portfolio Value</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        <div className="text-4xl font-bold text-primary-600 mb-2">
          {formatCurrency(data.total)}
        </div>
        <p className="text-gray-500">Last updated: {new Date().toLocaleString()}</p>
      </div>

      {/* Portfolio Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.name} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(category.value)}
            </div>
            <div className="text-sm text-gray-500">
              {category.percentage}% of total
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Distribution Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-3 flex-shrink-0">
                <div className={`w-full h-full rounded-full ${category.color}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(category.value)} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
