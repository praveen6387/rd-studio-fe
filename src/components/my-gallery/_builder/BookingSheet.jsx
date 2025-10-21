import React from "react";
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaClock, FaCheckCircle, FaSpinner, FaTimes } from "react-icons/fa";

const BookingSheet = ({ bookings, isOpen, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-teal-600 bg-teal-100";
      case "upcoming":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return FaCheckCircle;
      case "in-progress":
        return FaSpinner;
      case "upcoming":
        return FaClock;
      default:
        return FaClock;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {bookings?.map((booking, index) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{booking.functionName}</h4>
                      <p className="text-sm text-gray-500">{booking.venue}</p>
                    </div>
                    <div
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="capitalize">{booking.status.replace("-", " ")}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="w-4 h-4 text-gray-400" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="w-4 h-4 text-gray-400" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="w-4 h-4 text-gray-400" />
                      <span>{booking.guests} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Media Progress</span>
                      <span className="font-semibold text-gray-800">{booking.mediaProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${booking.mediaProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                      <span>{booking.photosCount} photos</span>
                      <span>{booking.videosCount} videos</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!bookings || bookings.length === 0) && (
              <div className="text-center py-8">
                <FaCalendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSheet;
