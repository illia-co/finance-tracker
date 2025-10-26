'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'
import CategoryTransactions from './CategoryTransactions'

interface Account {
  id: string
  name: string
  bank: string
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

interface AccountsTableProps {
  accounts: Account[]
  onRefresh: () => void
}

export default function AccountsTable({ accounts, onRefresh }: AccountsTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    balance: '',
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
      const url = editingAccount ? `/api/accounts/${editingAccount}` : '/api/accounts'
      const method = editingAccount ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance)
        }),
      })

      if (response.ok) {
        setFormData({ name: '', bank: '', balance: '', currency: 'USD' })
        setShowAddForm(false)
        setEditingAccount(null)
        onRefresh()
      }
    } catch (error) {
      console.error('Error saving account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account.id)
    setFormData({
      name: account.name,
      bank: account.bank,
      balance: account.balance.toString(),
      currency: account.currency
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', bank: '', balance: '', currency: 'EUR' })
    setShowAddForm(false)
    setEditingAccount(null)
  }

  const handleAddTransaction = (account: Account) => {
    setSelectedAccount(account)
    setShowTransactionModal(true)
  }

  const handleTransactionAdded = () => {
    onRefresh()
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Accounts</h2>
          <p className="text-gray-500">Total: {formatCurrency(totalBalance)}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          Add Account
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank
                </label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
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
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (editingAccount ? 'Updating...' : 'Adding...') : (editingAccount ? 'Update Account' : 'Add Account')}
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
                <th>Account Name</th>
                <th>Bank</th>
                <th>Balance</th>
                <th>Currency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="font-medium">{account.name}</td>
                  <td>{account.bank}</td>
                  <td className="font-medium">
                    {formatCurrency(account.balance, account.currency)}
                  </td>
                  <td>{account.currency}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddTransaction(account)}
                        className="btn-primary text-sm"
                      >
                        Transaction
                      </button>
                      <button
                        onClick={() => handleEdit(account)}
                        className="btn-secondary text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
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
      {selectedAccount && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          assetType="account"
          assetId={selectedAccount.id}
          assetName={selectedAccount.name}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {/* All Bank Account Transactions */}
      <CategoryTransactions
        assetType="account"
        categoryName="Bank Accounts"
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}
