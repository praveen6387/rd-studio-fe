"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef(
  ({ orientation = "horizontal", opts, setApi, className, children, ...props }, ref) => {
    const [index, setIndex] = React.useState(0);
    const containerRef = React.useRef(null);
    const [count, setCount] = React.useState(0);
    const loop = Boolean(opts?.loop);

    const getSlideCount = React.useCallback(() => {
      const node = containerRef.current;
      if (!node) return 0;
      return node.querySelectorAll("[data-carousel-item='true']").length;
    }, []);

    const scrollPrev = React.useCallback(() => {
      setIndex((prev) => {
        if (loop) {
          const c = Math.max(count, 1);
          return (prev - 1 + c) % c;
        }
        return Math.max(0, prev - 1);
      });
    }, [count, loop]);

    const scrollNext = React.useCallback(() => {
      setIndex((prev) => {
        if (loop) {
          const c = Math.max(count, 1);
          return (prev + 1) % c;
        }
        return Math.min(Math.max(count - 1, 0), prev + 1);
      });
    }, [count, loop]);

    React.useEffect(() => {
      if (setApi) {
        setApi({
          scrollNext,
          scrollPrev,
          getIndex: () => index,
          setIndex,
        });
      }
    }, [setApi, scrollNext, scrollPrev, index]);

    // Track slide count
    React.useEffect(() => {
      const update = () => setCount(getSlideCount());
      update();
      const ro = new ResizeObserver(update);
      if (containerRef.current) {
        ro.observe(containerRef.current);
      }
      return () => ro.disconnect();
    }, [getSlideCount]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    const canScrollPrev = loop ? true : index > 0;
    const canScrollNext = loop ? true : index < Math.max(count - 1, 0);

    return (
      <CarouselContext.Provider
        value={{
          containerRef,
          index,
          setIndex,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { containerRef, index, orientation } = useCarousel();
  const axis = orientation === "horizontal" ? "X" : "Y";
  const translate = orientation === "horizontal" ? `-${index * 100}%` : `-${index * 100}%`;

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex transition-transform duration-500 ease-in-out",
          orientation === "horizontal" ? "" : "flex-col",
          className
        )}
        style={{
          transform: orientation === "horizontal" ? `translateX(${translate})` : `translateY(${translate})`,
        }}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      data-carousel-item="true"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "" : "",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute h-12 w-12 rounded-full z-10 disabled:opacity-40 disabled:cursor-not-allowed",
        orientation === "horizontal" ? "left-4 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <span aria-hidden>‹</span>
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute h-12 w-12 rounded-full z-10 disabled:opacity-40 disabled:cursor-not-allowed",
        orientation === "horizontal" ? "right-4 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <span aria-hidden>›</span>
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

