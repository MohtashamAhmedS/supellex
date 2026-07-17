import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './db'
import User from '@/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()

        // Find user by email
        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('No account found with this email')

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )
        if (!isValid) throw new Error('Incorrect password')

        // Return user object (this gets stored in the session)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    // Add role and id to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Make role and id available in the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login', // redirect here when login is needed
  },

  secret: process.env.NEXTAUTH_SECRET,
}
