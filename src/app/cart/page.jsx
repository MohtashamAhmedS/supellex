"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status]);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.data?.items || []);
    setLoading(false);
  }

  async function handleRemove(productId) {
    setRemovingId(productId);
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (data.success) fetchCart();
    setRemovingId(null);
  }

  async function handleQuantityChange(productId, quantity) {
    if (quantity < 1) {
      handleRemove(productId);
      return;
    }
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 0, setQuantity: quantity }),
    });
    fetchCart();
  }

  async function handleCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (data.success) {
      window.location.href = data.url;
    } else {
      alert(data.message || "Checkout failed");
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-black font-medium mb-10">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors duration-300 rounded-full"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-[2px_2px_10px_0_rgba(0,0,0,0.08),-2px_-2px_10px_0_rgba(0,0,0,0.08)]"
                >
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      ${item.product.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1,
                          )
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm text-gray-700 font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1,
                          )
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      disabled={removingId === item.product._id}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {removingId === item.product._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-[2px_2px_10px_0_rgba(0,0,0,0.08),-2px_-2px_10px_0_rgba(0,0,0,0.08)]">
                <h2 className="text-lg font-medium mb-6 text-black">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-black border border-black transition-colors duration-300"
                >
                  Checkout
                </button>

                <Link
                  href="/"
                  className="block text-center text-sm text-gray-400 hover:text-black transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
