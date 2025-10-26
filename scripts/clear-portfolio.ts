#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearPortfolio() {
  try {
    console.log('🧹 Starting portfolio cleanup...')
    
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('📊 Clearing portfolio history...')
    await prisma.portfolioHistory.deleteMany()
    
    console.log('💳 Clearing transactions...')
    await prisma.transaction.deleteMany()
    
    console.log('🏦 Clearing bank accounts...')
    await prisma.account.deleteMany()
    
    console.log('📈 Clearing investments...')
    await prisma.investment.deleteMany()
    
    console.log('₿ Clearing crypto assets...')
    await prisma.crypto.deleteMany()
    
    console.log('💵 Clearing cash entries...')
    await prisma.cash.deleteMany()
    
    console.log('✅ Portfolio cleared successfully!')
    console.log('📝 All data has been removed from the database.')
    console.log('🎯 You can now start fresh with a clean portfolio.')
    
  } catch (error) {
    console.error('❌ Error clearing portfolio:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
clearPortfolio()
