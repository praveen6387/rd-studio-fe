"use client";
import PageLayout from "@/components/utils/PageLayout";
import HomeCarousel from "./_builder/Carousel";
import OurService from "./_builder/OurService";
import ShortAbout from "./_builder/ShortAbout";

const HomeIndex = () => {
  return (
    <div>
      <PageLayout>
        <HomeCarousel />
        <ShortAbout />
        <OurService />
      </PageLayout>
    </div>
  );
};

export default HomeIndex;
