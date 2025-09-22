"use client";

import { useRef, useState, memo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { type Project } from "@/data/projects";

export const GRID_UNIT = 200;
export const GAP = 20;

interface ProjectItemProps {
  project: Project;
  onSelect: (
    project: Project,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const ProjectItem = memo(function ProjectItem({
  project,
  onSelect,
}: ProjectItemProps) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const width = project.colSpan * GRID_UNIT + (project.colSpan - 1) * GAP;
  const height = project.rowSpan * GRID_UNIT + (project.rowSpan - 1) * GAP;

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const fallbackImageUrl = `data:image/svg+xml,...`; // Disingkat
  const isSmallCard = project.colSpan === 1 && project.rowSpan === 1;
  const typographyContainerClasses = isSmallCard
    ? "absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
    : "absolute bottom-0 left-0 p-8 text-left";
  const titleClasses = isSmallCard
    ? "text-xl font-serif font-normal italic mb-1"
    : "text-3xl font-serif font-normal italic mb-1";

  return (
    <button
      ref={cardRef}
      data-flip-id={project.id}
      onClick={(e) => onSelect(project, e)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden shadow-lg bg-gray-100"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {!imageError ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-110 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <Image
            src={fallbackImageUrl}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
      <div
        className={`${typographyContainerClasses} text-white opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0`}
      >
        <h3 className={titleClasses}>{project.title}</h3>
        <p className="text-sm font-sans font-light text-white/80 tracking-wider">
          {project.category}
        </p>
      </div>
    </button>
  );
});

export default ProjectItem;
