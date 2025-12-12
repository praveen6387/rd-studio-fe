"use client";
import React from "react";
import HTMLFlipBook from "react-pageflip";

const FlipbookView = ({ media_title, media_description, media_library_items }) => {
  const pages = media_library_items.map((item) => ({ url: item.media_url, title: item.media_item_title }));
  let new_pages = [];
  for (let i = 0; i < pages.length; i++) {
    if (i === 0 || i === pages.length - 1) {
      // First page stays full
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "full" });
    } else {
      // Subsequent pages: split into left and right halves
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "left" });
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "right" });
    }
  }

  return (
    <>
      <div className={`w-screen h-screen flex items-center justify-center`}>
        <HTMLFlipBook
          width={600}
          height={400}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={true}
          startPage={0}
          useMouseEvents={true}
          // mode="landscape"
          flipFrom="middle"
        >
          {new_pages.map((page, idx) => (
            <div key={idx} data-density="hard">
              {page.cropSide == "full" && <img src={page.url} alt={page.title} className={`w-full h-full`} />}
              {page.cropSide == "left" && (
                <div
                  className={`w-full h-full`}
                  style={{
                    backgroundImage: `url(${page.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left top",
                    backgroundSize: "200% 100%",
                  }}
                  aria-label={page.title}
                  role="img"
                />
              )}
              {page.cropSide == "right" && (
                <div
                  className={`w-full h-full`}
                  style={{
                    backgroundImage: `url(${page.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right top",
                    backgroundSize: "200% 100%",
                  }}
                  aria-label={page.title}
                  role="img"
                />
              )}
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
};

export default FlipbookView;
