import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    // Check all fields are provided
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 400 },
      )
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json(
      { message: 'Account created successfully', userId: user._id },
      { status: 201 },
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    )
  }
}
