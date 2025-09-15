"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  "data-flip-id"?: string;
}

export default function Window({
  title,
  isOpen,
  onClose,
  children,
  "data-flip-id": dataFlipId,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Ambil elemen konten
      const content = windowRef.current?.querySelectorAll(".window-content");

      // --- PERBAIKAN DI SINI ---
      // Tambahkan pengecekan untuk memastikan 'content' tidak undefined
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.3 }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={windowRef}
        data-flip-id={dataFlipId}
        className="relative z-10 w-full max-w-3xl h-[80vh] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-300/50 flex-shrink-0">
          <h2 className="font-serif text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </header>
        <div className="p-8 overflow-y-auto window-content flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}
