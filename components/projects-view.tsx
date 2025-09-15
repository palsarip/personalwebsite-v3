"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import ProjectItem, { GRID_UNIT, GAP } from "./project-item";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(Draggable);

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
  const dragInstance = useRef<Draggable[] | null>(null);
  const isInteractiveRef = useRef(isInteractive);

  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    if (dragInstance.current?.[0]) {
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

    const startX = -TILE_WIDTH;
    const startY = -TILE_HEIGHT;
    gsap.set(element, { x: startX, y: startY });

    position.current = { x: startX, y: startY };
    target.current = { x: startX, y: startY };

    dragInstance.current = Draggable.create(element, {
      type: "x,y",
      trigger: container,
      inertia: {
        resistance: 750,
      },
      cursor: "grab",
      activeCursor: "grabbing",
      onDrag: function () {
        target.current.x = this.x;
        target.current.y = this.y;
      },
      onThrowUpdate: function () {
        target.current.x = this.x;
        target.current.y = this.y;
      },
    });

    const onWheel = (event: WheelEvent) => {
      if (!isInteractiveRef.current) return;
      event.preventDefault();

      // --- PERBAIKAN DI SINI: Kecepatan berbeda untuk setiap sumbu ---
      const horizontalScrollSpeed = 1.5;
      const verticalScrollSpeed = 0.8; // Lebih kecil untuk menyeimbangkan

      target.current.x -= event.deltaX * horizontalScrollSpeed;
      target.current.y -= event.deltaY * verticalScrollSpeed;
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    const checkBounds = () => {
      const dragger = dragInstance.current?.[0];
      if (!dragger) return;
      const thresholdX = TILE_WIDTH / 2;
      const thresholdY = TILE_HEIGHT / 2;

      if (dragger.x > startX + thresholdX) {
        const newX = dragger.x - TILE_WIDTH;
        gsap.set(element, { x: newX });
        dragger.update(true);
        position.current.x = newX;
        target.current.x -= TILE_WIDTH;
      } else if (dragger.x < startX - thresholdX) {
        const newX = dragger.x + TILE_WIDTH;
        gsap.set(element, { x: newX });
        dragger.update(true);
        position.current.x = newX;
        target.current.x += TILE_WIDTH;
      }
      if (dragger.y > startY + thresholdY) {
        const newY = dragger.y - TILE_HEIGHT;
        gsap.set(element, { y: newY });
        dragger.update(true);
        position.current.y = newY;
        target.current.y -= TILE_HEIGHT;
      } else if (dragger.y < startY - thresholdY) {
        const newY = dragger.y + TILE_HEIGHT;
        gsap.set(element, { y: newY });
        dragger.update(true);
        position.current.y = newY;
        target.current.y += TILE_HEIGHT;
      }
    };

    const update = () => {
      const dragger = dragInstance.current?.[0];
      if (!dragger) return;

      if (dragger.isDragging || dragger.isThrowing) {
        position.current.x = dragger.x;
        position.current.y = dragger.y;
        return;
      }

      const damping = 0.025;
      position.current.x += (target.current.x - position.current.x) * damping;
      position.current.y += (target.current.y - position.current.y) * damping;

      gsap.set(element, { x: position.current.x, y: position.current.y });
      dragger.update(true);

      checkBounds();
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      dragInstance.current?.[0].kill();
      container.removeEventListener("wheel", onWheel);
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
          projects.map((project) => {
            const projectCol = project.colStart - 1;
            const projectRow = project.rowStart - 1;
            const x = col * (TILE_WIDTH + GAP) + projectCol * (GRID_UNIT + GAP);
            const y =
              row * (TILE_HEIGHT + GAP) + projectRow * (GRID_UNIT + GAP);

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
