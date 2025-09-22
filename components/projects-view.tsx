"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import ProjectItem, { GRID_UNIT, GAP } from "./project-item";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(Draggable);

// Konfigurasi Bento Grid
const BENTO_COLS = 4;
const BENTO_ROWS = 3;
const TILE_WIDTH = BENTO_COLS * GRID_UNIT + (BENTO_COLS - 1) * GAP;
const TILE_HEIGHT = BENTO_ROWS * GRID_UNIT + (BENTO_ROWS - 1) * GAP;

interface ProjectsViewProps {
  isInteractive: boolean;
  onProjectSelect: (project: Project) => void;
}

export default function ProjectsView({
  isInteractive,
  onProjectSelect,
}: ProjectsViewProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragInstance = useRef<Draggable | null>(null);

  // State untuk me-render ulang grid saat ukuran window berubah
  const [tiles, setTiles] = useState<{ row: number; col: number }[]>([]);

  useEffect(() => {
    // Fungsi untuk menghitung ulang jumlah tile yang dibutuhkan
    const recomputeGrid = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spanX = TILE_WIDTH + GAP;
      const spanY = TILE_HEIGHT + GAP;
      const colsNeeded = Math.ceil(viewportWidth / spanX) + 2;
      const rowsNeeded = Math.ceil(viewportHeight / spanY) + 2;
      const cols = Math.max(3, colsNeeded);
      const rows = Math.max(3, rowsNeeded);
      setTiles(
        Array.from({ length: cols * rows }).map((_, i) => ({
          row: Math.floor(i / cols),
          col: i % cols,
        }))
      );
    };

    recomputeGrid();
    window.addEventListener("resize", recomputeGrid);
    return () => window.removeEventListener("resize", recomputeGrid);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Logika Draggable yang lebih sederhana dan stabil
    dragInstance.current = Draggable.create(canvasRef.current, {
      type: "x,y",
      trigger: containerRef.current,
      inertia: true, // Gunakan inertia bawaan GSAP untuk efek "lempar"
      cursor: "grab",
      activeCursor: "grabbing",
    })[0];

    // Animasi masuk untuk semua item proyek
    gsap.from(".project-item-wrapper", {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
    });

    return () => {
      dragInstance.current?.kill();
    };
  }, [tiles]); // Jalankan ulang Draggable jika jumlah tile berubah

  useEffect(() => {
    // Enable/disable drag saat modal muncul/hilang
    if (dragInstance.current) {
      isInteractive
        ? dragInstance.current.enable()
        : dragInstance.current.disable();
    }
  }, [isInteractive]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-[#F8F9FA]"
    >
      <div ref={canvasRef} className="relative w-full h-full">
        {tiles.map(({ row, col }) =>
          projects.map((project) => {
            const projectCol = project.colStart - 1;
            const projectRow = project.rowStart - 1;
            const x = col * (TILE_WIDTH + GAP) + projectCol * (GRID_UNIT + GAP);
            const y =
              row * (TILE_HEIGHT + GAP) + projectRow * (GRID_UNIT + GAP);

            return (
              <div
                key={`${project.id}-${row}-${col}`}
                className="project-item-wrapper"
                style={{
                  position: "absolute",
                  transform: `translate(${x}px, ${y}px)`,
                  pointerEvents: !isInteractive ? "none" : "auto",
                }}
              >
                <ProjectItem
                  project={project}
                  onSelect={() => onProjectSelect(project)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
