"use client";
import { useState } from "react";
import PageLayout from "@/components/utils/PageLayout";
import HeroSection from "./_builder/HeroSection";
import { photoCollections } from "@/data/photoCollections.js";
import BookingSheet from "./_builder/BookingSheet";
import StatsCard from "./_builder/StatsCard";
import MediaTabs from "./_builder/MediaTabs";

const MyGalleryIndex = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- Data Transformation ---
  const customerIdToDisplay = 2; // Using customer "Sarah Wilson" (ID 2)

  // 1. Filter collections for the selected customer
  const customerCollections2 = photoCollections.find((c) => c.customerId === customerIdToDisplay);

  // 2. Create customerData object
  const customerData = {
    name: customerCollections2.customerName || "Customer",
    email: `${customerCollections2?.customerName.toLowerCase().replace(" ", ".")}@example.com`,
    phone: "+1 (555) 123-4567",
  };

  // 4. Calculate overall stats
  const totalPhotos = customerCollections2.mediaList.filter((m) => m.type === "image").length;
  const totalVideos = customerCollections2.mediaList.filter((m) => m.type === "video").length;
  const deliveredMedia = customerCollections2.mediaList.filter((m) => m.status === "delivered").length;

  const stats = {
    totalBookings: 1,
    totalFunctions: 2,
    totalPhotos: totalPhotos,
    totalVideos: totalVideos,
    deliveredMedia: deliveredMedia,
    pendingDelivery: totalPhotos + totalVideos - deliveredMedia,
    averageRating: 4.7, // Mocked rating
  };
  // --- End Data Transformation ---

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Hero Section */}
        <HeroSection user={customerData} />

        {/* Content Section with Stats, Bookings and Media Tabs */}
        <section className="py-8 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full blur-3xl opacity-60"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 relative z-10">
            {/* Left Side - Stats */}
            <StatsCard stats={stats} onViewBookingsClick={() => setIsSheetOpen(true)} />

            {/* Right Side - Media Tabs */}
            <MediaTabs mediaData={customerCollections2.mediaList} />
          </div>
        </section>

        {/* <BookingSheet bookings={bookings} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} /> */}
      </div>
    </PageLayout>
  );
};

export default MyGalleryIndex;
