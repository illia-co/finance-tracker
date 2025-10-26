import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMultipleStockPrices } from '@/lib/api'

export async function GET() {
  try {
    const investments = await prisma.investment.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Update current prices
    const symbols = investments.map(inv => inv.symbol)
    const prices = await getMultipleStockPrices(symbols)

    const updatedInvestments = await Promise.all(
      investments.map(async (investment) => {
        const currentPrice = prices[investment.symbol]
        if (currentPrice) {
          const totalValue = currentPrice * investment.shares
          return await prisma.investment.update({
            where: { id: investment.id },
            data: {
              currentPrice,
              totalValue
            }
          })
        }
        return investment
      })
    )

    return NextResponse.json(updatedInvestments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbol, name, shares, purchasePrice, totalAmount } = body

    // Get current price from Yahoo Finance
    const currentPrice = await getStockPrice(symbol)
    
    let finalShares = shares
    let finalPurchasePrice = purchasePrice

    // If totalAmount is provided, calculate shares based on current price
    if (totalAmount && currentPrice > 0) {
      finalShares = totalAmount / currentPrice
      finalPurchasePrice = currentPrice
    }

    const totalValue = finalShares * (currentPrice || finalPurchasePrice)

    const investment = await prisma.investment.create({
      data: {
        symbol,
        name,
        shares: finalShares,
        purchasePrice: finalPurchasePrice,
        currentPrice: currentPrice || finalPurchasePrice,
        totalValue: totalValue
      }
    })

    return NextResponse.json(investment)
  } catch (error) {
    console.error('Error creating investment:', error)
    return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 })
  }
}

async function getStockPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`)
    }
    
    const data = await response.json()
    const result = data.chart?.result?.[0]
    
    if (!result || !result.meta) {
      throw new Error('Invalid stock data')
    }
    
    return result.meta.regularMarketPrice || 0
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error)
    return 0
  }
}
