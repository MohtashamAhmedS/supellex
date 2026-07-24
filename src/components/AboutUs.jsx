export default function AboutUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="about">
      <h2 className="text-4xl font-medium mb-10 text-black">About Us</h2>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Left — Image */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <img
            src="/about-us.jpg"
            alt="About our brand"
            className="w-full h-[650px] object-cover rounded-md"
          />
        </div>

        {/* Right — Text */}
        <div className="w-full md:w-3/5 space-y-6 text-gray-700 leading-relaxed text-[18px]">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since 1966, when designers at Letraset and James Mosley, the
            librarian at St Bride Printing Library, took a 1914 Cicero
            translation and scrambled it to make dummy text for Letraset's Body
            Type sheets.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since 1966, when designers at Letraset and James Mosley, the
            librarian at St Bride Printing Library, took a 1914 Cicero
            translation and scrambled it to make dummy text for Letraset's Body
            Type sheets.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since 1966, when designers at Letraset and James Mosley, the
            librarian at St Bride Printing Library, took a 1914 Cicero
            translation and scrambled it to make dummy text for Letraset's Body
            Type sheets.
          </p>
        </div>
      </div>
    </section>
  );
}
