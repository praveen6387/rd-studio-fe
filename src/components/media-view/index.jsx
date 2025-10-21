"use client";
import PageLayout from "@/components/utils/PageLayout";
import HeroSection from "./_builder/HeroSection";
import MediaViewer from "./_builder/MediaViewer";

const MediaViewIndex = ({ mediaId, media }) => {
  if (!media?.data) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Media Not Found</h2>
            <p className="text-gray-600">The requested media could not be found.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const mediaData = media.data;

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection mediaData={mediaData} />

        {/* Media Viewer Section */}
        <section className="bg-gray-50 py-12 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <MediaViewer mediaData={mediaData} />
        </section>
      </div>
    </PageLayout>
  );
};

export default MediaViewIndex;
