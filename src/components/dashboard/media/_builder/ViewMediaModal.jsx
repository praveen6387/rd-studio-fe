import React from "react";
import HTMLFlipBook from "react-pageflip";
import { X } from "lucide-react";

// Not used as of now
const ViewMediaModal = ({ isOpen, onClose, mediaData }) => {
  if (!mediaData || !isOpen) return null;

  const mediaItems = mediaData.media_library_items || [];
  const mediaType = mediaData.media_type;
  const firstItem = mediaItems[0];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        {/* Media Content */}
        <div className="max-w-screen-lg max-h-[90vh] w-auto h-auto flex flex-col items-center justify-center">
          {/* Image Display (Type 0) */}
          {mediaType === 0 && firstItem && (
            <img
              src={firstItem.media_url}
              alt={firstItem.media_item_title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}

          {/* Video Display (Type 1) */}
          {mediaType === 1 && firstItem && (
            <video src={firstItem.media_url} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg">
              Your browser does not support the video tag.
            </video>
          )}

          {/* FlipBook Display (Type 2) */}
          {mediaType === 2 && (
            <div className="flex flex-col items-center justify-center max-w-full max-h-[80vh]">
              <HTMLFlipBook
                width={800}
                height={500}
                size="stretch"
                minWidth={600}
                maxWidth={1200}
                minHeight={400}
                maxHeight={800}
                maxShadowOpacity={1.0}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl"
                style={{ margin: "0 auto" }}
                flippingTime={1000}
                usePortrait={false}
                startPage={0}
                drawShadow={true}
                useMouseEvents={true}
                swipeDistance={80}
                showPageCorners={true}
                disableFlipByClick={false}
                clickEventForward={true}
                autoSize={true}
                hard="cover"
                pageMode="single"
                autoPlay={false}
                autoPlayDuration={3000}
                autoPlayStart={false}
                backgroundColor="rgba(0,0,0,0.2)"
                webgl={true}
                autoEnableOutline={true}
                autoEnableThumbnail={true}
              >
                {mediaItems.map((item) => (
                  <div key={item.id} data-density="hard">
                    <img src={item.media_url} alt={item.media_item_title} style={{ width: "100%", height: "100%" }} />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}

          {/* Media Title and Description */}
          <div className="text-white mt-4 text-center p-4 bg-black/20 rounded-b-lg">
            <h3 className="text-lg font-semibold">
              {mediaType === 2
                ? `${mediaData.media_type_name} (${mediaItems.length} pages)`
                : firstItem?.media_item_title}
            </h3>
            <p className="text-sm text-gray-300">
              {mediaType === 2 ? "Interactive FlipBook" : firstItem?.media_item_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMediaModal;
