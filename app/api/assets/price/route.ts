import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const type = searchParams.get('type') // 'stock' or 'crypto'

    if (!symbol || !type) {
      return NextResponse.json({ error: 'Missing symbol or type' }, { status: 400 })
    }

    let price = 0

    if (type === 'stock') {
      price = await getStockPrice(symbol)
    } else if (type === 'crypto') {
      price = await getCryptoPrice(symbol)
    }

    return NextResponse.json({ price })
  } catch (error) {
    console.error('Error fetching price:', error)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}

async function getStockPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    )
    
    if (!response.ok) {
      throw new Error('Yahoo Finance API error')
    }
    
    const data = await response.json()
    const result = data.chart?.result?.[0]
    
    if (!result || !result.meta) {
      throw new Error('Invalid stock data')
    }
    
    return result.meta.regularMarketPrice || 0
  } catch (error) {
    console.error('Error fetching stock price:', error)
    return 0
  }
}

async function getCryptoPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=eur`
    )
    
    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }
    
    const data = await response.json()
    const price = data[symbol]?.eur
    
    return price || 0
  } catch (error) {
    console.error('Error fetching crypto price:', error)
    return 0
  }
}
