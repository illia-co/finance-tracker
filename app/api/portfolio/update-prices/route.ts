import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting price update process...')
    
    // Get all investments and crypto that need price updates
    const [investments, crypto] = await Promise.all([
      prisma.investment.findMany(),
      prisma.crypto.findMany()
    ])

    console.log(`Found ${investments.length} investments and ${crypto.length} crypto assets`)

    // Update investment prices
    const updatedInvestments = await updateInvestmentPrices(investments)
    
    // Update crypto prices
    const updatedCrypto = await updateCryptoPrices(crypto)

    // Calculate new totals
    const accounts = await prisma.account.findMany()
    const cash = await prisma.cash.findMany()
    
    const accountsTotal = accounts.reduce((sum, account) => sum + account.balance, 0)
    const investmentsTotal = updatedInvestments.reduce((sum, investment) => 
      sum + (investment.totalValue || investment.shares * investment.purchasePrice), 0)
    const cryptoTotal = updatedCrypto.reduce((sum, cryptoItem) => 
      sum + (cryptoItem.totalValue || cryptoItem.amount * cryptoItem.purchasePrice), 0)
    const cashTotal = cash.reduce((sum, cashItem) => sum + cashItem.amount, 0)

    const totalPortfolio = accountsTotal + investmentsTotal + cryptoTotal + cashTotal

    // Save portfolio history with updated values
    await prisma.portfolioHistory.create({
      data: {
        totalValue: totalPortfolio,
        accountsValue: accountsTotal,
        investmentsValue: investmentsTotal,
        cryptoValue: cryptoTotal,
        cashValue: cashTotal
      }
    })

    console.log('Price update completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Prices updated successfully',
      updated: {
        investments: updatedInvestments.length,
        crypto: updatedCrypto.length
      },
      totals: {
        total: totalPortfolio,
        accounts: accountsTotal,
        investments: investmentsTotal,
        crypto: cryptoTotal,
        cash: cashTotal
      }
    })
  } catch (error) {
    console.error('Error updating prices:', error)
    return NextResponse.json({ 
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function updateInvestmentPrices(investments: any[]) {
  const updatedInvestments = []
  
  for (const investment of investments) {
    try {
      // Get current price from Yahoo Finance
      const currentPrice = await getStockPrice(investment.symbol)
      
      if (currentPrice > 0) {
        const newTotalValue = investment.shares * currentPrice
        
        // Update investment with new price and total value
        const updated = await prisma.investment.update({
          where: { id: investment.id },
          data: {
            currentPrice: currentPrice,
            totalValue: newTotalValue,
            updatedAt: new Date()
          }
        })
        
        updatedInvestments.push(updated)
        console.log(`Updated ${investment.symbol}: €${currentPrice.toFixed(2)} (Total: €${newTotalValue.toFixed(2)})`)
      } else {
        console.log(`Could not get price for ${investment.symbol}`)
        updatedInvestments.push(investment)
      }
    } catch (error) {
      console.error(`Error updating price for ${investment.symbol}:`, error)
      updatedInvestments.push(investment)
    }
  }
  
  return updatedInvestments
}

async function updateCryptoPrices(crypto: any[]) {
  const updatedCrypto = []
  
  for (const cryptoItem of crypto) {
    try {
      // Get current price from CoinGecko
      const currentPrice = await getCryptoPrice(cryptoItem.symbol)
      
      if (currentPrice > 0) {
        const newTotalValue = cryptoItem.amount * currentPrice
        
        // Update crypto with new price and total value
        const updated = await prisma.crypto.update({
          where: { id: cryptoItem.id },
          data: {
            currentPrice: currentPrice,
            totalValue: newTotalValue,
            updatedAt: new Date()
          }
        })
        
        updatedCrypto.push(updated)
        console.log(`Updated ${cryptoItem.symbol}: €${currentPrice.toFixed(2)} (Total: €${newTotalValue.toFixed(2)})`)
      } else {
        console.log(`Could not get price for ${cryptoItem.symbol}`)
        updatedCrypto.push(cryptoItem)
      }
    } catch (error) {
      console.error(`Error updating price for ${cryptoItem.symbol}:`, error)
      updatedCrypto.push(cryptoItem)
    }
  }
  
  return updatedCrypto
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
