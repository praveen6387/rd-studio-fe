"use client";
import { useState, useEffect } from "react";
import PageLayout from "@/components/utils/PageLayout";
import Heading from "@/components/utils/Heading";
import { getAllCollections } from "@/data/photoCollections";
import { motion } from "framer-motion";

const GalleryIndex = () => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      image_url: "https://picsum.photos/800/600?random=1&wedding",
      title: "Crypto",
    },
    {
      id: 2,
      image_url: "https://picsum.photos/800/600?random=2&wedding",
    },
    {
      id: 3,
      image_url: "https://picsum.photos/800/600?random=3&wedding",
      title: "Crypto",
    },
    {
      id: 4,
      image_url: "https://picsum.photos/800/600?random=4&wedding",
      title: "Crypto",
    },
    {
      id: 5,
      image_url: "https://picsum.photos/800/600?random=5&wedding",
      title: "Crypto",
    },
    {
      id: 6,
      image_url: "https://picsum.photos/800/600?random=6&wedding",
      title: "Crypto",
    },
    {
      id: 7,
      image_url: "https://picsum.photos/800/600?random=7&wedding",
      title: "Crypto",
    },
    {
      id: 8,
      image_url: "https://picsum.photos/800/600?random=8&wedding",
      title: "Crypto",
    },
    {
      id: 9,
      image_url: "https://picsum.photos/800/600?random=9&wedding",
      title: "Crypto",
    },
    {
      id: 10,
      image_url: "https://picsum.photos/800/600?random=10&wedding",
      title: "Crypto",
    },
    {
      id: 11,
      image_url: "https://picsum.photos/800/600?random=11&wedding",
      title: "Crypto",
    },
    {
      id: 12,
      image_url: "https://picsum.photos/800/600?random=12&wedding",
      title: "Crypto",
    },
    {
      id: 13,
      image_url: "https://picsum.photos/800/600?random=13&wedding",
      title: "Crypto",
    },
  ]);

  return (
    <PageLayout>
      {/* Flipbook Gallery Header */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 py-16 overflow-hidden">
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
            <Heading text="Gallery" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">View Our Gallery</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore highlights of our work, learn how our flipbook process works from upload to QR sharing, and
              browse sample projects that show the final viewing experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 auto-rows-[180px] md:auto-rows-[200px]">
            {collections.map((collection, idx) => {
              const span = idx === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1";
              const src = collection.image_url || `https://picsum.photos/800/600?wedding&random=${collection.id}`;
              return (
                <motion.div
                  key={collection.id}
                  className={`relative group rounded-xl overflow-hidden bg-gray-100 ${span}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-500 pointer-events-none z-0"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none z-20"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image-only gallery: modal removed */}
    </PageLayout>
  );
};

export default GalleryIndex;
