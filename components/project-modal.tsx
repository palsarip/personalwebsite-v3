"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Code,
  Globe,
} from "lucide-react";
import { gsap } from "gsap";
import { ProjectModalProps } from "@/types/portfolio";

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onNavigate,
}: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && project) {
      // Entrance animation
      gsap.set(modalRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.9, y: 50 });

      const tl = gsap.timeline();
      tl.to(modalRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }).to(
        contentRef.current,
        { scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.1"
      );
    }
  }, [isOpen, project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (onNavigate) onNavigate("prev");
          break;
        case "ArrowRight":
          if (onNavigate) onNavigate("next");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, {
      scale: 0.9,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
    })
      .to(
        modalRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.1"
      )
      .call(() => onClose());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-yellow-600 bg-yellow-50";
      case "concept":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "concept":
        return "Concept";
      default:
        return status;
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Project Info Overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusText(project.status)}
                </div>
                {project.featured && (
                  <div className="bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    ⭐ Featured
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-serif font-bold mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-white/90">{project.category}</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate("prev")}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate("next")}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-8 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Project
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Year</div>
                      <div className="font-medium">{project.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{project.category}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium">
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technologies</span>
                    <span className="font-medium">
                      {project.technologies.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{project.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
