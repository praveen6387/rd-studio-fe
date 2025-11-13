"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading bar when route changes
    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 50);

    // Complete loading after route change
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  // Listen for custom route change events
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      setProgress(0);
    };

    const handleRouteChangeComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener("route-change-start", handleRouteChangeStart);
    window.addEventListener("route-change-complete", handleRouteChangeComplete);

    return () => {
      window.removeEventListener("route-change-start", handleRouteChangeStart);
      window.removeEventListener("route-change-complete", handleRouteChangeComplete);
    };
  }, []);

  // Also listen for link clicks
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.href && !target.href.startsWith("mailto:") && !target.href.startsWith("tel:")) {
        const url = new URL(target.href);
        if (url.origin === window.location.origin) {
          setIsLoading(true);
          setProgress(0);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transition-all duration-300 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
        }}
      />

      {/* Glowing effect */}
      <div
        className="absolute top-0 h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-60 blur-sm"
        style={{ width: `${progress}%` }}
      />

      {/* Animated shimmer effect */}
      <div
        className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-80"
        style={{
          width: `${progress}%`,
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  );
}
