import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/bg-image.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-tightest max-w-xl  mx-auto">
          Sophisticated Spaces Begin Here
        </h1>

        <p className="text-white/70 text-lg mb-10 max-w-md mx-auto">
          Modern pieces built for simplicity, functionality, and everyday
          elegance.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-black px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-500 rounded-full"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
