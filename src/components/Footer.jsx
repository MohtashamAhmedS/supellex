export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Left — Brand, Address, Contact, Social */}
        <div className="flex flex-col gap-8">
          {/* Brand & Address */}
          <div>
            <p className="text-sm text-white/60 mb-1">My Store</p>
            <h2 className="text-3xl font-medium">Address XYZ, 123, ZMC</h2>
          </div>

          {/* Contact & Social */}
          <div className="flex gap-16">
            {/* Contact */}
            <div>
              <p className="text-base font-medium mb-3">Contact</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <img
                    src="/icons/phone.svg"
                    alt="Phone"
                    className="w-4 h-4 "
                  />
                  123 4556 7890
                </li>
                <li className="flex items-center gap-2">
                  <img src="/icons/mail.svg" alt="Email" className="w-4 h-4 " />
                  abxd@gmail.com
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <p className="text-base font-medium mb-3">Social</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <img
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    className="w-4 h-4 "
                  />
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    #mystore
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <img
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    className="w-4 h-4 "
                  />
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    mystore
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right — Google Map */}
        <div className="w-full md:w-[380px] h-[220px] rounded-xl overflow-hidden flex-shrink-0">
          <iframe
            title="Store Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.3!2d67.0099!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjUiTiA2N8KwMDAnMzUuNiJF!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-sm text-white/50">Copyright@mystore</p>
      </div>
    </footer>
  )
}
