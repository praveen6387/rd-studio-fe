import React from "react";

const VideoView = ({ media_title, media_description, media_library_item }) => {
  if (!media_library_item) return null;

  const { media_url, media_item_title, media_item_description } = media_library_item;

  const titleToShow = media_item_title || media_title;
  const descriptionToShow = media_item_description || media_description;
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <video src={media_url} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg">
        Your browser does not support the video tag.
      </video>
      <div className="text-white mt-4 text-center p-4 bg-black/20 rounded-b-lg max-w-2xl">
        <h3 className="text-lg font-semibold">{titleToShow}</h3>
        <p className="text-sm text-gray-300">{descriptionToShow}</p>
      </div>
    </div>
  );
};

export default VideoView;
