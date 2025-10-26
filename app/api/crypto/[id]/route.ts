import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { symbol, name, amount, purchasePrice } = body

    const crypto = await prisma.crypto.update({
      where: { id: params.id },
      data: {
        symbol,
        name,
        amount,
        purchasePrice
      }
    })

    return NextResponse.json(crypto)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update crypto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.crypto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Crypto deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete crypto' }, { status: 500 })
  }
}
