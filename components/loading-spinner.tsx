"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingSpinner() {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label="Loading"
    >
      <div
        ref={spinnerRef}
        className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
