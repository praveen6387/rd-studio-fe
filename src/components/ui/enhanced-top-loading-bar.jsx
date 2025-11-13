"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function EnhancedTopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingCount, setLoadingCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Track route changes
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

    // Listen for route changes
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (...args) => {
      handleRouteChangeStart();
      return originalPush.apply(router, args).finally(() => {
        setTimeout(handleRouteChangeComplete, 100);
      });
    };

    router.replace = (...args) => {
      handleRouteChangeStart();
      return originalReplace.apply(router, args).finally(() => {
        setTimeout(handleRouteChangeComplete, 100);
      });
    };

    router.back = () => {
      handleRouteChangeStart();
      return originalBack.apply(router).finally(() => {
        setTimeout(handleRouteChangeComplete, 100);
      });
    };

    router.forward = () => {
      handleRouteChangeStart();
      return originalForward.apply(router).finally(() => {
        setTimeout(handleRouteChangeComplete, 100);
      });
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  // Show loading bar when pathname changes
  useEffect(() => {
    if (loadingCount === 0) {
      setIsLoading(true);
      setProgress(0);
    }

    // Simulate progress for route changes
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
        if (loadingCount === 0) {
          setIsLoading(false);
          setProgress(0);
        }
      }, 200);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname, loadingCount]);

  // Monitor fetch requests and form submissions
  useEffect(() => {
    const originalFetch = window.fetch;
    const originalFormSubmit = HTMLFormElement.prototype.submit;

    // Intercept fetch requests
    window.fetch = async (...args) => {
      setLoadingCount((prev) => prev + 1);
      setIsLoading(true);
      setProgress(10);

      try {
        const response = await originalFetch(...args);
        setProgress(100);
        setTimeout(() => {
          setLoadingCount((prev) => {
            const newCount = prev - 1;
            if (newCount === 0) {
              setIsLoading(false);
              setProgress(0);
            }
            return newCount;
          });
        }, 200);
        return response;
      } catch (error) {
        setProgress(100);
        setTimeout(() => {
          setLoadingCount((prev) => {
            const newCount = prev - 1;
            if (newCount === 0) {
              setIsLoading(false);
              setProgress(0);
            }
            return newCount;
          });
        }, 200);
        throw error;
      }
    };

    // Intercept form submissions
    HTMLFormElement.prototype.submit = function () {
      setLoadingCount((prev) => prev + 1);
      setIsLoading(true);
      setProgress(20);

      // Simulate form submission progress
      const formTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(formTimer);
            return 80;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      // Complete after form submission
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoadingCount((prev) => {
            const newCount = prev - 1;
            if (newCount === 0) {
              setIsLoading(false);
              setProgress(0);
            }
            return newCount;
          });
        }, 200);
      }, 1000);

      return originalFormSubmit.call(this);
    };

    // Monitor XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (...args) {
      this._isApiCall = true;
      return originalXHROpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      if (this._isApiCall) {
        setLoadingCount((prev) => prev + 1);
        setIsLoading(true);
        setProgress(15);

        this.addEventListener("loadend", () => {
          setProgress(100);
          setTimeout(() => {
            setLoadingCount((prev) => {
              const newCount = prev - 1;
              if (newCount === 0) {
                setIsLoading(false);
                setProgress(0);
              }
              return newCount;
            });
          }, 200);
        });
      }
      return originalXHRSend.apply(this, args);
    };

    return () => {
      window.fetch = originalFetch;
      HTMLFormElement.prototype.submit = originalFormSubmit;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
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
