'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'
import CategoryTransactions from './CategoryTransactions'
import AssetSearch from './AssetSearch'
import ConfirmModal from './ConfirmModal'
import AlertModal from './AlertModal'
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext'

interface Crypto {
  id: string
  symbol: string
  name: string
  amount: number
  purchasePrice: number
  currentPrice?: number
  totalValue?: number
  createdAt: string
  updatedAt: string
}

interface CryptoTableProps {
  crypto: Crypto[]
  onRefresh: () => void
}

export default function CryptoTable({ crypto, onRefresh }: CryptoTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCrypto, setEditingCrypto] = useState<string | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info')
  const { isBalanceVisible } = useBalanceVisibility()
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    amount: '',
    purchasePrice: '',
    totalAmount: ''
  })

  const formatCurrency = (amount: number) => {
    if (!isBalanceVisible) {
      return '••••••'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const calculateGainLoss = (cryptoItem: Crypto) => {
    if (!cryptoItem.currentPrice) return 0
    const currentValue = cryptoItem.currentPrice * cryptoItem.amount
    const purchaseValue = cryptoItem.purchasePrice * cryptoItem.amount
    return currentValue - purchaseValue
  }

  const calculateGainLossPercentage = (cryptoItem: Crypto) => {
    if (!cryptoItem.currentPrice) return 0
    const gainLoss = calculateGainLoss(cryptoItem)
    const purchaseValue = cryptoItem.purchasePrice * cryptoItem.amount
    return purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingCrypto ? `/api/crypto/${editingCrypto}` : '/api/crypto'
      const method = editingCrypto ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
          totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined
        }),
      })

      if (response.ok) {
        setFormData({ symbol: '', name: '', amount: '', purchasePrice: '', totalAmount: '' })
        setShowAddForm(false)
        setEditingCrypto(null)
        onRefresh()
      }
    } catch (error) {
      console.error('Error saving crypto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (cryptoItem: Crypto) => {
    setEditingCrypto(cryptoItem.id)
    setFormData({
      symbol: cryptoItem.symbol,
      name: cryptoItem.name,
      amount: cryptoItem.amount.toString(),
      purchasePrice: cryptoItem.purchasePrice.toString(),
      totalAmount: ''
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setFormData({ symbol: '', name: '', amount: '', purchasePrice: '', totalAmount: '' })
    setShowAddForm(false)
    setEditingCrypto(null)
  }

  const handleAddTransaction = (cryptoItem: Crypto) => {
    setSelectedCrypto(cryptoItem)
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
      const response = await fetch(`/api/crypto/${deleteItemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setAlertMessage('Crypto asset deleted successfully!')
        setAlertType('success')
        setShowAlertModal(true)
      } else {
        setAlertMessage('Failed to delete crypto asset. Please try again.')
        setAlertType('error')
        setShowAlertModal(true)
      }
    } catch (error) {
      console.error('Error deleting crypto:', error)
      setAlertMessage('An error occurred while deleting the crypto asset.')
      setAlertType('error')
      setShowAlertModal(true)
    } finally {
      setShowConfirmModal(false)
      setDeleteItemId(null)
    }
  }

  const totalValue = crypto?.reduce((sum, cryptoItem) => 
    sum + (cryptoItem.totalValue || cryptoItem.amount * cryptoItem.purchasePrice), 0) || 0
  const totalGainLoss = crypto?.reduce((sum, cryptoItem) => 
    sum + calculateGainLoss(cryptoItem), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cryptocurrency</h2>
          <div className="flex space-x-4 text-gray-500 dark:text-gray-400">
            <span>Total Value: {formatCurrency(totalValue)}</span>
            <span className={totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              Gain/Loss: {formatCurrency(totalGainLoss)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          Add Crypto
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingCrypto ? 'Edit Crypto Asset' : 'Add New Crypto Asset'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Cryptocurrency
                </label>
                <AssetSearch
                  onSelect={handleAssetSelect}
                  type="crypto"
                  placeholder="Search for cryptocurrencies (e.g., Bitcoin, Ethereum, Cardano)..."
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Amount (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount || ''}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value, amount: '', purchasePrice: '' })}
                  className="input"
                  placeholder="e.g., 1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total amount you want to invest. Amount will be calculated automatically.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Or specify amount manually
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value, totalAmount: '', purchasePrice: '' })}
                  className="input"
                  placeholder="e.g., 0.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if using total amount above.
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (editingCrypto ? 'Updating...' : 'Adding...') : (editingCrypto ? 'Update Crypto' : 'Add Crypto')}
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
                <th>Amount</th>
                <th>Purchase Price</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crypto && crypto.length > 0 ? (
                crypto.map((cryptoItem) => {
                  const gainLoss = calculateGainLoss(cryptoItem)
                  const gainLossPercentage = calculateGainLossPercentage(cryptoItem)
                  const currentValue = cryptoItem.totalValue || cryptoItem.amount * cryptoItem.purchasePrice

                  return (
                    <tr key={cryptoItem.id}>
                      <td className="font-medium">{cryptoItem.symbol}</td>
                      <td>{cryptoItem.name}</td>
                      <td>{cryptoItem.amount.toFixed(2)}</td>
                      <td>{formatCurrency(cryptoItem.purchasePrice)}</td>
                      <td>
                        {cryptoItem.currentPrice ? formatCurrency(cryptoItem.currentPrice) : 'N/A'}
                      </td>
                      <td className="font-medium">{formatCurrency(currentValue)}</td>
                      <td>
                        <div className={gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          <div className="font-medium">{formatCurrency(gainLoss)}</div>
                          <div className="text-sm">({gainLossPercentage.toFixed(2)}%)</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddTransaction(cryptoItem)}
                            className="btn-primary text-sm"
                          >
                            Transaction
                          </button>
                          <button
                            onClick={() => handleEdit(cryptoItem)}
                            className="btn-secondary text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cryptoItem.id)}
                            className="btn-danger text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No cryptocurrency found. Add your first crypto asset to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {selectedCrypto && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          assetType="crypto"
          assetId={selectedCrypto.id}
          assetName={selectedCrypto.name}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {/* All Crypto Transactions */}
      <CategoryTransactions
        assetType="crypto"
        categoryName="Cryptocurrency"
        refreshTrigger={refreshTrigger}
      />

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          type="danger"
          title="Delete Crypto Asset"
          message="Are you sure you want to delete this crypto asset? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertModal
          type={alertType}
          title={alertType === 'success' ? 'Success' : alertType === 'error' ? 'Error' : 'Information'}
          message={alertMessage}
          buttonText="OK"
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  )
}
