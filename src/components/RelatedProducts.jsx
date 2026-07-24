"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RelatedProducts({ currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (data.success) {
        const others = data.data.filter((p) => p._id !== currentProductId);
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 3));
      }
      setLoading(false);
    }
    fetchRelated();
  }, [currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-[450] text-gray-900 mb-8">
        You might also like this
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group bg-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-[2px_2px_10px_0_rgba(0,0,0,0.25),-2px_-2px_10px_0_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_20px_0_rgba(0,0,0,0.35),-4px_-4px_20px_0_rgba(0,0,0,0.35)] hover:scale-105 transition-all duration-300"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
