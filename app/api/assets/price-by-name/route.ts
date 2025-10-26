import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const type = searchParams.get('type') // 'stock' or 'crypto'

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing name or type' }, { status: 400 })
    }

    let price = 0

    if (type === 'investment') {
      // For stocks, we need to search by name first to get symbol
      const symbol = await getStockSymbolByName(name)
      if (symbol) {
        price = await getStockPrice(symbol)
      }
    } else if (type === 'crypto') {
      // For crypto, we can search by name to get the ID
      const cryptoId = await getCryptoIdByName(name)
      if (cryptoId) {
        price = await getCryptoPrice(cryptoId)
      }
    }

    return NextResponse.json({ price })
  } catch (error) {
    console.error('Error fetching price by name:', error)
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}

async function getStockSymbolByName(name: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=1&newsCount=0`
    )
    
    if (!response.ok) {
      throw new Error('Yahoo Finance API error')
    }
    
    const data = await response.json()
    const quote = data.quotes?.[0]
    
    return quote?.symbol || null
  } catch (error) {
    console.error('Error searching stock symbol:', error)
    return null
  }
}

async function getCryptoIdByName(name: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(name)}`
    )
    
    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }
    
    const data = await response.json()
    const coin = data.coins?.[0]
    
    return coin?.id || null
  } catch (error) {
    console.error('Error searching crypto ID:', error)
    return null
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

async function getCryptoPrice(cryptoId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(cryptoId)}&vs_currencies=eur`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }
    
    const data = await response.json()
    const price = data[cryptoId]?.eur
    
    return price || 0
  } catch (error) {
    console.error('Error fetching crypto price:', error)
    return 0
  }
}
