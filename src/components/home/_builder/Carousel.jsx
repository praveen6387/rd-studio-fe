import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

const HomeCarousel = () => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // rotate every 3 seconds
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative">
      {/* Static left-side content (does not slide) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center">
        <div className="pointer-events-auto px-10 sm:px-28 max-w-4xl">
          <div className=" rounded-2xl sm:rounded-3xl p-4 sm:p-6 ">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black bg-clip-text leading-tight">
              {/* Flipbook for Your Wedding Memories */}
              Made for Your Special Moments
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-black font-light max-w-3xl mx-auto leading-relaxed">
              {/* We turn your wedding photos into a beautiful digital flipbook you can view and share anytime. */}We
              create professionally designed digital flipbooks from wedding images, perfect for viewing and sharing
              anytime.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/my-gallery"
                  className="group bg-gray-700/10 backdrop-blur-sm text-gray-700 px-10 py-4 rounded-full font-semibold border border-gray-700/30 hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center gap-2">
                    View Samples
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="group border-2 border-gray-700 text-gray-700 px-10 py-4 rounded-full font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    Book Session
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="h-[calc(100vh-60px)]">
          {/* Slide 1: Flipbook promo */}
          <CarouselItem>
            <div className="relative flex h-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat">
                <Image src="/images/png/Cros1.png" alt="Flipbook Promo" fill priority className="object-cover " />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Existing hero */}
          <CarouselItem>
            <div className="relative flex h-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat">
                <Image src="/images/png/Cors4.png" alt="Flipbook Promo" fill priority className="object-cover " />
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative flex h-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat">
                <Image src="/images/png/Cors3.png" alt="Flipbook Promo" fill priority className="object-cover " />
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="bg-white/20 border-white/40 text-white hover:bg-white hover:text-gray-900" />
        <CarouselNext className="bg-white/20 border-white/40 text-white hover:bg-white hover:text-gray-900" />
      </Carousel>
    </section>
  );
};

export default HomeCarousel;
