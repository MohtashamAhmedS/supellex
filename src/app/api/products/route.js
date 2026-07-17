import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'

// GET all products
export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({ isActive: true })
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}

// POST — add new product (admin only)
export async function POST(req) {
  try {
    await connectDB()

    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/authOptions')
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await req.json()
    const { name, description, price, image, category, stock } = body

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Name and price are required' },
        { status: 400 },
      )
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 },
    )
  }
}
