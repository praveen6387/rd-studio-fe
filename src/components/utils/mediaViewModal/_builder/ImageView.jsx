import React from "react";

const ImageView = ({ media_title, media_description, media_library_item }) => {
  if (!media_library_item) return null;

  const { media_url, media_item_title, media_item_description } = media_library_item;

  const titleToShow = media_item_title || media_title;
  const descriptionToShow = media_item_description || media_description;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <img
          src={media_url}
          alt={titleToShow}
          className="max-h-[70vh] max-w-full w-auto object-contain rounded-md shadow-md"
        />
      </div>
      {/* {titleToShow && <h3 className="mt-4 text-lg font-semibold text-center">{titleToShow}</h3>}
      {descriptionToShow && <p className="mt-2 text-sm text-muted-foreground text-center">{descriptionToShow}</p>} */}
    </div>
  );
};

export default ImageView;
