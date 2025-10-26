'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'
import CategoryTransactions from './CategoryTransactions'
import AssetSearch from './AssetSearch'
import ConfirmModal from './ConfirmModal'
import AlertModal from './AlertModal'

interface Investment {
  id: string
  symbol: string
  name: string
  shares: number
  purchasePrice: number
  currentPrice?: number
  totalValue?: number
  dividends: number
  createdAt: string
  updatedAt: string
}

interface InvestmentsTableProps {
  investments: Investment[]
  onRefresh: () => void
}

export default function InvestmentsTable({ investments, onRefresh }: InvestmentsTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info')
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchasePrice: '',
    dividends: '',
    totalAmount: ''
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const calculateGainLoss = (investment: Investment) => {
    if (!investment.currentPrice) return 0
    const currentValue = investment.currentPrice * investment.shares
    const purchaseValue = investment.purchasePrice * investment.shares
    return currentValue - purchaseValue
  }

  const calculateGainLossPercentage = (investment: Investment) => {
    if (!investment.currentPrice) return 0
    const gainLoss = calculateGainLoss(investment)
    const purchaseValue = investment.purchasePrice * investment.shares
    return purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingInvestment ? `/api/investments/${editingInvestment}` : '/api/investments'
      const method = editingInvestment ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          shares: formData.shares ? parseFloat(formData.shares) : undefined,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
          dividends: parseFloat(formData.dividends || '0'),
          totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined
        }),
      })

      if (response.ok) {
        setFormData({ symbol: '', name: '', shares: '', purchasePrice: '', dividends: '', totalAmount: '' })
        setShowAddForm(false)
        setEditingInvestment(null)
        onRefresh()
      }
    } catch (error) {
      console.error('Error saving investment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment.id)
    setFormData({
      symbol: investment.symbol,
      name: investment.name,
      shares: investment.shares.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      dividends: investment.dividends.toString()
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setFormData({ symbol: '', name: '', shares: '', purchasePrice: '', dividends: '' })
    setShowAddForm(false)
    setEditingInvestment(null)
  }

  const handleAddTransaction = (investment: Investment) => {
    setSelectedInvestment(investment)
    setShowTransactionModal(true)
  }

  const handleTransactionAdded = () => {
    onRefresh()
    setRefreshTrigger(prev => prev + 1)
  }

  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset)
    setFormData(prev => ({
      ...prev,
      symbol: asset.symbol,
      name: asset.name
    }))
  }

  const handleDelete = (id: string) => {
    setDeleteItemId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteItemId) return

    try {
      const response = await fetch(`/api/investments/${deleteItemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setAlertMessage('Investment deleted successfully!')
        setAlertType('success')
        setShowAlertModal(true)
      } else {
        setAlertMessage('Failed to delete investment. Please try again.')
        setAlertType('error')
        setShowAlertModal(true)
      }
    } catch (error) {
      console.error('Error deleting investment:', error)
      setAlertMessage('An error occurred while deleting the investment.')
      setAlertType('error')
      setShowAlertModal(true)
    } finally {
      setShowConfirmModal(false)
      setDeleteItemId(null)
    }
  }

  const totalValue = investments.reduce((sum, investment) => 
    sum + (investment.totalValue || investment.shares * investment.purchasePrice), 0)
  const totalGainLoss = investments.reduce((sum, investment) => 
    sum + calculateGainLoss(investment), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investments</h2>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>Total Value: {formatCurrency(totalValue)}</span>
            <span className={totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
              Gain/Loss: {formatCurrency(totalGainLoss)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          Add Investment
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Stock
                </label>
                <AssetSearch
                  onSelect={handleAssetSelect}
                  type="stocks"
                  placeholder="Search for stocks (e.g., Apple, Microsoft, Tesla)..."
                />
                {selectedAsset && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>Selected:</strong> {selectedAsset.name} ({selectedAsset.symbol})
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount || ''}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value, shares: '', purchasePrice: '' })}
                  className="input"
                  placeholder="e.g., 1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total amount you want to invest. Shares will be calculated automatically.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or specify shares manually
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shares}
                  onChange={(e) => setFormData({ ...formData, shares: e.target.value, totalAmount: '', purchasePrice: '' })}
                  className="input"
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if using total amount above.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dividends Received
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.dividends}
                  onChange={(e) => setFormData({ ...formData, dividends: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (editingInvestment ? 'Updating...' : 'Adding...') : (editingInvestment ? 'Update Investment' : 'Add Investment')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Shares</th>
                <th>Purchase Price</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => {
                const gainLoss = calculateGainLoss(investment)
                const gainLossPercentage = calculateGainLossPercentage(investment)
                const currentValue = investment.totalValue || investment.shares * investment.purchasePrice

                return (
                  <tr key={investment.id}>
                    <td className="font-medium">{investment.symbol}</td>
                    <td>{investment.name}</td>
                    <td>{investment.shares.toFixed(2)}</td>
                    <td>{formatCurrency(investment.purchasePrice)}</td>
                    <td>
                      {investment.currentPrice ? formatCurrency(investment.currentPrice) : 'N/A'}
                    </td>
                    <td className="font-medium">{formatCurrency(currentValue)}</td>
                    <td>
                      <div className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        <div className="font-medium">{formatCurrency(gainLoss)}</div>
                        <div className="text-sm">({gainLossPercentage.toFixed(2)}%)</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddTransaction(investment)}
                          className="btn-primary text-sm"
                        >
                          Transaction
                        </button>
                        <button
                          onClick={() => handleEdit(investment)}
                          className="btn-secondary text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(investment.id)}
                          className="btn-danger text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {selectedInvestment && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          assetType="investment"
          assetId={selectedInvestment.id}
          assetName={selectedInvestment.name}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {/* All Investment Transactions */}
      <CategoryTransactions
        assetType="investment"
        categoryName="Investments"
        refreshTrigger={refreshTrigger}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Delete Investment"
        message="Are you sure you want to delete this investment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertType === 'success' ? 'Success' : alertType === 'error' ? 'Error' : 'Information'}
        message={alertMessage}
        type={alertType}
      />
    </div>
  )
}
