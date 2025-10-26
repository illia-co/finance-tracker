import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const history = await prisma.portfolioHistory.findMany({
      orderBy: { date: 'asc' },
      take: 30 // Last 30 days
    })

    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio history' }, { status: 500 })
  }
}
