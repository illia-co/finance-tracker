import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMultipleCryptoPrices } from '@/lib/api'

export async function GET() {
  try {
    const crypto = await prisma.crypto.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Update current prices
    const symbols = crypto.map(c => c.symbol)
    const prices = await getMultipleCryptoPrices(symbols)

    const updatedCrypto = await Promise.all(
      crypto.map(async (cryptoItem) => {
        const currentPrice = prices[cryptoItem.symbol]
        if (currentPrice) {
          const totalValue = currentPrice * cryptoItem.amount
          return await prisma.crypto.update({
            where: { id: cryptoItem.id },
            data: {
              currentPrice,
              totalValue
            }
          })
        }
        return cryptoItem
      })
    )

    return NextResponse.json(updatedCrypto)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch crypto' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbol, name, amount, purchasePrice, totalAmount } = body

    // Get current price from CoinGecko
    const currentPrice = await getCryptoPrice(symbol)
    
    let finalAmount = amount
    let finalPurchasePrice = purchasePrice

    // If totalAmount is provided, calculate amount based on current price
    if (totalAmount && currentPrice > 0) {
      finalAmount = totalAmount / currentPrice
      finalPurchasePrice = currentPrice
    }

    const totalValue = finalAmount * (currentPrice || finalPurchasePrice)

    const crypto = await prisma.crypto.create({
      data: {
        symbol,
        name,
        amount: finalAmount,
        purchasePrice: finalPurchasePrice,
        currentPrice: currentPrice || finalPurchasePrice,
        totalValue: totalValue
      }
    })

    return NextResponse.json(crypto)
  } catch (error) {
    console.error('Error creating crypto:', error)
    return NextResponse.json({ error: 'Failed to create crypto' }, { status: 500 })
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
