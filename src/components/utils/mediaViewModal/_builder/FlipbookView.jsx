"use client";
import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const FlipbookView = ({ media_title, media_description, media_library_items }) => {
  const bookRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 600, height: 400 });
  const pointerStart = useRef({ x: 0, y: 0, id: null });

  useEffect(() => {
    const update = () => {
      const mobile = typeof window !== "undefined" && window.innerWidth < 768;
      setIsMobile(mobile);
      if (typeof window === "undefined") return;
      if (mobile) {
        // On mobile, the container is rotated; use viewport to maximize usage.
        const width = Math.min(1600, Math.floor(window.innerHeight * 1.0));
        const height = Math.min(1600, Math.floor(window.innerWidth * 1.0));
        setBookSize({ width, height });
      } else {
        setBookSize({ width: 600, height: 400 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const flipPrev = () => {
    const api = bookRef.current?.pageFlip?.();
    api?.flipPrev?.();
  };

  const flipNext = () => {
    const api = bookRef.current?.pageFlip?.();
    api?.flipNext?.();
  };

  const onPointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerUp = (e) => {
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const SWIPE_THRESHOLD = 30;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Prefer swipe when significant movement, else treat as tap
    if (isMobile) {
      if (Math.abs(dy) > SWIPE_THRESHOLD) {
        if (dy < 0) flipPrev();
        else flipNext();
      } else {
        if (y < rect.height / 2) flipPrev();
        else flipNext();
      }
    } else {
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) flipNext();
        else flipPrev();
      } else {
        if (x < rect.width / 2) flipPrev();
        else flipNext();
      }
    }
    e.preventDefault();
  };

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
      <div className={`w-screen h-screen overflow-hidden flex items-center justify-center`}>
        <div
          className={`relative flex items-center justify-center rotate-90 md:rotate-0 origin-center w-[100vh] h-[100vw] md:w-full md:h-full`}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={600}
            height={400}
            size="stretch"
            minWidth={240}
            maxWidth={1200}
            minHeight={200}
            maxHeight={1200}
            showCover={true}
            mobileScrollSupport={true}
            usePortrait={false}
            startPage={0}
            useMouseEvents={true}
            clickEventForward={true}
            showPageCorners={true}
          >
            {new_pages.map((page, idx) => (
              <div key={idx}>
                {page.cropSide == "full" && (
                  <img
                    src={page.url}
                    alt={page.title}
                    className={`w-full h-full pointer-events-none select-none`}
                    draggable={false}
                  />
                )}
                {page.cropSide == "left" && (
                  <div
                    className={`w-full h-full pointer-events-none select-none`}
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
                    className={`w-full h-full pointer-events-none select-none`}
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
          <div className="absolute inset-0 z-10" onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
        </div>
      </div>
    </>
  );
};

export default FlipbookView;
