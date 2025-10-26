import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.portfolioHistory.deleteMany()
  await prisma.cash.deleteMany()
  await prisma.crypto.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.account.deleteMany()

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'Main Checking',
        bank: 'Deutsche Bank',
        balance: 4500.00,
        currency: 'EUR'
      }
    }),
    prisma.account.create({
      data: {
        name: 'Savings Account',
        bank: 'Commerzbank',
        balance: 13500.00,
        currency: 'EUR'
      }
    }),
    prisma.account.create({
      data: {
        name: 'Business Account',
        bank: 'Sparkasse',
        balance: 22500.00,
        currency: 'EUR'
      }
    })
  ])

  // Create investments
  const investments = await Promise.all([
    prisma.investment.create({
      data: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 10,
        purchasePrice: 135.00,
        dividends: 45.00
      }
    }),
    prisma.investment.create({
      data: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 5,
        purchasePrice: 270.00,
        dividends: 22.50
      }
    }),
    prisma.investment.create({
      data: {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        shares: 20,
        purchasePrice: 360.00,
        dividends: 90.00
      }
    })
  ])

  // Create crypto
  const crypto = await Promise.all([
    prisma.crypto.create({
      data: {
        symbol: 'bitcoin',
        name: 'Bitcoin',
        amount: 0.5,
        purchasePrice: 27000.00
      }
    }),
    prisma.crypto.create({
      data: {
        symbol: 'ethereum',
        name: 'Ethereum',
        amount: 2.0,
        purchasePrice: 1800.00
      }
    }),
    prisma.crypto.create({
      data: {
        symbol: 'cardano',
        name: 'Cardano',
        amount: 1000,
        purchasePrice: 0.45
      }
    })
  ])

  // Create cash
  const cash = await Promise.all([
    prisma.cash.create({
      data: {
        name: 'Emergency Fund',
        amount: 1800.00,
        currency: 'EUR'
      }
    }),
    prisma.cash.create({
      data: {
        name: 'Travel Money',
        amount: 450.00,
        currency: 'EUR'
      }
    })
  ])

  // Create portfolio history (simulate last 7 days)
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate some variation in portfolio value
    const baseValue = 45000
    const variation = (Math.random() - 0.5) * 1800
    const totalValue = baseValue + variation

    await prisma.portfolioHistory.create({
      data: {
        totalValue,
        accountsValue: 40500 + (variation * 0.3),
        investmentsValue: 2700 + (variation * 0.4),
        cryptoValue: 1350 + (variation * 0.2),
        cashValue: 450 + (variation * 0.1),
        date
      }
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${accounts.length} accounts`)
  console.log(`Created ${investments.length} investments`)
  console.log(`Created ${crypto.length} crypto assets`)
  console.log(`Created ${cash.length} cash entries`)
  console.log('Created 7 days of portfolio history')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
