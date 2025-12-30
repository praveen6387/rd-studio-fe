import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/utils/Heading";

const ShortAbout = () => {
  return (
    <div>
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-40 h-40 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-2xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="relative">
              {/* Badge - glassy */}
              <Heading text="About Us" />

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Crafting Digital Flipbooks with Effortless Sharing
              </h2>

              <div className="space-y-6 mb-8">
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We transform your photos into elegant digital flipbooks that work seamlessly on all devices. Share
                    them instantly using smart <span className="font-semibold text-emerald-600">QR codes</span> and
                    give your guests a premium, branded viewing experience.
                  </p>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our flipbooks feature smooth page-turn effects, optional background music, and full mobile support.
                    With high-quality QR codes, one-tap browser access (no app needed), custom branding, secure
                    hosting, and priority support, sharing memories becomes effortless and professional.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/gallery"
                className="group bg-gradient-to-r from-indigo-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
              >
                <span className="flex items-center gap-2">
                  Explore Samples
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Image Side */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative group">
                <div className="relative aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden">
                  <Image
                    src="/images/png/shortAbout.png"
                    alt="About RD Studio"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/20 to-sky-200/20"></div>

                  {/* Floating Elements */}
                  <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full opacity-80 animate-pulse"></div>
                  <div
                    className="absolute bottom-6 left-6 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-80 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-4 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "2s" }}
                  ></div>
                </div>

                {/* Decorative Frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-sky-200 rounded-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h10l3 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Flipbooks</div>
                    <div className="text-xs text-gray-600">Elegant & mobile‑friendly</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM18 14h3v3h-3v-3zM14 18h3v3h-3v-3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">QR Sharing</div>
                    <div className="text-xs text-gray-600">Scan & view instantly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShortAbout;
