"use client";

import { X } from "lucide-react";
import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

interface WindowProps {
  id: string;
  title: string;
  zIndex: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

export default function Window({
  id,
  title,
  zIndex,
  onClose,
  onFocus,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement | null>(null);
  // Create a new, specific ref for the header element
  const headerRef = useRef<HTMLElement | null>(null);

  // Entrance animation effect
  useLayoutEffect(() => {
    gsap.fromTo(
      windowRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.1)" }
    );
  }, []);

  // Draggable effect with the corrected trigger
  useEffect(() => {
    let dragInstance: Draggable | null = null;
    if (windowRef.current && headerRef.current) {
      dragInstance = Draggable.create(windowRef.current, {
        // Use the specific header ref as the trigger, not a generic class
        trigger: headerRef.current,
        bounds: "main",
        edgeResistance: 0.85,
      })[0];
    }

    return () => {
      if (dragInstance) {
        dragInstance.kill();
      }
    };
  }, []);

  const handleClose = () => {
    gsap.to(windowRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onClose(id),
    });
  };

  return (
    <div
      ref={windowRef}
      className="fixed z-40 flex items-center justify-center"
      style={{ zIndex: zIndex }}
      onClick={() => onFocus(id)}
    >
      <div className="w-full max-w-3xl h-[60%] bg-white/30 backdrop-blur-lg border border-white/40 shadow-inner rounded-xl shadow-2xl flex flex-col">
        {/* Assign the new headerRef here */}
        <header
          ref={headerRef}
          className="flex items-center justify-between p-2 border-b border-white/40 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              aria-label="Close"
            />
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
          <h2 className="text-sm font-medium text-slate-800 select-none">
            {title}
          </h2>
          <div className="w-20"></div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
