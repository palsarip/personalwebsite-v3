"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import ProjectItem from "./project-item";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(Draggable);

const COLS = 2;
const CARD_WIDTH = 400;
const CARD_HEIGHT = 300;
const GAP = 40;

const TILE_WIDTH = COLS * (CARD_WIDTH + GAP);
const TILE_HEIGHT = Math.ceil(projects.length / COLS) * (CARD_HEIGHT + GAP);

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
  const dragInstance = useRef<Draggable[] | null>(null);

  useEffect(() => {
    if (dragInstance.current) {
      if (isInteractive) {
        dragInstance.current[0].enable();
      } else {
        dragInstance.current[0].disable();
      }
    }
  }, [isInteractive]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const element = canvasRef.current;
    const container = containerRef.current;

    // Posisikan kanvas agar tile tengah berada di viewport
    const startX = -TILE_WIDTH;
    const startY = -TILE_HEIGHT;
    gsap.set(element, { x: startX, y: startY });

    dragInstance.current = Draggable.create(element, {
      type: "x,y",
      trigger: container,
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
    });

    const checkBounds = () => {
      const dragger = dragInstance.current?.[0];
      if (!dragger) return;

      // --- LOGIKA DIPERBAIKI ---
      // Kita akan wrap jika kanvas bergeser lebih dari setengah lebar/tinggi tile dari titik tengah
      const thresholdX = TILE_WIDTH / 2;
      const thresholdY = TILE_HEIGHT / 2;

      // Untuk Debugging: Buka console browser Anda (F12)
      // console.log(`Current X: ${Math.round(dragger.x)}`);

      // Cek Sumbu X
      if (dragger.x > startX + thresholdX) {
        console.log("--- WRAP KIRI KE KANAN ---");
        gsap.set(element, { x: dragger.x - TILE_WIDTH });
        dragger.update(true); // 'true' berarti posisi disinkronkan tanpa memicu event
      } else if (dragger.x < startX - thresholdX) {
        console.log("--- WRAP KANAN KE KIRI ---");
        gsap.set(element, { x: dragger.x + TILE_WIDTH });
        dragger.update(true);
      }

      // Cek Sumbu Y
      if (dragger.y > startY + thresholdY) {
        console.log("--- WRAP ATAS KE BAWAH ---");
        gsap.set(element, { y: dragger.y - TILE_HEIGHT });
        dragger.update(true);
      } else if (dragger.y < startY - thresholdY) {
        console.log("--- WRAP BAWAH KE ATAS ---");
        gsap.set(element, { y: dragger.y + TILE_HEIGHT });
        dragger.update(true);
      }
    };

    gsap.ticker.add(checkBounds);

    return () => {
      gsap.ticker.remove(checkBounds);
      dragInstance.current?.[0].kill();
    };
  }, []);

  const tiles = Array.from({ length: 9 }).map((_, i) => ({
    row: Math.floor(i / 3),
    col: i % 3,
  }));

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-[#F8F9FA]"
    >
      <div ref={canvasRef} className="relative w-full h-full">
        {tiles.map(({ row, col }) =>
          projects.map((project, index) => {
            const projectCol = index % COLS;
            const projectRow = Math.floor(index / COLS);

            const x = col * TILE_WIDTH + projectCol * (CARD_WIDTH + GAP);
            const y = row * TILE_HEIGHT + projectRow * (CARD_HEIGHT + GAP);

            return (
              <ProjectItem
                key={`${project.id}-${row}-${col}`}
                project={project}
                onSelect={onProjectSelect}
                style={{
                  position: "absolute",
                  transform: `translate(${x}px, ${y}px)`,
                  pointerEvents: !isInteractive ? "none" : "auto",
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
