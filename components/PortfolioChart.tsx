'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext'
import { useTheme } from '@/contexts/ThemeContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface PortfolioHistory {
  id: string
  totalValue: number
  date: string
  accountsValue: number
  investmentsValue: number
  cryptoValue: number
  cashValue: number
}

export default function PortfolioChart() {
  const [history, setHistory] = useState<PortfolioHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { isBalanceVisible } = useBalanceVisibility()
  const { theme } = useTheme()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/portfolio/history')
      const data = await response.json()
      // Ensure data is always an array
      setHistory(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching portfolio history:', error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Ensure history is always an array and has data
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio History</h3>
        <p className="text-gray-500">No historical data available</p>
      </div>
    )
  }

  const data = {
    labels: history.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Portfolio',
        data: isBalanceVisible ? history.map(item => item.totalValue) : history.map(() => 0),
        borderColor: theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)', // white in dark theme, gray-900 in light theme
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.1)',
        tension: 0.1,
        borderWidth: 3, // Make it thicker to stand out
      },
      {
        label: 'Bank Accounts',
        data: isBalanceVisible ? history.map(item => item.accountsValue) : history.map(() => 0),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Investments',
        data: isBalanceVisible ? history.map(item => item.investmentsValue) : history.map(() => 0),
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Crypto',
        data: isBalanceVisible ? history.map(item => item.cryptoValue) : history.map(() => 0),
        borderColor: 'rgb(234, 179, 8)', // yellow-500
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Cash',
        data: isBalanceVisible ? history.map(item => item.cashValue) : history.map(() => 0),
        borderColor: 'rgb(168, 85, 247)', // purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isBalanceVisible ? (theme === 'dark' ? '#ffffff' : '#374151') : '#6b7280'
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (!isBalanceVisible) {
              return `${context.dataset.label}: ••••••`
            }
            return `${context.dataset.label}: €${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: isBalanceVisible ? (theme === 'dark' ? '#ffffff' : '#374151') : '#6b7280',
          callback: function(value: any) {
            if (!isBalanceVisible) {
              return '••••••'
            }
            return '€' + value.toLocaleString()
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: isBalanceVisible ? (theme === 'dark' ? '#ffffff' : '#374151') : '#6b7280',
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        }
      }
    },
  }

  return (
    <div className="card w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Value Over Time</h3>
      <div className="h-96 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
