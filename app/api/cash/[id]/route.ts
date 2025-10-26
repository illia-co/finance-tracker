import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, amount, currency } = body

    const cash = await prisma.cash.update({
      where: { id: params.id },
      data: {
        name,
        amount,
        currency
      }
    })

    return NextResponse.json(cash)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cash' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cash.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Cash deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete cash' }, { status: 500 })
  }
}
