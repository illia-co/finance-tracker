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

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/portfolio/history')
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching portfolio history:', error)
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

  if (history.length === 0) {
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
        data: history.map(item => item.totalValue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Bank Accounts',
        data: history.map(item => item.accountsValue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Investments',
        data: history.map(item => item.investmentsValue),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Crypto',
        data: history.map(item => item.cryptoValue),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Cash',
        data: history.map(item => item.cashValue),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: €${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '€' + value.toLocaleString()
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
  }

  return (
    <div className="card w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value Over Time</h3>
      <div className="h-96 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
