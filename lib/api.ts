import axios from 'axios'

// Yahoo Finance API
export const getStockPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    )
    const data = response.data
    if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      return data.chart.result[0].meta.regularMarketPrice
    }
    return null
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)
    return null
  }
}

// CoinGecko API
export const getCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    )
    const data = response.data
    if (data[symbol]?.usd) {
      return data[symbol].usd
    }
    return null
  } catch (error) {
    console.error(`Error fetching crypto price for ${symbol}:`, error)
    return null
  }
}

// Get multiple stock prices
export const getMultipleStockPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {}
  
  await Promise.all(
    symbols.map(async (symbol) => {
      const price = await getStockPrice(symbol)
      if (price) {
        prices[symbol] = price
      }
    })
  )
  
  return prices
}

// Get multiple crypto prices
export const getMultipleCryptoPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {}
  
  await Promise.all(
    symbols.map(async (symbol) => {
      const price = await getCryptoPrice(symbol)
      if (price) {
        prices[symbol] = price
      }
    })
  )
  
  return prices
}
