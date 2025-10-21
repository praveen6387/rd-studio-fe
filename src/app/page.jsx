import Image from "next/image";
import PageLayout from "@/components/utils/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Capture Life's Beautiful Moments
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Professional photography services for weddings, portraits, events, and more
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              View Gallery
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Book Session
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate portraits to grand celebrations, we capture every moment with artistry and precision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wedding Photography</h3>
              <p className="text-gray-600">Capture your special day with our comprehensive wedding photography packages</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Portrait Sessions</h3>
              <p className="text-gray-600">Professional portraits for individuals, families, and corporate needs</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Coverage</h3>
              <p className="text-gray-600">From corporate events to birthday parties, we document your celebrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About RD Photo
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With over 10 years of experience in professional photography, we specialize in capturing authentic moments that tell your unique story. Our passion for photography drives us to create images that will be cherished for generations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intimate family portraits to grand wedding celebrations, we approach every shoot with creativity, professionalism, and attention to detail.
              </p>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Learn More About Us
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 