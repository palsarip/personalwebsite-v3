"use client";

import { X } from 'lucide-react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Window({ title, isOpen, onClose, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && isMounted) {
      gsap.set(windowRef.current, { opacity: 0, scale: 0.9, y: 20 });
      gsap.to(windowRef.current, { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.4, 
        ease: "power3.out",
      });
    } else if (!isOpen && isMounted) {
      gsap.to(windowRef.current, { 
        opacity: 0, 
        scale: 0.9, 
        y: 20, 
        duration: 0.3, 
        ease: "power2.in",
        onComplete: () => setIsMounted(false),
      });
    }
  }, [isOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div 
      ref={windowRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
    >
      <div className="w-full max-w-3xl h-auto max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col">
        <header className="flex items-center justify-between p-2 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose} 
              className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors" 
              aria-label="Close" 
            />
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
          <h2 className="text-sm font-medium text-slate-800 select-none">{title}</h2>
          <div className="w-20"></div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}