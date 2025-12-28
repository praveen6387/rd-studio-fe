"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoadingLink({ children, href, ...props }) {
  // Keep this component as a thin wrapper over Next.js Link to avoid double loaders.

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}



