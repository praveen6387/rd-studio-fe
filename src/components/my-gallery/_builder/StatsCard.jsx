import React from "react";
import {
  FaImages,
  FaVideo,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

const StatsCard = ({ stats, onViewBookingsClick }) => {
  const defaultStats = {
    totalBookings: 0,
    totalFunctions: 0,
    totalPhotos: 0,
    totalVideos: 0,
    deliveredMedia: 0,
    pendingDelivery: 0,
    averageRating: 0,
    ...stats,
  };

  const statItems = [
    {
      icon: FaImages,
      label: "Photos",
      value: defaultStats.totalPhotos,
      color: "text-green-600",
      subtitle: "Captured",
    },
    {
      icon: FaVideo,
      label: "Videos",
      value: defaultStats.totalVideos,
      color: "text-orange-600",
      subtitle: "Recorded",
    },
    {
      icon: FaCheckCircle,
      label: "Delivered",
      value: defaultStats.deliveredMedia,
      color: "text-emerald-600",
      subtitle: "Ready for download",
    },
    {
      icon: FaClock,
      label: "Pending",
      value: defaultStats.pendingDelivery,
      color: "text-yellow-600",
      subtitle: "In processing",
    },
    {
      icon: FaStar,
      label: "Rating",
      value: defaultStats.averageRating,
      color: "text-pink-600",
      subtitle: "Average rating",
      isRating: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Your Studio Stats</h3>

      {/* Booking Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{defaultStats.totalBookings} Active Bookings</p>
            <p className="text-xs text-gray-500">View details for all your events.</p>
          </div>
          <button
            onClick={onViewBookingsClick}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="View all bookings"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <div>
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {item.isRating ? `${item.value}/5` : item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 bg-teal-500 text-white text-sm py-2.5 px-4 rounded-md hover:bg-teal-600 transition-colors">
            <FaDownload className="w-4 h-4" />
            <span>Download All</span>
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 text-sm py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Contact Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
