import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cash = await prisma.cash.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(cash)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cash' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, currency = 'USD', location } = body

    const cash = await prisma.cash.create({
      data: {
        name,
        amount,
        currency,
        location
      }
    })

    return NextResponse.json(cash)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create cash' }, { status: 500 })
  }
}
