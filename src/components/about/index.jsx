"use client";

import PageLayout from "@/components/utils/PageLayout";
import Image from "next/image";
import Heading from "@/components/utils/Heading";
import { motion } from "framer-motion";

const AboutIndex = () => {
  return (
    <PageLayout>
      {/* About Header */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Heading text="About Us" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Building Beautiful Digital Flipbooks</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We’re a new studio focused on crafting elegant, sharable flipbooks with QR access and a premium, minimal
              experience. RD Studio is our current working name as we shape the brand.
            </p>
          </motion.div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-12 left-12 w-28 h-28 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-12 right-12 w-36 h-36 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-60"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <Heading text="How It Works" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Create, Share, Celebrate</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A simple flow designed for speed and clarity—perfect for studios starting out.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            <motion.div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold flex items-center justify-center mb-4">
                1
              </div>
              <div className="font-semibold text-gray-900 mb-1">Start a Flipbook</div>
              <div className="text-gray-600 text-sm">Set your studio name and create a new project.</div>
            </motion.div>
            <motion.div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold flex items-center justify-center mb-4">
                2
              </div>
              <div className="font-semibold text-gray-900 mb-1">Upload & Arrange</div>
              <div className="text-gray-600 text-sm">Bulk‑upload photos and re‑order pages with drag & drop.</div>
            </motion.div>
            <motion.div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold flex items-center justify-center mb-4">
                3
              </div>
              <div className="font-semibold text-gray-900 mb-1">Preview & Polish</div>
              <div className="text-gray-600 text-sm">Check the page‑turn effect, choose cover, optional music.</div>
            </motion.div>
            <motion.div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center mb-4">
                4
              </div>
              <div className="font-semibold text-gray-900 mb-1">Share with QR</div>
              <div className="text-gray-600 text-sm">
                Publish to get a QR code and link—share on WhatsApp/Instagram.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-2">
              <Heading text="Our Story" />

              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Starting Small, Crafting with Care
              </motion.h2>

              <div className="space-y-6 mb-8">
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  We’re at the beginning of our journey. Our focus is clear: create beautiful digital flipbooks that
                  are simple to view, easy to share, and delightful to revisit.
                </motion.p>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  We pair thoughtful design with lightweight tech like QR access, so friends and family can open your
                  flipbook in one tap—no apps required—while keeping the look minimal and professional.
                </motion.p>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  Create your first flipbook in minutes: pick a studio name, upload your images in bulk, and arrange
                  pages exactly how you want with simple drag‑and‑drop. Preview instantly as you go.
                </motion.p>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  When you publish, a QR code and share link are generated automatically—perfect for printing on cards
                  or sharing on Instagram and WhatsApp. Viewers just scan or tap and your story opens immediately.
                </motion.p>
                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  We’re actively listening. A simple feedback prompt helps us improve fast—so early creators shape the
                  product with us. Our goal is a premium experience that stays simple, fast, and reliable.
                </motion.p>
              </div>

              {/* Early-stage: stats intentionally omitted */}
            </div>

            <motion.div
              className="relative order-1 lg:order-1"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative group">
                <div className="relative aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden">
                  <Image src="/about.png" alt="About RD Studio" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/20 to-sky-200/20"></div>
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
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-sky-200 rounded-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>

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
                        d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM18 14h3v3h-3v-3zM14 18h3v3h-3v-3z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">QR Sharing</div>
                    <div className="text-xs text-gray-600">Scan & view instantly</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm font-semibold rounded-full mb-6 shadow-lg">
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Build and Share Flipbooks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create flipbooks, customize studio details, upload and re‑order images, and share instantly with
              auto‑generated QR codes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Create Flipbook */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-sky-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h10l3 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                      />
                    </svg>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-sky-300 to-indigo-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    Create Flipbooks
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Start a flipbook, rename your studio, upload images in bulk, and re‑order pages with simple drag &
                    drop.
                  </p>
                </div>
              </div>
            </div>

            {/* QR & Sharing */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM18 14h3v3h-3v-3zM14 18h3v3h-3v-3z"
                      />
                    </svg>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    QR Codes & Sharing
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Each flipbook gets an auto‑generated QR code and share link so viewers can open it in one tap—no
                    app needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Social & Feedback */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.5 2h9A3.5 3.5 0 0 1 20 5.5v13A3.5 3.5 0 0 1 16.5 22h-9A3.5 3.5 0 0 1 4 18.5v-13A3.5 3.5 0 0 1 7.5 2zm2.25 6.5h-1.5v7h1.5v-7zm3.25 0h-1.5v7h1.5v-7zm3.25 0h-1.5v7h1.5v-7z" />
                    </svg>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Social Links & Feedback
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Add Instagram and WhatsApp for your studio to grow connections, and collect feedback to improve the
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutIndex;
