"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTouchDevice } from "@/hooks/use-touch-device";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const isTouchDevice = useTouchDevice();

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (isTouchDevice || !cursorRef.current) return;

    const quickToX = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    const quickToY = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });

    const moveCursor = (e: MouseEvent) => {
      quickToX(e.clientX);
      quickToY(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [isTouchDevice]);

  // Don't render cursor on touch devices
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-slate-900/20 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]"
      aria-hidden="true"
    />
  );
}
