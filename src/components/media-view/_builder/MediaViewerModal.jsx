import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import FlipBookModal from "./FlipBookModal";

const MediaViewerModal = ({ mediaItems, currentIndex, onClose }) => {
  const [localIndex, setLocalIndex] = React.useState(currentIndex);

  const handleNext = useCallback(() => {
    if (localIndex < mediaItems.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  }, [localIndex, mediaItems.length]);

  const handlePrev = useCallback(() => {
    if (localIndex > 0) {
      setLocalIndex(localIndex - 1);
    }
  }, [localIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    setLocalIndex(currentIndex);
  }, [currentIndex]);

  if (currentIndex === null || !mediaItems || mediaItems.length === 0) {
    return null;
  }

  const currentItem = mediaItems[localIndex];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        {/* Previous button */}
        {localIndex > 0 && (
          <button
            className="absolute left-5 text-white/70 hover:text-white transition-colors z-50 p-3 bg-black/20 rounded-full"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Media content */}
        <div className="max-w-screen-lg max-h-[90vh] w-auto h-auto flex flex-col items-center justify-center">
          {currentItem.type === "photo" ? (
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          ) : currentItem.type === "flipbook" ? (
            <FlipBookModal currentItem={currentItem} />
          ) : (
            <video src={currentItem.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg">
              Your browser does not support the video tag.
            </video>
          )}
          {/* Media title and description */}
          <div className="text-white mt-4 text-center p-4 bg-black/20 rounded-b-lg max-w-2xl">
            <h3 className="text-lg font-semibold">{currentItem.title}</h3>
            <p className="text-sm text-gray-300">{currentItem.description}</p>
          </div>
        </div>

        {/* Next button */}
        {localIndex < mediaItems.length - 1 && (
          <button
            className="absolute right-5 text-white/70 hover:text-white transition-colors z-50 p-3 bg-black/20 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaViewerModal;
