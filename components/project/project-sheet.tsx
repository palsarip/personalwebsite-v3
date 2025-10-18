"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Project } from "@/types/portfolio";

interface ProjectSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSheet({
  project,
  isOpen,
  onClose,
}: ProjectSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      // Animate sheet sliding up from bottom
      gsap.fromTo(
        sheetRef.current,
        {
          y: "100%",
        },
        {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        }
      );

      // Animate overlay fade in
      gsap.fromTo(
        overlayRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        }
      );
    } else if (!isOpen && sheetRef.current) {
      // Animate sheet sliding down
      gsap.to(sheetRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power2.in",
      });

      // Animate overlay fade out
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isOpen, project]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-50 opacity-0"
        onClick={onClose}
      />

      {/* Full Page Sheet */}
      <div
        ref={sheetRef}
        className="fixed inset-0 bg-white z-50 overflow-hidden"
        style={{ transform: "translateY(100%)" }}
      >
        {/* Content with proper container */}
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-base text-gray-600">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {project.category}
                  </span>
                  <span className="font-medium">{project.year}</span>
                  <span className="capitalize px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                    {project.status}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Close (ESC)"
              >
                <svg
                  className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Project Image */}
            <div className="mb-8">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                About This Project
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-base font-medium border border-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-center py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
