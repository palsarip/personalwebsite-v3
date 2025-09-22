"use client";

import { X } from "lucide-react";
import { type Project } from "@/data/projects";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useLayoutEffect, useRef, useEffect } from "react";

gsap.registerPlugin(Flip);

interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailView({
  project,
  onClose,
}: ProjectDetailViewProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const detailContentRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  // Handle FLIP animation when component mounts
  useLayoutEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Get stored flip state from window (set by ProjectsView)
    const flipState = (window as any).__flipState;
    const projectId = (window as any).__selectedProjectId;

    if (flipState && projectId === project.id) {
      // Perform FLIP animation
      Flip.from(flipState, {
        duration: 0.8,
        ease: "power2.inOut",
        scale: true,
        onComplete: () => {
          // Animate in the detail content after flip completes
          if (detailContentRef.current) {
            gsap.fromTo(
              detailContentRef.current,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
              }
            );
          }
        },
      });

      // Clean up stored state
      delete (window as any).__flipState;
      delete (window as any).__selectedProjectId;
    } else {
      // Fallback animation if no flip state
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            opacity: 0,
            scale: 0.95,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              if (detailContentRef.current) {
                gsap.fromTo(
                  detailContentRef.current,
                  {
                    opacity: 0,
                    y: 20,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                  }
                );
              }
            },
          }
        );
      }
    }
  }, [project.id]);

  // Handle close with FLIP back animation
  const handleClose = () => {
    if (detailContentRef.current) {
      // Fade out detail content first
      gsap.to(detailContentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // Capture current state for flip back
          const state = Flip.getState(`[data-flip-id="${project.id}"]`);

          // Call onClose to change view
          onClose();

          // Store state for ProjectsView to use (if needed)
          (window as any).__flipBackState = state;
          (window as any).__flipBackProjectId = project.id;
        },
      });
    } else {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] overflow-y-auto">
      <div ref={contentRef} className="max-w-5xl mx-auto p-4 sm:p-8">
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-md border rounded-full transition-all hover:scale-110 z-10 group"
        >
          <X className="w-6 h-6 text-slate-800 transition-transform group-hover:rotate-90" />
        </button>

        {/* This is the FLIP target - must have same data-flip-id as ProjectItem */}
        <div
          data-flip-id={project.id}
          className="relative w-full aspect-video rounded-xl overflow-hidden mt-16 shadow-lg"
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>

        {/* Detail content - will fade in after FLIP animation */}
        <div ref={detailContentRef} className="opacity-0">
          <h1 className="mt-8 text-5xl md:text-7xl font-serif font-bold text-slate-800 leading-tight">
            {project.title}
          </h1>
          <p className="mt-2 text-xl text-slate-500 font-light tracking-wide">
            {project.category}
          </p>

          {/* Project metadata */}
          {(project.year || project.client || project.services) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
              {project.year && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Year
                  </h3>
                  <p className="text-slate-600">{project.year}</p>
                </div>
              )}
              {project.client && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Client
                  </h3>
                  <p className="text-slate-600">{project.client}</p>
                </div>
              )}
              {project.services && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Services
                  </h3>
                  <p className="text-slate-600">
                    {project.services.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Project description */}
          {project.description && (
            <div className="mt-8 prose prose-lg max-w-none text-slate-600">
              <p className="text-lg leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Additional images if available */}
          {project.images && project.images.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-serif font-semibold text-slate-800 mb-6">
                Project Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md group"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call-to-action or additional info */}
          <div className="mt-16 p-8 bg-slate-50 rounded-xl">
            <h3 className="text-xl font-serif font-semibold text-slate-800 mb-3">
              Interested in working together?
            </h3>
            <p className="text-slate-600 mb-4">
              Let's discuss how we can bring your architectural vision to life.
            </p>
            <button className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
