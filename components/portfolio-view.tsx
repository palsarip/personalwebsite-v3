"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import ProjectCanvasCard from "./project-canvas-card";
import ProjectModal from "./project-modal";
import CanvasMinimap from "./canvas-minimap";
import { portfolioProjects, canvasBounds } from "@/data/portfolio-data";
import { Project, CanvasViewport } from "@/types/portfolio";

gsap.registerPlugin(Draggable);

export default function PortfolioView() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragInstance = useRef<any>(null);
  const hasAnimated = useRef(false);

  const [viewport, setViewport] = useState<CanvasViewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Zoom constraints
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.0;

  // Update viewport size
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  // Calculate canvas bounds with generous padding for infinite feel
  const getConstrainedPosition = useCallback(
    (x: number, y: number, zoom: number = viewport.zoom) => {
      const padding = 500; // More generous padding
      const scaledCanvasWidth = canvasBounds.maxX * zoom;
      const scaledCanvasHeight = canvasBounds.maxY * zoom;

      // Allow more freedom - only constrain when really far out
      const maxX = padding;
      const minX = viewportSize.width - scaledCanvasWidth - padding;
      const maxY = padding;
      const minY = viewportSize.height - scaledCanvasHeight - padding;

      // Only apply constraints if really far outside reasonable bounds
      const constrainedX = x < minX - 300 ? minX : x > maxX + 300 ? maxX : x;
      const constrainedY = y < minY - 300 ? minY : y > maxY + 300 ? maxY : y;

      return {
        x: constrainedX,
        y: constrainedY,
      };
    },
    [viewportSize, viewport.zoom]
  );

  // Zoom functionality
  const handleZoom = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, viewport.zoom + delta)
      );
      if (newZoom === viewport.zoom) return;

      const zoomCenter = {
        x: centerX ?? viewportSize.width / 2,
        y: centerY ?? viewportSize.height / 2,
      };

      // Calculate new position to zoom towards the center point
      const zoomFactor = newZoom / viewport.zoom;
      const newX = zoomCenter.x - (zoomCenter.x - viewport.x) * zoomFactor;
      const newY = zoomCenter.y - (zoomCenter.y - viewport.y) * zoomFactor;

      const constrainedPos = getConstrainedPosition(newX, newY, newZoom);

      setViewport({
        x: constrainedPos.x,
        y: constrainedPos.y,
        zoom: newZoom,
      });

      // Update GSAP draggable position and scale smoothly
      if (canvasRef.current && dragInstance.current) {
        gsap.to(canvasRef.current, {
          x: constrainedPos.x,
          y: constrainedPos.y,
          scale: newZoom,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            dragInstance.current.update();
          },
        });
      }
    },
    [viewport, viewportSize, getConstrainedPosition, MIN_ZOOM, MAX_ZOOM]
  );

  // Navigate to specific position (for minimap)
  const navigateToPosition = useCallback(
    (x: number, y: number) => {
      const constrainedPos = getConstrainedPosition(x, y);

      setViewport((prev) => ({
        ...prev,
        x: constrainedPos.x,
        y: constrainedPos.y,
      }));

      // Animate to new position
      if (canvasRef.current && dragInstance.current) {
        gsap.to(canvasRef.current, {
          x: constrainedPos.x,
          y: constrainedPos.y,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => {
            dragInstance.current.update();
          },
        });
      }
    },
    [getConstrainedPosition]
  );

  // Setup draggable canvas and zoom
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Clean up existing draggable instance
    if (dragInstance.current) {
      dragInstance.current.kill();
    }

    // Set initial canvas transform
    gsap.set(canvasRef.current, {
      x: viewport.x,
      y: viewport.y,
      scale: viewport.zoom,
    });

    // Create draggable without restrictive bounds
    dragInstance.current = Draggable.create(canvasRef.current, {
      type: "x,y",
      trigger: containerRef.current,
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      // Remove bounds to allow free dragging
      onDrag: function () {
        // Update viewport state without triggering re-render conflicts
        setViewport((prev) => ({
          ...prev,
          x: this.x,
          y: this.y,
        }));
      },
      onThrowUpdate: function () {
        setViewport((prev) => ({
          ...prev,
          x: this.x,
          y: this.y,
        }));
      },
      onThrowComplete: function () {
        // Apply gentle constraints only after throw is complete
        const constrainedPos = getConstrainedPosition(this.x, this.y);
        if (
          Math.abs(constrainedPos.x - this.x) > 50 ||
          Math.abs(constrainedPos.y - this.y) > 50
        ) {
          gsap.to(canvasRef.current, {
            x: constrainedPos.x,
            y: constrainedPos.y,
            duration: 0.5,
            ease: "power2.out",
          });
          setViewport((prev) => ({
            ...prev,
            x: constrainedPos.x,
            y: constrainedPos.y,
          }));
        }
      },
    })[0];

    return () => {
      if (dragInstance.current) {
        dragInstance.current.kill();
        dragInstance.current = null;
      }
    };
  }, [viewportSize.width, viewportSize.height, getConstrainedPosition]);

  // Separate effect for wheel zoom to avoid conflicts
  useEffect(() => {
    if (!containerRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta, e.clientX, e.clientY);
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleZoom]);

  // Initial animation - run only once when component mounts
  useEffect(() => {
    if (!hasAnimated.current && canvasRef.current) {
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
    setSelectedProject(project);
    setIsModalOpen(true);
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
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: canvasBounds.maxX,
            height: canvasBounds.maxY,
            willChange: "transform",
          }}
        >
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Projects */}
          {portfolioProjects.map(
            (
              project,
              index // ✅ 1. Tambahkan 'index' di sini
            ) => (
              <div
                key={project.id}
                className="canvas-project-card"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <ProjectCanvasCard
                  project={project}
                  onSelect={handleProjectSelect}
                  scale={viewport.zoom}
                  isOtherHovered={
                    hoveredProjectId !== null && hoveredProjectId !== project.id
                  }
                  index={index} // ✅ 2. Kirim 'index' sebagai prop
                />
              </div>
            )
          )}

          {/* Canvas Title */}
          <div className="absolute top-20 left-20">
            <h1 className="text-6xl font-serif font-light text-gray-800/80 tracking-wide pointer-events-none">
              Portfolio
            </h1>
            <p className="text-lg text-gray-600/80 mt-2 max-w-md pointer-events-none">
              Drag to explore my collection of projects
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="fixed bottom-6 left-6 text-sm text-gray-500 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
          Drag to explore • Scroll to zoom • Click projects for details
        </div>
      </div>

      {/* Minimap */}
      <CanvasMinimap
        viewport={viewport}
        canvasBounds={canvasBounds}
        projects={portfolioProjects}
        onNavigate={navigateToPosition}
        viewportSize={viewportSize}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onNavigate={handleProjectNavigation}
      />
    </div>
  );
}
