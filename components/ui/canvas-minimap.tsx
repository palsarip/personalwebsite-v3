"use client";

import { useRef } from "react";
import { MinimapProps } from "@/types/portfolio";

export default function CanvasMinimap({
  viewport,
  canvasBounds,
  projects,
  onNavigate,
  viewportSize,
}: MinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);

  // Minimap dimensions
  const minimapWidth = 160;
  const minimapHeight = 100;

  // Scale factors
  const scaleX = minimapWidth / canvasBounds.maxX;
  const scaleY = minimapHeight / canvasBounds.maxY;

  // Current viewport rectangle
  const viewportRect = {
    x: Math.abs(viewport.x) * scaleX,
    y: Math.abs(viewport.y) * scaleY,
    width: (viewportSize.width / viewport.zoom) * scaleX,
    height: (viewportSize.height / viewport.zoom) * scaleY,
  };

  const handleMinimapClick = (e: React.MouseEvent) => {
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert minimap coordinates to canvas coordinates
    const canvasX = -(clickX / scaleX - viewportSize.width / 2);
    const canvasY = -(clickY / scaleY - viewportSize.height / 2);

    onNavigate(canvasX, canvasY);
  };

  return (
    <div className="minimap fixed top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3">
      <div className="mb-2">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Portfolio Map
        </h3>
      </div>

      <div
        ref={minimapRef}
        className="relative bg-gray-100 rounded-lg cursor-pointer overflow-hidden"
        style={{ width: minimapWidth, height: minimapHeight }}
        onClick={handleMinimapClick}
      >
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scaleX}px ${20 * scaleY}px`,
          }}
        />

        {/* Projects */}
        {/* Note: Minimap is deprecated in grid layout. Positioning properties (x, y, width, height) removed from Project type. */}
        {/* {projects.map((project) => (
          <div
            key={project.id}
            className={`absolute rounded-sm transition-colors ${
              project.featured
                ? "bg-blue-500 ring-1 ring-blue-300"
                : "bg-gray-400"
            }`}
            style={{
              left: project.x * scaleX,
              top: project.y * scaleY,
              width: Math.max(4, project.width * scaleX),
              height: Math.max(3, project.height * scaleY),
            }}
            title={project.title}
          />
        ))} */}

        {/* Current Viewport */}
        <div
          className="absolute border-2 border-red-500 bg-red-500/10 rounded-sm pointer-events-none"
          style={{
            left: Math.max(
              0,
              Math.min(minimapWidth - viewportRect.width, viewportRect.x)
            ),
            top: Math.max(
              0,
              Math.min(minimapHeight - viewportRect.height, viewportRect.y)
            ),
            width: Math.min(minimapWidth, viewportRect.width),
            height: Math.min(minimapHeight, viewportRect.height),
          }}
        />
      </div>

      {/* Stats */}
      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Projects:</span>
          <span className="font-medium">{projects.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Zoom:</span>
          <span className="font-medium">
            {Math.round(viewport.zoom * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
