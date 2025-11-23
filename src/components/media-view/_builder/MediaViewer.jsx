import { useState } from "react";
import MediaViewModal from "@/components/utils/mediaViewModal";
import { useSearchParams } from "next/navigation";

const MediaViewer = ({ mediaData }) => {
  const searchParams = useSearchParams();
  const is_open = searchParams.get("is_open");
  const [isModalOpen, setIsModalOpen] = useState(is_open === "true" ? true : false); // Open by default

  if (!mediaData) return null;

  const mediaItems = mediaData.media_library_items || [];
  const mediaType = mediaData.media_type;

  // Transform data to match the viewer format
  const transformedMediaData = mediaItems.map((item, index) => ({
    id: item.id,
    type: mediaType === 0 ? "photo" : mediaType === 1 ? "video" : "flipbook",
    url: item.media_url,
    thumbnail: item.media_url,
    title: item.media_item_title,
    description: item.media_item_description,
    // For flipbook, include all images
    imageList: mediaType === 2 ? mediaItems.map((img) => ({ url: img.media_url, title: img.media_item_title })) : [],
  }));

  const handleMediaClick = (index) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // For single media (Image/Video), show large centered view
  if (mediaType === 0 || mediaType === 1) {
    const media = transformedMediaData[0];
    return (
      <div className="max-w-5xl mx-auto">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMediaClick(0)}
        >
          <div className="aspect-video bg-gray-100">
            {mediaType === 0 ? (
              <img src={media.url} alt={media.title} className="w-full h-full object-contain" />
            ) : (
              <video src={media.url} controls className="w-full h-full object-contain">
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{media.title}</h3>
            <p className="text-gray-600">{media.description}</p>
          </div>
        </div>

        {/* Media Viewer Modal */}
        {isModalOpen && (
          <>
            <MediaViewModal data={mediaData} open={isModalOpen} onOpenChange={handleCloseModal} />
          </>
        )}
      </div>
    );
  }

  // For FlipBook (multiple images), show grid view
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 FlipBook - {mediaItems.length} pages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {transformedMediaData.map((media, index) => (
            <div
              key={media.id}
              className="aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all"
              onClick={() => handleMediaClick(index)}
            >
              <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <button
          onClick={() => handleMediaClick(0)}
          className="w-full py-3 px-6 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
        >
          📖 Open Interactive FlipBook
        </button>
      </div>

      {/* Media Viewer Modal */}
      {isModalOpen && (
        <>
          <MediaViewModal data={mediaData} open={isModalOpen} onOpenChange={handleCloseModal} />
        </>
      )}
    </div>
  );
};

export default MediaViewer;
