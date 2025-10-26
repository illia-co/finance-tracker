import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetType = searchParams.get('assetType')
    const assetId = searchParams.get('assetId')

    const where: any = {}
    if (assetType) where.assetType = assetType
    if (assetId) where.assetId = assetId

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    // Get asset information for each transaction
    const transactionsWithAssets = await Promise.all(
      transactions.map(async (transaction) => {
        let assetInfo = null
        
        try {
          switch (transaction.assetType) {
            case 'account':
              const account = await prisma.account.findUnique({
                where: { id: transaction.assetId },
                select: { name: true, bank: true }
              })
              assetInfo = account ? { name: account.name, bank: account.bank } : null
              break
              
            case 'investment':
              const investment = await prisma.investment.findUnique({
                where: { id: transaction.assetId },
                select: { name: true, symbol: true }
              })
              assetInfo = investment ? { name: investment.name, symbol: investment.symbol } : null
              break
              
            case 'crypto':
              const crypto = await prisma.crypto.findUnique({
                where: { id: transaction.assetId },
                select: { name: true, symbol: true }
              })
              assetInfo = crypto ? { name: crypto.name, symbol: crypto.symbol } : null
              break
              
            case 'cash':
              const cash = await prisma.cash.findUnique({
                where: { id: transaction.assetId },
                select: { name: true }
              })
              assetInfo = cash ? { name: cash.name } : null
              break
          }
        } catch (error) {
          console.error(`Error fetching asset info for ${transaction.assetType}:${transaction.assetId}:`, error)
        }
        
        return {
          ...transaction,
          assetInfo
        }
      })
    )

    return NextResponse.json(transactionsWithAssets)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, assetType, assetId, amount, price, quantity, description, date } = body

    const transaction = await prisma.transaction.create({
      data: {
        type,
        assetType,
        assetId,
        amount,
        price,
        quantity,
        description,
        date: date ? new Date(date) : new Date()
      }
    })

    // Update the related asset based on transaction type
    await updateAssetFromTransaction(assetType, assetId, type, amount, price, quantity)

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

async function updateAssetFromTransaction(
  assetType: string, 
  assetId: string, 
  type: string, 
  amount: number, 
  price?: number, 
  quantity?: number
) {
  switch (assetType) {
    case 'account':
      if (type === 'deposit') {
        await prisma.account.update({
          where: { id: assetId },
          data: { balance: { increment: amount } }
        })
      } else if (type === 'withdrawal') {
        await prisma.account.update({
          where: { id: assetId },
          data: { balance: { decrement: amount } }
        })
      }
      break

    case 'investment':
      if (type === 'buy' && price && quantity) {
        // Calculate new average price and total shares
        const investment = await prisma.investment.findUnique({
          where: { id: assetId }
        })
        
        if (investment) {
          const totalShares = investment.shares + quantity
          const totalCost = (investment.shares * investment.purchasePrice) + (quantity * price)
          const newAveragePrice = totalCost / totalShares

          await prisma.investment.update({
            where: { id: assetId },
            data: {
              shares: totalShares,
              purchasePrice: newAveragePrice
            }
          })
        }
      } else if (type === 'sell' && quantity) {
        await prisma.investment.update({
          where: { id: assetId },
          data: { shares: { decrement: quantity } }
        })
      } else if (type === 'dividend') {
        await prisma.investment.update({
          where: { id: assetId },
          data: { dividends: { increment: amount } }
        })
      }
      break

    case 'crypto':
      if (type === 'buy' && price && quantity) {
        // Calculate new average price and total amount
        const crypto = await prisma.crypto.findUnique({
          where: { id: assetId }
        })
        
        if (crypto) {
          const totalAmount = crypto.amount + quantity
          const totalCost = (crypto.amount * crypto.purchasePrice) + (quantity * price)
          const newAveragePrice = totalCost / totalAmount

          await prisma.crypto.update({
            where: { id: assetId },
            data: {
              amount: totalAmount,
              purchasePrice: newAveragePrice
            }
          })
        }
      } else if (type === 'sell' && quantity) {
        await prisma.crypto.update({
          where: { id: assetId },
          data: { amount: { decrement: quantity } }
        })
      }
      break

    case 'cash':
      if (type === 'deposit') {
        await prisma.cash.update({
          where: { id: assetId },
          data: { amount: { increment: amount } }
        })
      } else if (type === 'withdrawal') {
        await prisma.cash.update({
          where: { id: assetId },
          data: { amount: { decrement: amount } }
        })
      }
      break
  }
}
