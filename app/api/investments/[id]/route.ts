import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { symbol, name, shares, purchasePrice, dividends } = body

    const investment = await prisma.investment.update({
      where: { id: params.id },
      data: {
        symbol,
        name,
        shares,
        purchasePrice,
        dividends
      }
    })

    return NextResponse.json(investment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.investment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Investment deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete investment' }, { status: 500 })
  }
}
