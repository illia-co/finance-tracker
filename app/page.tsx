'use client'

import { useState, useEffect } from 'react'
import PortfolioOverview from '@/components/PortfolioOverview'
import AccountsTable from '@/components/AccountsTable'
import InvestmentsTable from '@/components/InvestmentsTable'
import CryptoTable from '@/components/CryptoTable'
import CashTable from '@/components/CashTable'
import PortfolioChart from '@/components/PortfolioChart'

interface PortfolioData {
  total: number
  breakdown: {
    accounts: number
    investments: number
    crypto: number
    cash: number
  }
  accounts: any[]
  investments: any[]
  crypto: any[]
  cash: any[]
}

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Load saved tab from localStorage
    const savedTab = localStorage.getItem('finance-tracker-active-tab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async (updatePrices = false) => {
    try {
      const url = updatePrices ? '/api/portfolio?updatePrices=true' : '/api/portfolio'
      const response = await fetch(url)
      const data = await response.json()
      setPortfolioData(data)
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    fetchPortfolioData(true) // Update prices when refreshing
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    localStorage.setItem('finance-tracker-active-tab', tabId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load portfolio data</p>
        <button 
          onClick={refreshData}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'accounts', name: 'Bank Accounts' },
              { id: 'investments', name: 'Investments' },
              { id: 'crypto', name: 'Crypto' },
              { id: 'cash', name: 'Cash' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <PortfolioOverview 
              data={portfolioData} 
              onRefresh={refreshData}
            />
            <PortfolioChart />
          </div>
        )}

        {activeTab === 'accounts' && (
          <AccountsTable 
            accounts={portfolioData.accounts}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsTable 
            investments={portfolioData.investments}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'crypto' && (
          <CryptoTable 
            crypto={portfolioData.crypto}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'cash' && (
          <CashTable 
            cash={portfolioData.cash}
            onRefresh={refreshData}
          />
        )}
      </div>
    )
}
