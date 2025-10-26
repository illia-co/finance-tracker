#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDemoData() {
  try {
    console.log('🎭 Creating demo portfolio data...')
    
    // Create bank accounts
    console.log('🏦 Creating bank accounts...')
    const accounts = await Promise.all([
      prisma.account.create({
        data: {
          name: 'Deutsche Bank Main',
          bank: 'Deutsche Bank',
          balance: 25000.00,
          currency: 'EUR'
        }
      }),
      prisma.account.create({
        data: {
          name: 'Commerzbank Savings',
          bank: 'Commerzbank',
          balance: 15000.00,
          currency: 'EUR'
        }
      }),
      prisma.account.create({
        data: {
          name: 'N26 Business',
          bank: 'N26',
          balance: 8500.00,
          currency: 'EUR'
        }
      }),
      prisma.account.create({
        data: {
          name: 'HSBC International',
          bank: 'HSBC',
          balance: 12000.00,
          currency: 'EUR'
        }
      })
    ])

    // Create investments (stocks)
    console.log('📈 Creating investments...')
    const investments = await Promise.all([
      prisma.investment.create({
        data: {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 25,
          purchasePrice: 150.00,
          currentPrice: 155.00,
          totalValue: 3875.00,
          dividends: 125.00
        }
      }),
      prisma.investment.create({
        data: {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 15,
          purchasePrice: 300.00,
          currentPrice: 310.00,
          totalValue: 4650.00,
          dividends: 75.00
        }
      }),
      prisma.investment.create({
        data: {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          shares: 8,
          purchasePrice: 200.00,
          currentPrice: 220.00,
          totalValue: 1760.00,
          dividends: 0.00
        }
      }),
      prisma.investment.create({
        data: {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          shares: 12,
          purchasePrice: 120.00,
          currentPrice: 125.00,
          totalValue: 1500.00,
          dividends: 0.00
        }
      }),
      prisma.investment.create({
        data: {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          shares: 6,
          purchasePrice: 400.00,
          currentPrice: 450.00,
          totalValue: 2700.00,
          dividends: 0.00
        }
      })
    ])

    // Create crypto assets
    console.log('₿ Creating crypto assets...')
    const crypto = await Promise.all([
      prisma.crypto.create({
        data: {
          symbol: 'bitcoin',
          name: 'Bitcoin',
          amount: 0.5,
          purchasePrice: 35000.00,
          currentPrice: 42000.00,
          totalValue: 21000.00
        }
      }),
      prisma.crypto.create({
        data: {
          symbol: 'ethereum',
          name: 'Ethereum',
          amount: 2.0,
          purchasePrice: 2000.00,
          currentPrice: 2500.00,
          totalValue: 5000.00
        }
      }),
      prisma.crypto.create({
        data: {
          symbol: 'cardano',
          name: 'Cardano',
          amount: 1000,
          purchasePrice: 0.45,
          currentPrice: 0.50,
          totalValue: 500.00
        }
      }),
      prisma.crypto.create({
        data: {
          symbol: 'solana',
          name: 'Solana',
          amount: 50,
          purchasePrice: 80.00,
          currentPrice: 90.00,
          totalValue: 4500.00
        }
      })
    ])

    // Create cash entries
    console.log('💵 Creating cash entries...')
    const cash = await Promise.all([
      prisma.cash.create({
        data: {
          name: 'Home Safe',
          amount: 2000.00,
          currency: 'EUR'
        }
      }),
      prisma.cash.create({
        data: {
          name: 'Emergency Fund',
          amount: 5000.00,
          currency: 'EUR'
        }
      }),
      prisma.cash.create({
        data: {
          name: 'Travel Cash',
          amount: 500.00,
          currency: 'EUR'
        }
      })
    ])

    // Create some sample transactions
    console.log('📝 Creating sample transactions...')
    const transactions = await Promise.all([
      // Bank account transactions
      prisma.transaction.create({
        data: {
          type: 'deposit',
          assetType: 'account',
          assetId: accounts[0].id,
          amount: 5000.00,
          description: 'Salary deposit',
          date: new Date('2024-01-15')
        }
      }),
      prisma.transaction.create({
        data: {
          type: 'withdrawal',
          assetType: 'account',
          assetId: accounts[0].id,
          amount: 1000.00,
          description: 'Monthly expenses',
          date: new Date('2024-01-20')
        }
      }),
      // Investment transactions
      prisma.transaction.create({
        data: {
          type: 'buy',
          assetType: 'investment',
          assetId: investments[0].id,
          amount: 150.00,
          price: 150.00,
          quantity: 1,
          description: 'Bought Apple stock',
          date: new Date('2024-01-10')
        }
      }),
      prisma.transaction.create({
        data: {
          type: 'dividend',
          assetType: 'investment',
          assetId: investments[0].id,
          amount: 5.00,
          description: 'Apple dividend payment',
          date: new Date('2024-01-25')
        }
      }),
      // Crypto transactions
      prisma.transaction.create({
        data: {
          type: 'buy',
          assetType: 'crypto',
          assetId: crypto[0].id,
          amount: 35000.00,
          price: 35000.00,
          quantity: 0.1,
          description: 'Bought Bitcoin',
          date: new Date('2024-01-05')
        }
      }),
      // Cash transactions
      prisma.transaction.create({
        data: {
          type: 'deposit',
          assetType: 'cash',
          assetId: cash[0].id,
          amount: 1000.00,
          description: 'Added cash to safe',
          date: new Date('2024-01-12')
        }
      })
    ])

    // Create portfolio history entries for the last 30 days
    console.log('📊 Creating portfolio history...')
    const today = new Date()
    const historyEntries = []
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Simulate portfolio growth over time
      const baseValue = 75000
      const growthFactor = 1 + (Math.random() - 0.5) * 0.02 // ±1% daily variation
      const totalValue = baseValue * Math.pow(growthFactor, 30 - i)
      
      historyEntries.push({
        totalValue: totalValue,
        accountsValue: 48500 * Math.pow(growthFactor, 30 - i),
        investmentsValue: 14485 * Math.pow(growthFactor, 30 - i),
        cryptoValue: 30500 * Math.pow(growthFactor, 30 - i),
        cashValue: 7500,
        date: date
      })
    }
    
    await prisma.portfolioHistory.createMany({
      data: historyEntries
    })

    console.log('✅ Demo data created successfully!')
    console.log('📊 Portfolio Summary:')
    console.log(`   🏦 Bank Accounts: €${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}`)
    console.log(`   📈 Investments: €${investments.reduce((sum, inv) => sum + inv.totalValue, 0).toLocaleString()}`)
    console.log(`   ₿ Crypto: €${crypto.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}`)
    console.log(`   💵 Cash: €${cash.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}`)
    console.log(`   📝 Transactions: ${transactions.length}`)
    console.log(`   📊 History entries: ${historyEntries.length}`)
    console.log('')
    console.log('🎯 Your demo portfolio is ready!')
    console.log('💡 You can now test all features with realistic data.')

  } catch (error) {
    console.error('❌ Error creating demo data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the demo data creation
createDemoData()
