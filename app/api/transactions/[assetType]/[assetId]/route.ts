import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { assetType: string; assetId: string } }
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        assetType: params.assetType,
        assetId: params.assetId
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
