'use client'

import { useState, useEffect } from 'react'

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

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  assetType: string
  assetId: string
  assetName: string
  onTransactionAdded: () => void
}

export default function TransactionModal({
  isOpen,
  onClose,
  assetType,
  assetId,
  assetName,
  onTransactionAdded
}: TransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    price: '',
    quantity: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const transactionTypes = {
    account: [
      { value: 'deposit', label: 'Deposit' },
      { value: 'withdrawal', label: 'Withdrawal' }
    ],
    investment: [
      { value: 'buy', label: 'Buy Shares' },
      { value: 'sell', label: 'Sell Shares' },
      { value: 'dividend', label: 'Dividend Received' }
    ],
    crypto: [
      { value: 'buy', label: 'Buy Crypto' },
      { value: 'sell', label: 'Sell Crypto' }
    ],
    cash: [
      { value: 'deposit', label: 'Add Cash' },
      { value: 'withdrawal', label: 'Spend Cash' }
    ]
  }

  // Get current price when modal opens for investments and crypto
  useEffect(() => {
    if (isOpen && (assetType === 'investment' || assetType === 'crypto')) {
      fetchCurrentPrice()
    }
  }, [isOpen, assetType, assetId])

  const fetchCurrentPrice = async () => {
    setIsLoadingPrice(true)
    try {
      const response = await fetch(`/api/assets/price-by-name?name=${encodeURIComponent(assetName)}&type=${assetType}`)
      const data = await response.json()
      if (data.price > 0) {
        setCurrentPrice(data.price)
        setFormData(prev => ({ ...prev, price: data.price.toString() }))
      }
    } catch (error) {
      console.error('Error fetching current price:', error)
    } finally {
      setIsLoadingPrice(false)
    }
  }

  // Auto-calculate quantity when amount or price changes
  useEffect(() => {
    if (formData.amount && currentPrice && (formData.type === 'buy' || formData.type === 'sell')) {
      const quantity = parseFloat(formData.amount) / currentPrice
      setFormData(prev => ({ ...prev, quantity: quantity.toString() }))
    }
  }, [formData.amount, currentPrice, formData.type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          assetType,
          assetId,
          amount: parseFloat(formData.amount),
          price: formData.price ? parseFloat(formData.price) : undefined,
          quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
          description: formData.description,
          date: formData.date
        }),
      })

      if (response.ok) {
        setFormData({
          type: '',
          amount: '',
          price: '',
          quantity: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        })
        // Refresh the parent component data
        onTransactionAdded()
        onClose()
      } else {
        const errorData = await response.json()
        console.error('Transaction creation failed:', errorData)
        alert('Failed to create transaction: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      type: '',
      amount: '',
      price: '',
      quantity: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add Transaction - {assetName}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input"
              required
            >
              <option value="">Select type</option>
              {transactionTypes[assetType as keyof typeof transactionTypes]?.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (EUR)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="Enter total amount in EUR"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the total amount you want to invest/spend. Quantity will be calculated automatically.
            </p>
          </div>

          {(formData.type === 'buy' || formData.type === 'sell') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Price per Unit (EUR)
                  {isLoadingPrice && <span className="text-blue-500 ml-2">Loading...</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
                  required
                  readOnly={currentPrice !== null}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current market price (automatically fetched)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Calculated)
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input"
                  required
                  readOnly={formData.amount && currentPrice ? true : false}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.amount && currentPrice 
                    ? `Calculated: ${formData.amount} ÷ ${currentPrice} = ${formData.quantity}`
                    : 'Enter amount above to auto-calculate'
                  }
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="Transaction description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
