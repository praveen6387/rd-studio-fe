import React, { useState } from "react";
import { Image, Video, Music2, File, BookOpen, List, ChevronDown } from "lucide-react";
import MediaViewerModal from "./MediaViewerModal";

const TABS = [
  { id: "all", label: "All", icon: File, count: 0 },
  { id: "photos", label: "Photos", icon: Image, count: 0 },
  { id: "videos", label: "Videos", icon: Video, count: 0 },
  { id: "flipBook", label: "Flip Book", icon: BookOpen, count: 0 },
  { id: "audios", label: "Audio", icon: Music2, count: 0 },
];

const MEDIA_VIEW_TYPES = [
  { id: "grid_1*2", label: "Grid 1*2", icon: Image },
  { id: "grid_2*2", label: "Grid 2*2", icon: Image },
  { id: "grid_3*2", label: "Grid 3*2", icon: Image },
  { id: "grid_4*2", label: "Grid 4*2", icon: Image },
  { id: "grid_5*2", label: "Grid 5*2", icon: Image },
  { id: "grid_6*2", label: "Grid 6*2", icon: Image },
  { id: "grid_7*2", label: "Grid 7*2", icon: Image },
  { id: "grid_8*2", label: "Grid 8*2", icon: Image },
  { id: "list", label: "List", icon: List },
];

const MediaTabs = ({ mediaData }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeViewType, setActiveViewType] = useState("grid_1*2");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [clickedMediaItem, setClickedMediaItem] = useState(null);

  const selectedViewType = MEDIA_VIEW_TYPES.find((type) => type.id === activeViewType);

  const getMediaCount = (tabId) => {
    let medialLength = 0;
    if (tabId === "all") {
      medialLength = mediaData.length;
    } else {
      const mediaType = tabId === "flipBook" ? "flipbook" : tabId.replace(/s$/, "");
      medialLength = mediaData.filter((media) => media.type === mediaType).length;
    }
    return medialLength;
  };

  // Filter media items for the current tab
  const filteredMediaData = mediaData.filter(Boolean).filter((media) => {
    if (activeTab === "all") {
      return true;
    } else {
      const mediaType = activeTab === "flipBook" ? "flipbook" : activeTab.replace(/s$/, "");
      return media.type === mediaType;
    }
  });

  const handleMediaClick = (media, index) => {
    if (media.type === "photo" || media.type === "video" || media.type === "flipbook") {
      const viewableIndex = filteredMediaData.findIndex((item) => item.id === media.id);
      setCurrentMediaIndex(viewableIndex);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMediaIndex(0);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* tab section */}
      <div className="border-b border-gray-200 flex justify-between">
        {/* media type section */}
        <div className="flex space-x-2 p-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-gray-200"}`}
              >
                {getMediaCount(tab.id)}
              </span>
            </button>
          ))}
        </div>
        {/* media view type dropdown section */}
        <div className="flex justify-end p-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <selectedViewType.icon className="w-4 h-4" />
              <span>{selectedViewType.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {MEDIA_VIEW_TYPES.map((viewType) => (
                  <button
                    key={viewType.id}
                    onClick={() => {
                      setActiveViewType(viewType.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                      activeViewType === viewType.id ? "bg-teal-50 text-teal-700" : "text-gray-700"
                    }`}
                  >
                    <viewType.icon className="w-4 h-4" />
                    <span>{viewType.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* tab section */}

      {/* media section */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMediaData.map((media, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center border border-gray-200 rounded-lg p-2 ${
                media.type === "photo" || media.type === "video" || media.type === "flipbook"
                  ? "cursor-pointer hover:shadow-md transition-shadow"
                  : ""
              }`}
              onClick={() => handleMediaClick(media, index)}
            >
              <div className="w-full h-32 mb-2">
                {media.type === "photo" ? (
                  <img src={media.url} alt={media.title} className="w-full h-full object-cover rounded" />
                ) : media.type === "video" ? (
                  <video
                    src={media.url}
                    poster={media.thumbnail}
                    className="w-full h-full object-cover rounded"
                    controls
                  />
                ) : media.type === "audio" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                    <audio src={media.url} controls className="w-full" />
                  </div>
                ) : media.type === "flipbook" ? (
                  <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover rounded" />
                ) : null}
              </div>
              <div className="text-sm text-gray-700 text-center">{media.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {isModalOpen && filteredMediaData.length > 0 && (
        <MediaViewerModal mediaItems={filteredMediaData} currentIndex={currentMediaIndex} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MediaTabs;
