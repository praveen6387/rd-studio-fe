import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/utils/Heading";
import { motion } from "framer-motion";

const OurService = () => {
  const services = [
    {
      key: "flipbook",
      title: "Digital Flipbook Creation",
      description:
        "We design high-quality, mobile-friendly digital flipbooks from your photos. Smooth page turns, optional music, and a beautiful viewer.",
      features: ["Smooth page-turn animations", "Optional music & motion", "Works on any device"],
      accent: "from-indigo-500/30 via-sky-400/20 to-transparent",
      iconBg: "from-indigo-500 to-sky-500",
      cta: { href: "/gallery", label: "Learn More" },
    },
    {
      key: "qr",
      title: "QR Code & Easy Sharing",
      description:
        "We generate a unique QR code for every flipbook so guests can scan and view instantly. Perfect for events and social sharing.",
      features: ["High‑resolution QR on cards", "One‑tap open in browser", "No app needed"],
      accent: "from-emerald-500/30 via-teal-400/20 to-transparent",
      iconBg: "from-emerald-500 to-teal-500",
      cta: { href: "/gallery", label: "Learn More" },
    },
    {
      key: "branding",
      title: "Custom Branding",
      description:
        "We host your flipbooks, provide branded links/landing, and assist with QR placement so your audience gets a seamless experience.",
      features: ["Custom branding on viewers and QR", "Fast delivery & priority support", "Secure, reliable hosting"],
      accent: "from-rose-500/30 via-pink-400/20 to-transparent",
      iconBg: "from-rose-500 to-pink-500",
      cta: { href: "/gallery", label: "Learn More" },
    },
  ];

  return (
    <div>
      <section className="py-20 bg-[#faf1fb] relative overflow-hidden">
        {/* Background Decorative Elements - neutral to match hero theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-gray-100 to-white rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Heading text="Our Services" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Flipbook & QR Sharing Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We turn your photos into elegant digital flipbooks and generate shareable QR codes for instant access on
              any device.
            </p>
          </div>

          {(() => {
            const renderIcon = (key) => {
              if (key === "flipbook") {
                return <Image src="/images/png/flipbook.png" alt="QR Code" width={100} height={100} />;
              }
              if (key === "qr") {
                return (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM18 14h3v3h-3v-3zM14 18h3v3h-3v-3z"
                    />
                  </svg>
                );
              }
              return (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v6H4zM4 14h16v6H4z" />
                </svg>
              );
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10  ">
                {services.map((s, idx) => (
                  <motion.div
                    key={s.key}
                    className="group relative"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.2 }}
                  >
                    <div className="relative rounded-2xl p-8 border border-white/60 bg-transparent backdrop-blur-3xl backdrop-saturate-150 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      <div
                        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
                      ></div>
                      <div className="relative mb-6">
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl ring-1 ring-white/40 bg-gradient-to-br ${s.iconBg} transition-all duration-300 group-hover:scale-110`}
                        >
                          {renderIcon(s.key)}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-white/60 to-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{s.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">{s.description}</p>
                        <ul className="space-y-2 mb-6">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-sky-400 rounded-full mr-3"></div>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={s.cta.href}
                          className="w-full bg-white/70 backdrop-blur-sm text-slate-800 py-3 px-6 rounded-xl font-semibold border border-slate-200 hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block text-center"
                        >
                          {s.cta.label}
                        </Link>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full inset-0 bg-black/5 rounded-2xl backdrop-saturate-150" />
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
};

export default OurService;
