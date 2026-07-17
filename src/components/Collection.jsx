const PRODUCTS = [
  {
    id: 1,
    name: 'Amarillo Ranch Bench',
    price: 300,
    image: '/products/amarillo-bench.png',
  },
  {
    id: 2,
    name: 'Floral Chair',
    price: 300,
    image: '/products/floral-chair.png',
  },
  {
    id: 3,
    name: 'Floral Pattern Sofa',
    price: 300,
    image: '/products/floral-sofa.png',
  },
  {
    id: 4,
    name: 'Artist Cupboard',
    price: 300,
    image: '/products/artist-cupboard.png',
  },
  {
    id: 5,
    name: 'Vintage Pattern Drawer',
    price: 300,
    image: '/products/vintage-drawer.png',
  },
  {
    id: 6,
    name: 'Floral Side Table',
    price: 300,
    image: '/products/floral-side-table.png',
  },
]

export default function Collection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-7xl font-[410] text-black  mb-10">Collection</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-[2px_2px_10px_0_rgba(0,0,0,0.25),-2px_-2px_10px_0_rgba(0,0,0,0.25)]"
          >
            <div className="w-full h-48 flex items-center justify-center mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-base text-gray-900 font-medium">
              {product.name}
            </p>
            <p className="text-base text-gray-900 mt-1 font-[410]">
              ${product.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
