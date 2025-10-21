import React from "react";
import { FaCamera } from "react-icons/fa";

const HeroSection = ({ user }) => {
  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <FaCamera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 truncate">Welcome back, {user.name}! 👋</h1>
            <p className="text-base text-gray-600">Your photography journey captured in beautiful moments.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
