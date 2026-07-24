"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) setProduct(data.data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!session) {
      router.push("/login");
      return;
    }

    setAdding(true);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity }),
    });

    const data = await res.json();

    if (data.success) {
      setFeedback("Added to cart!");
    } else {
      setFeedback("Failed to add");
    }

    setAdding(false);
    setTimeout(() => setFeedback(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Product not found</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-black border border-black transition-colors duration-300"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-4">
        <p className="text-sm text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          {" / "}
          <span className="text-gray-800">{product.name}</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left — Image */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-100 rounded-2xl p-16 flex items-center justify-center h-[600px] shadow-[2px_2px_10px_0_rgba(0,0,0,0.08),-2px_-2px_10px_0_rgba(0,0,0,0.08)]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Right — Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 pt-4">
            {/* Category */}
            {product.category && (
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                {product.category}
              </p>
            )}

            {/* Name */}
            <h1 className="text-4xl font-medium text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl font-[450] text-gray-900">
              ${product.price}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Description */}
            <p className="text-gray-500 leading-relaxed">
              {product.description ||
                "A beautifully crafted piece designed to elevate any space. Made with quality materials and attention to detail."}
            </p>

            {/* Stock */}
            <p
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  −
                </button>
                <span className="text-base font-medium w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 bg-black text-white py-3 text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-black border border-black transition-colors duration-300 disabled:opacity-50"
              >
                {adding
                  ? "Adding..."
                  : feedback
                    ? feedback
                    : product.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
              </button>

              <Link
                href="/"
                className="flex-1 text-center bg-white text-black py-3 text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-black hover:text-white border border-black transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product._id} />
    </div>
  );
}
