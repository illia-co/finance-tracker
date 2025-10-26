import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const updatePrices = searchParams.get('updatePrices') === 'true'

    // If updatePrices is requested, update prices first
    if (updatePrices) {
      console.log('Updating prices before fetching portfolio data...')
      await updateAllPrices()
    }

    // Get all data
    const [accounts, investments, crypto, cash] = await Promise.all([
      prisma.account.findMany(),
      prisma.investment.findMany(),
      prisma.crypto.findMany(),
      prisma.cash.findMany()
    ])

    // Calculate totals
    const accountsTotal = accounts.reduce((sum, account) => sum + account.balance, 0)
    const investmentsTotal = investments.reduce((sum, investment) => 
      sum + (investment.totalValue || investment.shares * investment.purchasePrice), 0)
    const cryptoTotal = crypto.reduce((sum, cryptoItem) => 
      sum + (cryptoItem.totalValue || cryptoItem.amount * cryptoItem.purchasePrice), 0)
    const cashTotal = cash.reduce((sum, cashItem) => sum + cashItem.amount, 0)

    const totalPortfolio = accountsTotal + investmentsTotal + cryptoTotal + cashTotal

    // Save portfolio history
    await prisma.portfolioHistory.create({
      data: {
        totalValue: totalPortfolio,
        accountsValue: accountsTotal,
        investmentsValue: investmentsTotal,
        cryptoValue: cryptoTotal,
        cashValue: cashTotal
      }
    })

    return NextResponse.json({
      total: totalPortfolio,
      breakdown: {
        accounts: accountsTotal,
        investments: investmentsTotal,
        crypto: cryptoTotal,
        cash: cashTotal
      },
      accounts,
      investments,
      crypto,
      cash
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

async function updateAllPrices() {
  try {
    // Get all investments and crypto that need price updates
    const [investments, crypto] = await Promise.all([
      prisma.investment.findMany(),
      prisma.crypto.findMany()
    ])

    console.log(`Updating prices for ${investments.length} investments and ${crypto.length} crypto assets`)

    // Update investment prices
    for (const investment of investments) {
      try {
        const currentPrice = await getStockPrice(investment.symbol)
        if (currentPrice > 0) {
          const newTotalValue = investment.shares * currentPrice
          await prisma.investment.update({
            where: { id: investment.id },
            data: {
              currentPrice: currentPrice,
              totalValue: newTotalValue,
              updatedAt: new Date()
            }
          })
          console.log(`Updated ${investment.symbol}: €${currentPrice.toFixed(2)}`)
        }
      } catch (error) {
        console.error(`Error updating price for ${investment.symbol}:`, error)
      }
    }

    // Update crypto prices
    for (const cryptoItem of crypto) {
      try {
        const currentPrice = await getCryptoPrice(cryptoItem.symbol)
        if (currentPrice > 0) {
          const newTotalValue = cryptoItem.amount * currentPrice
          await prisma.crypto.update({
            where: { id: cryptoItem.id },
            data: {
              currentPrice: currentPrice,
              totalValue: newTotalValue,
              updatedAt: new Date()
            }
          })
          console.log(`Updated ${cryptoItem.symbol}: €${currentPrice.toFixed(2)}`)
        }
      } catch (error) {
        console.error(`Error updating price for ${cryptoItem.symbol}:`, error)
      }
    }
  } catch (error) {
    console.error('Error updating prices:', error)
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

async function getCryptoPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=eur`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }
    
    const data = await response.json()
    const price = data[symbol]?.eur
    
    return price || 0
  } catch (error) {
    console.error(`Error fetching crypto price for ${symbol}:`, error)
    return 0
  }
}
