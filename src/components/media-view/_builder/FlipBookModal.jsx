import React from "react";
import HTMLFlipBook from "react-pageflip";

const FlipBookModal = ({ currentItem }) => {
  const pages = currentItem.imageList || [];

  return (
    <div className="flex flex-col items-center justify-center max-w-full max-h-[80vh]">
      <HTMLFlipBook
        width={800}
        height={500}
        size="stretch"
        minWidth={600}
        maxWidth={1200}
        minHeight={400}
        maxHeight={800}
        maxShadowOpacity={1.0}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-2xl"
        style={{ margin: "0 auto" }}
        flippingTime={1000}
        usePortrait={false}
        startPage={0}
        drawShadow={true}
        useMouseEvents={true}
        swipeDistance={80}
        showPageCorners={true}
        disableFlipByClick={false}
        clickEventForward={true}
        autoSize={true}
        hard="cover"
        pageMode="single"
        autoPlay={false}
        autoPlayDuration={3000}
        autoPlayStart={false}
        backgroundColor="rgba(0,0,0,0.2)"
        webgl={true}
        autoEnableOutline={true}
        autoEnableThumbnail={true}
      >
        {pages.map((page, idx) => (
          <div key={idx} data-density="hard">
            <img src={page.url} alt={page.title} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipBookModal;
