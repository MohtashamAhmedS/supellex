"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      {loading ? (
        <p className="text-gray-400 text-sm">Confirming your order...</p>
      ) : (
        <>
          <h1 className="text-4xl font-medium text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 max-w-md">
            Thank you for your purchase. Your order is being processed and
            you'll receive updates on its status soon.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-black border border-black transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </>
      )}
    </div>
  );
}
