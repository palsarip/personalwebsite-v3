"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import ProjectItem from './project-item';
import Window from './window';
import ProjectDetailContent from './project-detail-content';
import { projects, type Project } from '@/data/projects';

gsap.registerPlugin(Draggable);

const COLS = 2;
const CARD_WIDTH = 400;
const CARD_HEIGHT = 300;
const GAP = 40;
const GRID_WIDTH = COLS * (CARD_WIDTH + GAP);
const GRID_HEIGHT = Math.ceil(projects.length / COLS) * (CARD_HEIGHT + GAP);
const xSnap = CARD_WIDTH + GAP;
const ySnap = CARD_HEIGHT + GAP;

interface ProjectsViewProps {
  isInteractive: boolean;
  onProjectSelect: (project: Project) => void;
}

export default function ProjectsView({ isInteractive, onProjectSelect }: ProjectsViewProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragInstance = useRef<Draggable | null>(null);
  const isDragging = useRef(false);
  
  // Fixed velocity tracker type
  const velocityTracker = useRef({
    velocityX: 0,
    velocityY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    positions: [] as Array<{x: number, y: number, time: number}>
  });

  useEffect(() => {
    if (isInteractive) {
      dragInstance.current?.enable();
    } else {
      dragInstance.current?.disable();
    }
  }, [isInteractive]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const element = canvasRef.current;
    const container = containerRef.current;
    
    console.log('Setting up draggable on:', element);
    
    dragInstance.current = Draggable.create(element, {
      type: "x,y",
      inertia: false,
      trigger: container,
      cursor: "grab",
      
      onPress: function(e) {
        console.log('onPress triggered at:', e.clientX, e.clientY);
        gsap.killTweensOf(element);
        isDragging.current = false;
      },
      
      onDragStart: function(e) {
        console.log('onDragStart triggered');
        isDragging.current = true;
        gsap.killTweensOf(element);
        
        // Reset velocity tracker with proper property names
        const tracker = velocityTracker.current;
        tracker.positions = [];
        tracker.velocityX = 0;
        tracker.velocityY = 0;
        tracker.lastX = this.x;
        tracker.lastY = this.y;
        tracker.lastTime = performance.now();
        
        console.log('Drag started from position:', this.x, this.y);
      },
      
      onDrag: function() {
        if (!isDragging.current) return;
        
        const now = performance.now();
        const tracker = velocityTracker.current;
        
        tracker.positions.push({
          x: this.x,
          y: this.y,
          time: now
        });
        
        // Keep only recent positions (last 100ms worth)
        tracker.positions = tracker.positions.filter(pos => now - pos.time < 100);
        
        if (tracker.positions.length >= 2) {
          const recent = tracker.positions[tracker.positions.length - 1];
          const older = tracker.positions[0];
          const timeDiff = recent.time - older.time;
          
          if (timeDiff > 0) {
            tracker.velocityX = (recent.x - older.x) / timeDiff * 1000;
            tracker.velocityY = (recent.y - older.y) / timeDiff * 1000;
          }
        }
      },
      
      onDragEnd: function() {
        console.log('Drag ended');
        isDragging.current = false;
        
        const tracker = velocityTracker.current;
        const currentX = this.x;
        const currentY = this.y;
        
        // Calculate momentum
        const minVelocity = 50;
        const maxDistance = 300;
        const friction = 0.15;
        
        let momentumX = 0;
        let momentumY = 0;
        
        if (Math.abs(tracker.velocityX) > minVelocity) {
          momentumX = Math.min(Math.abs(tracker.velocityX) * friction, maxDistance) * Math.sign(tracker.velocityX);
        }
        
        if (Math.abs(tracker.velocityY) > minVelocity) {
          momentumY = Math.min(Math.abs(tracker.velocityY) * friction, maxDistance) * Math.sign(tracker.velocityY);
        }
        
        // Apply momentum
        if (Math.abs(momentumX) > 10 || Math.abs(momentumY) > 10) {
          console.log('Applying momentum:', momentumX, momentumY);
          gsap.to(element, {
            x: currentX + momentumX,
            y: currentY + momentumY,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto",
            onStart: function() {
              console.log('Momentum started');
            },
            onComplete: function() {
              console.log('Momentum completed');
              // Simple sync without read-only property assignment
              setTimeout(() => {
                if (dragInstance.current) {
                  dragInstance.current.update();
                  console.log('Draggable updated');
                }
              }, 50);
            }
          });
        }
      }
    })[0];

    // Set initial position
    gsap.set(element, { x: -GRID_WIDTH / 4, y: -GRID_HEIGHT / 4 });

    return () => {
      dragInstance.current?.kill();
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-screen h-screen overflow-hidden bg-[#F8F9FA] ${
        isInteractive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
      data-draggable-area="true"
    >
      <div
        ref={canvasRef}
        className={`relative w-full h-full ${!isInteractive ? 'pointer-events-none' : ''}`}
        style={{
          zIndex: 1
        }}
      >
        {[-3, -2, -1, 0, 1, 2, 3].map(rowOffset =>
          [-3, -2, -1, 0, 1, 2, 3].map(colOffset =>
            projects.map((project, index) => {
              const col = index % COLS;
              const row = Math.floor(index / COLS);
              const x = col * xSnap + (colOffset * GRID_WIDTH);
              const y = row * ySnap + (rowOffset * GRID_HEIGHT);
              return (
                <ProjectItem
                  key={`${project.id}-${rowOffset}-${colOffset}`}
                  project={project}
                  onSelect={() => onProjectSelect(project)}
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${y}px)`,
                    pointerEvents: !isInteractive ? 'none' : 'auto',
                    zIndex: 0
                  }}
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
}