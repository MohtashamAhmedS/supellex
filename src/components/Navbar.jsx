"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left — Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center — Nav Links */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white hover:text-white/80 text-sm font-[450] tracking-wide transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Show admin link if admin */}
          {session?.user?.role === "admin" && (
            <li>
              <Link
                href="/admin"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-[450] tracking-wide transition-colors duration-200"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Right — Icons + Auth */}
        <div className="flex items-center gap-5">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white text-sm font-[450] hover:text-white/80 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white text-sm font-[450] hover:text-white/80 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link href="/cart" aria-label="Cart">
            <Image
              src="/icons/cart.png"
              alt="Cart"
              width={22}
              height={22}
              className="opacity-90 hover:opacity-100 transition-opacity invert"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
