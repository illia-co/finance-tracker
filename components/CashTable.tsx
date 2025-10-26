'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'
import CategoryTransactions from './CategoryTransactions'

interface Cash {
  id: string
  name: string
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

interface CashTableProps {
  cash: Cash[]
  onRefresh: () => void
}

export default function CashTable({ cash, onRefresh }: CashTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCash, setEditingCash] = useState<string | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedCash, setSelectedCash] = useState<Cash | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'EUR'
  })

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingCash ? `/api/cash/${editingCash}` : '/api/cash'
      const method = editingCash ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      })

      if (response.ok) {
        setFormData({ name: '', amount: '', currency: 'EUR' })
        setShowAddForm(false)
        setEditingCash(null)
        onRefresh()
      }
    } catch (error) {
      console.error('Error saving cash:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (cashItem: Cash) => {
    setEditingCash(cashItem.id)
      setFormData({
        name: cashItem.name,
        amount: cashItem.amount.toString(),
        currency: cashItem.currency
      })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', amount: '', currency: 'EUR' })
    setShowAddForm(false)
    setEditingCash(null)
  }

  const handleAddTransaction = (cashItem: Cash) => {
    setSelectedCash(cashItem)
    setShowTransactionModal(true)
  }

  const handleTransactionAdded = () => {
    onRefresh()
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cash entry?')) return

    try {
      const response = await fetch(`/api/cash/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting cash:', error)
    }
  }

  const totalAmount = cash?.reduce((sum, cashItem) => sum + cashItem.amount, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cash</h2>
          <p className="text-gray-500">Total: {formatCurrency(totalAmount)}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          Add Cash
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCash ? 'Edit Cash Entry' : 'Add New Cash Entry'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name/Description
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Emergency Fund, Travel Money"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (editingCash ? 'Updating...' : 'Adding...') : (editingCash ? 'Update Cash' : 'Add Cash')}
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
                <th>Name</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cash?.map((cashItem) => (
                <tr key={cashItem.id}>
                  <td className="font-medium">{cashItem.name}</td>
                  <td className="font-medium">
                    {formatCurrency(cashItem.amount, cashItem.currency)}
                  </td>
                  <td>{cashItem.currency}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddTransaction(cashItem)}
                        className="btn-primary text-sm"
                      >
                        Transaction
                      </button>
                      <button
                        onClick={() => handleEdit(cashItem)}
                        className="btn-secondary text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cashItem.id)}
                        className="btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {selectedCash && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          assetType="cash"
          assetId={selectedCash.id}
          assetName={selectedCash.name}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {/* All Cash Transactions */}
      <CategoryTransactions
        assetType="cash"
        categoryName="Cash"
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}
