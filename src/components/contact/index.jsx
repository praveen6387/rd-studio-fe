"use client";
import PageLayout from "@/components/utils/PageLayout";
import Heading from "@/components/utils/Heading";
import { motion } from "framer-motion";

const ContactIndex = () => {
  return (
    <PageLayout>
      {/* Contact Header (light theme, consistent with About/Gallery) */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 py-16 md:py-20 overflow-hidden">
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
            <Heading text="Contact Us" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Let’s Create Something Beautiful Together
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Share your project details or questions with us. We’ll guide you through our simple flipbook process,
              timelines and pricing, and help you get a beautiful, sharable result.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-14 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12">
            {/* Contact Form (top) */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Form Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-indigo-700 to-gray-900 bg-clip-text text-transparent">
                        Send us a Message
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm">We'd love to hear from you</p>
                    </div>
                  </div>

                  <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 resize-none"
                        placeholder="Tell us about your photography needs..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information (bottom) */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Info Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 bg-clip-text text-transparent">
                        Get in Touch
                      </h2>
                      <p className="text-gray-600 mt-1">We're here to help</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="group">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        Contact Information
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 rounded-xl hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group/item">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Email</p>
                            <p className="text-gray-600">rdphotography570@gmail.com</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group/item">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Phone</p>
                            <p className="text-gray-600">+91 9792098570</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-rose-50/50 to-pink-50/30 rounded-xl hover:from-rose-50 hover:to-pink-50 transition-all duration-300 group/item">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Address</p>
                            <p className="text-gray-600">Basti, UP, India</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        Business Hours
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-xl p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                            <span className="font-medium text-gray-900">Monday - Friday</span>
                            <span className="text-blue-600 font-semibold">10:00 AM - 8:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                            <span className="font-medium text-gray-900">Saturday</span>
                            <span className="text-blue-600 font-semibold">10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-gray-900">Sunday</span>
                            <span className="text-amber-600 font-semibold">By appointment only</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                        Follow Us
                      </h3>
                      <div className="flex space-x-4">
                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/rdphoto_570?igsh=MTNjZXpkbzc1NTRyZw=="
                          target="_blank"
                          className="group w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center hover:from-pink-400 hover:via-purple-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                        {/* WhatsApp */}
                        <a
                          href="https://wa.me/919792098570"
                          target="_blank"
                          className="group w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.52 3.48A11.86 11.86 0 0012 .125C5.514.125.25 5.389.25 11.875c0 2.09.546 4.144 1.58 5.95L.01 24l6.33-1.654a11.83 11.83 0 005.66 1.444h.005c6.485 0 11.75-5.265 11.75-11.75 0-3.145-1.226-6.1-3.455-8.56zm-8.67 19.17h-.004a9.84 9.84 0 01-5.013-1.377l-.36-.214-3.757.982 1.003-3.662-.234-.376a9.85 9.85 0 01-1.58-5.4c0-5.44 4.427-9.866 9.867-9.866a9.81 9.81 0 016.987 2.892 9.78 9.78 0 012.883 6.974c0 5.44-4.427 9.866-9.883 9.866zm5.433-7.356c-.297-.149-1.757-.867-2.029-.966-.272-.099-.47-.148-.668.149-.198.297-.766.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.391-1.477-.884-.79-1.48-1.764-1.653-2.06-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.668-1.61-.915-2.207-.241-.579-.487-.5-.668-.51-.173-.009-.372-.011-.571-.011-.198 0-.521.074-.795.372-.272.297-1.041 1.017-1.041 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.077 4.487.71.306 1.264.489 1.695.626.712.226 1.36.194 1.872.118.571-.085 1.757-.718 2.004-1.41.247-.694.247-1.287.173-1.41-.074-.124-.272-.198-.57-.347z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactIndex;
