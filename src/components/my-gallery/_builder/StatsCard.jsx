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
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-indigo-700 to-gray-900 bg-clip-text text-transparent">
          Your Studio Stats
        </h3>
      </div>

      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900">{defaultStats.totalBookings} Active Bookings</p>
            <p className="text-sm text-gray-600 mt-1">View details for all your events</p>
          </div>
          <button
            onClick={onViewBookingsClick}
            className="p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 text-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-110"
            aria-label="View all bookings"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${item.color.replace('text-', 'bg-').replace('600', '100')} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800 block">{item.label}</span>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {item.isRating ? `${item.value}/5` : item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <FaDownload className="w-4 h-4" />
            <span>Download All</span>
          </button>
          <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-semibold py-3 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105">
            Contact Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
