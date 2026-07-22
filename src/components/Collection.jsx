"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  async function handleAddToCart(productId) {
    if (!session) {
      router.push("/login");
      return;
    }

    setAddingId(productId);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (data.success) {
      setFeedback((prev) => ({ ...prev, [productId]: "Added!" }));
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [productId]: null }));
      }, 2000);
    } else {
      setFeedback((prev) => ({ ...prev, [productId]: "Failed" }));
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [productId]: null }));
      }, 2000);
    }

    setAddingId(null);
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-7xl font-[410] text-black mb-10">Collection</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-[2px_2px_10px_0_rgba(0,0,0,0.25),-2px_-2px_10px_0_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_20px_0_rgba(0,0,0,0.35),-4px_-4px_20px_0_rgba(0,0,0,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer"
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

              {/* Add to Cart button */}
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={addingId === product._id}
                className="mt-4 px-6 py-2 bg-black text-white text-sm font-semibold uppercase tracking-widest rounded-full opacity-100 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black border border-black disabled:opacity-50"
              >
                {addingId === product._id
                  ? "Adding..."
                  : feedback[product._id]
                    ? feedback[product._id]
                    : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
