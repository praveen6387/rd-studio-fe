"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoadingLink({ children, href, ...props }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e) => {
    // Only handle internal navigation
    if (href && href.startsWith("/")) {
      setIsNavigating(true);

      // Trigger the loading bar by dispatching a custom event
      window.dispatchEvent(new CustomEvent("route-change-start"));

      // Navigate programmatically
      router.push(href);

      // Reset after navigation
      setTimeout(() => {
        setIsNavigating(false);
        window.dispatchEvent(new CustomEvent("route-change-complete"));
      }, 100);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}



