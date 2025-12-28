"use client";
import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { convertToDate } from "@/lib/utils";
import { Expand, PhoneIcon, Shrink, Volume2, VolumeOff } from "lucide-react";
import Instagram from "public/images/svg/Instagram";
import WhatsApp from "public/images/svg/WhatsApp";

const FlipbookView = ({ media_title, media_description, media_library_items, data }) => {
  const bookRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const pointerStart = useRef({ x: 0, y: 0, id: null });
  const [isMuted, setIsMuted] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  const musicList = [
    "/music/closer_mix.mp3",
    "/music/jashne_bahara.mp3",
    "/music/meri_zindagi_hai_bgm.mp3",
    "/music/saayon.mp3",
  ];
  const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];

  const [bookSize, setBookSize] = useState({ width: 700 });
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) {
        setBookSize({ width: w - 40 });
      } else if (w <= 1024) {
        setBookSize({ width: w - 600 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep the <audio> element in sync with isMuted and try to autoplay safely
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = isMuted;
    // Ensure playback starts after any user interaction
    if (!isMuted && el.paused) {
      el.play().catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = () => {
    const el = audioRef.current;
    if (el && el.paused) {
      el.play().catch(() => {});
    }
    setIsMuted((m) => !m);
  };

  // Fullscreen helpers and sync
  useEffect(() => {
    const handleFsChange = () => {
      const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullScreen(Boolean(fsElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, []);

  const enterFullscreen = () => {
    const el = containerRef.current || document.documentElement;
    if (!el) return;
    const req =
      el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (req) {
      req.call(el).catch?.(() => {});
    }
  };

  const exitFullscreen = () => {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (exit) {
      exit.call(document).catch?.(() => {});
    }
  };

  const toggleFullscreen = () => {
    const fsElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (fsElement) exitFullscreen();
    else enterFullscreen();
  };

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
    } else if (i === 1) {
      new_pages.push({
        url: "https://t4.ftcdn.net/jpg/02/52/46/25/360_F_252462576_koy7njo9iYx6gUcM26IZcDUs9fMKIKJs.jpg",
        title: pages[i].title,
        cropSide: "left",
      });
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "full" });
    } else if (i == pages.length - 2) {
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "full" });
      new_pages.push({
        url: "https://t4.ftcdn.net/jpg/02/52/46/25/360_F_252462576_koy7njo9iYx6gUcM26IZcDUs9fMKIKJs.jpg",
        title: pages[i].title,
        cropSide: "right",
      });
    } else {
      // Subsequent pages: split into left and right halves
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "left" });
      new_pages.push({ url: pages[i].url, title: pages[i].title, cropSide: "right" });
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`flex flex-col items-center justify-center rotate-90 md:rotate-0 origin-center gap-y-6`}
      >
        {/* Top placeholder (rotates on small screens) */}
        <div className="relative w-full">
          <div className="text-yellow-300 text-2xl font-semibold justify-self-center text-center w-full">
            {data.media_title}
          </div>
          <div className="absolute right-1 top-0 text-white">
            <ul className="flex gap-x-4">
              <li>
                <Instagram className="w-6 h-6" />
              </li>
              <li>
                <WhatsApp className="w-6 h-6" />
              </li>
              {!isMuted ? (
                <li>
                  <Volume2 onClick={toggleMute} />
                </li>
              ) : (
                <li>
                  <VolumeOff onClick={toggleMute} />
                </li>
              )}

              <li>{isFullScreen ? <Shrink onClick={toggleFullscreen} /> : <Expand onClick={toggleFullscreen} />}</li>
            </ul>
          </div>
        </div>
        {/* Background music */}
        <audio ref={audioRef} src={randomMusic} loop preload="auto" />
        <div className={`relative`}>
          <HTMLFlipBook
            ref={bookRef}
            minWidth={bookSize.width}
            minHeight={bookSize.width / 1.5}
            width={bookSize.width}
            height={bookSize.width / 1.5}
            maxWidth={3200}
            maxHeight={800}
            size="stretch"
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
                    className={`w-full h-full object-contain pointer-events-none select-none`}
                    draggable={false}
                  />
                )}
                {page.cropSide == "left" && (
                  <div
                    className={`w-full h-full object-contain pointer-events-none select-none`}
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
                    className={`w-full h-full object-contain pointer-events-none select-none`}
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
        {/* Bottom placeholder (rotates on small screens) */}
        <div className="text-yellow-300 text-center">
          <div>Created By - {data.studio_name}</div>
          {/* <div>+91- 9792098570</div> */}
        </div>
      </div>
    </>
  );
};

export default FlipbookView;
