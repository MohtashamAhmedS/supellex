import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  // If not logged in or not admin → redirect away
  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col py-10 px-6 gap-6 fixed h-full">
        <h1 className="text-xl font-semibold tracking-wide mb-4">
          Supellex Admin
        </h1>
        <nav className="flex flex-col gap-3">
          <Link
            href="/admin"
            className="text-white/70 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="text-white/70 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="text-white/70 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-10">{children}</main>
    </div>
  )
}
