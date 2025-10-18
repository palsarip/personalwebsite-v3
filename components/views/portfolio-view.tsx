"use client";

import { useRef, useState, useEffect } from "react";

import { gsap } from "gsap";

import ProjectCanvasCard from "../project/project-canvas-card";

import ProjectModal from "../project/project-modal";

import ProjectSheet from "../project/project-sheet";

import { portfolioProjects } from "@/data/portfolio-data";

import { Project } from "@/types/portfolio";

export default function PortfolioView() {
  const hasAnimated = useRef(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetProject, setSheetProject] = useState<Project | null>(null);

  // Handle keyboard events (Escape to unfocus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        if (isImageZoomed) {
          // If image is zoomed, close zoom first
          setIsImageZoomed(false);
        } else if (focusedProjectId) {
          // If project is focused, unfocus it
          handleCloseFocus();
        }
        // Don't navigate to home - just unfocus
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedProjectId, isImageZoomed]);

  // Initial animation - run only once when component mounts

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;

      // Wait for next frame to ensure DOM is ready

      requestAnimationFrame(() => {
        gsap.fromTo(
          ".canvas-project-card",

          { opacity: 0, scale: 0.8, y: 20 },

          {
            opacity: 1,

            scale: 1,

            y: 0,

            duration: 0.8,

            ease: "power3.out",

            stagger: {
              amount: 1.5,

              from: "random",
            },
          }
        );
      });
    }
  }, []); // Empty dependency array - run only once

  const handleProjectSelect = (project: Project) => {
    if (focusedProjectId === project.id) {
      // If already focused, zoom to image
      setIsImageZoomed(true);
    } else if (focusedProjectId !== null) {
      // If another project is already focused, show visual feedback
      // User must unfocus first before focusing on another project

      // Find the currently focused project card and give it a subtle shake
      const focusedCard = document.querySelector(
        `[data-project-card="${focusedProjectId}"]`
      );
      if (focusedCard) {
        gsap.to(focusedCard, {
          x: "+=5",
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            gsap.set(focusedCard, { x: 0 });
          },
        });
      }
      return;
    } else {
      // Focus on project (enlarge image)
      setFocusedProjectId(project.id);
      setIsImageZoomed(false);

      // Scroll to project card smoothly
      const projectCard = document.querySelector(
        `[data-project-card="${project.id}"]`
      );
      if (projectCard) {
        // Check if smooth scroll is supported
        if ("scrollBehavior" in document.documentElement.style) {
          projectCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        } else {
          // Fallback for browsers without smooth scroll support
          projectCard.scrollIntoView({
            block: "center",
            inline: "center",
          });
        }
      }
    }
  };

  const handleImageZoom = (project: Project) => {
    setSelectedProject(project);

    setIsModalOpen(true);
  };

  const handleCloseFocus = () => {
    setFocusedProjectId(null);

    setIsImageZoomed(false);
  };

  const handleOpenProject = (project: Project) => {
    setSheetProject(project);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // Return to unfocus state when sheet is closed
    setFocusedProjectId(null);
    setIsImageZoomed(false);
    // Keep sheetProject for exit animation, will be cleared after animation
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

    setSelectedProject(null);
  };

  const handleProjectNavigation = (direction: "prev" | "next") => {
    if (!selectedProject) return;

    const currentIndex = portfolioProjects.findIndex(
      (p) => p.id === selectedProject.id
    );

    // Handle case where current project is not found

    if (currentIndex === -1) return;

    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : portfolioProjects.length - 1;
    } else {
      newIndex =
        currentIndex < portfolioProjects.length - 1 ? currentIndex + 1 : 0;
    }

    // Safely get the new project with bounds checking

    const newProject = portfolioProjects[newIndex];

    if (newProject) {
      setSelectedProject(newProject);
    }
  };

  return (
    <div className="w-screen min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Scrollable Container */}
      <div
        className="w-full min-h-screen overflow-y-auto cursor-default flex items-center justify-center"
        onClick={(e) => {
          // Close focus when clicking on empty area
          const target = e.target as HTMLElement;
          const isInteractiveElement =
            target.closest("[data-project-card]") ||
            target.closest("button") ||
            target.closest('[role="button"]') ||
            target.closest(".modal") ||
            target.closest("input") ||
            target.closest("select");

          if (focusedProjectId && !isInteractiveElement) {
            handleCloseFocus();
          }
        }}
      >
        {/* Content Container - Centered vertically and horizontally */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-30">
          {/* Header Section - Left Aligned, matches navbar text position */}
          <div className="text-left mb-14">
            <div>
              <h1 className="text-6xl font-serif font-light text-gray-800 tracking-wide mb-4 italic">
                Portfolio
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                A curated collection of my work, showcasing creativity and
                technical expertise
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {portfolioProjects.map((project, index) => (
              <div key={project.id} className="w-full max-w-sm">
                <ProjectCanvasCard
                  project={project}
                  onSelect={handleProjectSelect}
                  onImageZoom={handleImageZoom}
                  onOpenProject={handleOpenProject}
                  onHover={setHoveredProjectId}
                  scale={1}
                  isOtherHovered={
                    hoveredProjectId !== null && hoveredProjectId !== project.id
                  }
                  isFocused={focusedProjectId === project.id}
                  isOtherFocused={
                    focusedProjectId !== null && focusedProjectId !== project.id
                  }
                  isImageZoomed={
                    isImageZoomed && focusedProjectId === project.id
                  }
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onNavigate={handleProjectNavigation}
      />

      {/* Project Sheet - Slide up from bottom */}
      <ProjectSheet
        project={sheetProject}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
}
