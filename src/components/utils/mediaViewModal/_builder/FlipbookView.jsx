"use client";
import { RotateCcwIcon } from "lucide-react";
import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";

const FlipbookView = ({ media_title, media_description, media_library_items }) => {
  const pages = media_library_items.map((item) => ({ url: item.media_url, title: item.media_item_title }));
  const [isRotated, setIsRotated] = useState(false);

  return (
    <>
      <button
        className="absolute top-2 right-12 z-50 bg-black/50 p-2 rounded-full"
        onClick={() => setIsRotated(!isRotated)}
      >
        <RotateCcwIcon className="w-4 h-4 text-white" />
      </button>
      <div
        className={`flex flex-col items-center justify-center w-full h-full
        transition-transform duration-300 ${isRotated ? "rotate-90" : ""} p-16`}
      >
        <HTMLFlipBook
          key={isRotated ? "rotated" : "normal"}
          width={isRotated ? 300 : 600}
          height={isRotated ? 200 : 400}
          maxShadowOpacity={1.0}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={!isRotated}
          startPage={0}
          drawShadow={true}
          useMouseEvents={true}
          swipeDistance={80}
          showPageCorners={true}
          autoSize={true}
          // hard="cover"
        >
          {pages.map((page, idx) => (
            <div key={idx} data-density="hard">
              <img
                src={page.url}
                alt={page.title}
                // className="max-w-full max-h-full object-contain"
                style={{ width: "100%", height: "100%" }}
              />
              {/* <div className="text-center text-xs text-gray-500 mt-2">{page.title}</div> */}
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
};

export default FlipbookView;
