import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'stocks' or 'crypto'

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    let results = []

    if (type === 'stocks') {
      // Search stocks using Yahoo Finance
      results = await searchStocks(query)
    } else if (type === 'crypto') {
      // Search crypto using CoinGecko
      results = await searchCrypto(query)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching assets:', error)
    return NextResponse.json({ error: 'Failed to search assets' }, { status: 500 })
  }
}

async function searchStocks(query: string) {
  try {
    // Using Yahoo Finance API (free tier)
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`
    )
    
    if (!response.ok) {
      throw new Error('Yahoo Finance API error')
    }
    
    const data = await response.json()
    
    return data.quotes?.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.longname || quote.shortname,
      exchange: quote.exchange,
      type: 'stock'
    })) || []
  } catch (error) {
    console.error('Error searching stocks:', error)
    return []
  }
}

async function searchCrypto(query: string) {
  try {
    // Using CoinGecko API (free tier)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }
    
    const data = await response.json()
    
    return data.coins?.slice(0, 10).map((coin: any) => ({
      symbol: coin.id,
      name: coin.name,
      exchange: 'CoinGecko',
      type: 'crypto'
    })) || []
  } catch (error) {
    console.error('Error searching crypto:', error)
    return []
  }
}
