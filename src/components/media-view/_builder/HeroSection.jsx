import React from "react";
import { convertTime } from "@/lib/utils";

const HeroSection = ({ mediaData }) => {
  return (
    <section className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">{mediaData?.media_title || "Media Gallery"}</h1>
          <p className="text-xl text-teal-50 mb-6 max-w-3xl mx-auto">
            {mediaData?.media_description || "View and explore your media collection"}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              📁 {mediaData?.media_type_name || "Media"}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              🖼️ {mediaData?.media_library_items?.length || 0}{" "}
              {mediaData?.media_library_items?.length === 1 ? "item" : "items"}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              📅 {convertTime(mediaData?.created_at)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
