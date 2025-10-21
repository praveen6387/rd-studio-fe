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
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection user={customerData} />

        {/* Content Section with Stats, Bookings and Media Tabs */}
        <section className=" bg-gray-50 py-6 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
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
