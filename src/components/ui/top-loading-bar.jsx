"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopLoadingBar() {
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
        return prev + Math.random() * 15;
      });
    }, 100);

    // Complete loading after a short delay
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  // Monitor fetch requests
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      setIsLoading(true);
      setProgress(10);

      try {
        const response = await originalFetch(...args);
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
        return response;
      } catch (error) {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
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
    </div>
  );
}



