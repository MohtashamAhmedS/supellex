'use client'
import { useEffect, useState } from 'react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data.data || [])
    setLoading(false)
  }

  async function handleAdd() {
    setAdding(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }),
    })
    const data = await res.json()
    if (data.success) {
      setForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: '',
      })
      setShowForm(false)
      fetchProducts()
    } else {
      alert(data.message)
    }
    setAdding(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) fetchProducts()
    else alert(data.message)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-black/80 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['name', 'description', 'price', 'image', 'category', 'stock'].map(
            (field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 capitalize">
                  {field}
                </label>
                <input
                  type={
                    field === 'price' || field === 'stock' ? 'number' : 'text'
                  }
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="border text-black border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-colors"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              </div>
            ),
          )}
          <div className="sm:col-span-2">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-black/80 transition-colors disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm">No products found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Image</th>
                <th className="pb-3">Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b last:border-0">
                  <td className="py-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    )}
                  </td>
                  <td className="py-3 font-medium">{product.name}</td>
                  <td className="py-3 text-gray-500">
                    {product.category || '—'}
                  </td>
                  <td className="py-3">${product.price.toFixed(2)}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
