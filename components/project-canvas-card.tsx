"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Project } from "@/types/portfolio";

// ... (getCategoryStyle function remains the same)
const getCategoryStyle = (category?: string) => {
  switch (category) {
    case "Web":
      return "from-cyan-300/0 via-cyan-400 to-cyan-300/0";
    case "Branding":
      return "from-fuchsia-400/0 via-fuchsia-500 to-fuchsia-400/0";
    case "Mobile":
      return "from-emerald-300/0 via-emerald-400 to-emerald-300/0";
    default:
      return "from-amber-300/0 via-amber-400 to-amber-300/0";
  }
};

// ✅ BARU: Beberapa variasi tata letak untuk galeri foto
const galleryLayouts = [
  // Layout 1: Menyebar
  [
    { x: 0, y: -65, rotate: -5 },
    { x: 80, y: -25, rotate: 12 },
    { x: -80, y: -15, rotate: -10 },
    { x: -5, y: 25, rotate: 8 },
  ],
  // Layout 2: Tumpukan Miring
  [
    { x: -30, y: -50, rotate: -15 },
    { x: 0, y: -30, rotate: -5 },
    { x: 30, y: -10, rotate: 15 },
    { x: 60, y: 10, rotate: 5 },
  ],
  // Layout 3: Formasi Vertikal
  [
    { x: 0, y: -70, rotate: 2 },
    { x: -30, y: -20, rotate: -8 },
    { x: 30, y: 20, rotate: 8 },
    { x: 0, y: 60, rotate: -2 },
  ],
];

interface ProjectCanvasCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  scale: number;
  isOtherHovered?: boolean;
  index: number; // ✅ BARU: Prop 'index' untuk memilih layout
}

export default function ProjectCanvasCard({
  project,
  onSelect,
  scale,
  isOtherHovered = false,
  index, // Terima prop 'index'
}: ProjectCanvasCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const galleryImageRefs = useRef<HTMLDivElement[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const categoryColorClass = getCategoryStyle(project.category);
  // ✅ Pilih layout secara dinamis berdasarkan index proyek dengan safety check
  const selectedLayout =
    galleryLayouts[index % galleryLayouts.length] || galleryLayouts[0];

  const handleMouseEnter = () => {
    setIsHovered(true);

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf([folderRef.current, titleRef.current]);
    if (paperRef.current?.children) {
      gsap.killTweensOf(Array.from(paperRef.current.children));
    }
    gsap.killTweensOf(galleryImageRefs.current);

    // Folder animation
    gsap.to(folderRef.current, {
      y: -8,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });

    // Papers animation
    if (paperRef.current?.children) {
      gsap.to(Array.from(paperRef.current.children), {
        y: -20,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.04,
        overwrite: true,
      });
    }

    // Title animation
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
      overwrite: true,
    });

    // Gallery images animation
    if (galleryImageRefs.current.length > 0 && selectedLayout) {
      galleryImageRefs.current.forEach((img, idx) => {
        if (img && selectedLayout[idx]) {
          const position = selectedLayout[idx];
          gsap.to(img, {
            x: position.x,
            y: position.y,
            rotate: position.rotate,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)",
            delay: 0.08 * idx,
            overwrite: true,
          });
        }
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf([folderRef.current, titleRef.current]);
    if (paperRef.current?.children) {
      gsap.killTweensOf(Array.from(paperRef.current.children));
    }
    gsap.killTweensOf(galleryImageRefs.current);

    // Folder return animation
    gsap.to(folderRef.current, {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });

    // Papers return animation
    if (paperRef.current?.children) {
      gsap.to(Array.from(paperRef.current.children), {
        y: 0,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.03,
        overwrite: true,
      });
    }

    // Title hide animation
    gsap.to(titleRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
    });

    // Gallery images hide animation
    gsap.to(galleryImageRefs.current, {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
      rotate: 0,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
    });
  };

  useEffect(() => {
    gsap.to(cardRef.current, {
      opacity: isOtherHovered && !isHovered ? 0.3 : 1,
      filter: isOtherHovered && !isHovered ? "blur(1px)" : "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isOtherHovered, isHovered]);

  const cardStyle = {
    position: "absolute" as const,
    left: project.x,
    top: project.y,
    width: project.width,
    height: project.height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
    >
      <div
        ref={folderRef}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* ... (Struktur folder tidak berubah) ... */}
        <div
          className="absolute w-full h-full bg-gray-50 border border-gray-300"
          style={{
            borderRadius: "2px 8px 8px 8px",
            boxShadow:
              "0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
            zIndex: 10,
          }}
        >
          <div className="absolute -top-2 left-6 w-16 h-6 bg-gray-100 rounded-t-md border border-gray-300 border-b-0" />
        </div>
        <div
          ref={paperRef}
          className="absolute top-1 left-0 right-0 h-full"
          style={{ zIndex: 20 }}
        >
          {Array.from(
            { length: Math.min(4, project.technologies.length) },
            (_, index) => {
              const isMainImage = index === 0;
              return (
                <div
                  key={index}
                  className="absolute top-0 left-3 right-5 h-20 bg-white border border-gray-200"
                  style={{
                    borderRadius: "2px",
                    transform: `rotate(${-0.5 + index * 0.4}deg) translateY(${
                      index * -2
                    }px)`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[2px]">
                    {isMainImage && (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className={`object-cover transition-opacity duration-500 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        sizes="300px"
                      />
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div
          className="absolute w-full h-full bg-gray-50 border border-t-0 border-gray-300"
          style={{
            height: "calc(100% - 28px)",
            bottom: "0",
            borderRadius: "0 0 8px 8px",
            zIndex: 30,
            boxShadow: "inset 0 6px 8px -4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r ${categoryColorClass}`}
          />
        </div>
      </div>

      {/* Galeri Gambar Spasial - Foto lebih besar */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-48 flex justify-center items-center pointer-events-none">
        {project.imageGallery?.slice(0, 4).map((imgUrl, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) galleryImageRefs.current[index] = el;
            }}
            // Foto diperbesar dari w-20 h-20 menjadi w-28 h-28
            className="absolute w-28 h-28 bg-white rounded-xl border-2 border-white shadow-xl opacity-0"
            style={{ transform: "scale(0)" }}
          >
            <Image
              src={imgUrl}
              alt={`Project gallery image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Project Title - Di bawah folder */}
      <div
        ref={titleRef}
        className="absolute -bottom-8 left-0 right-0 text-center opacity-0"
        style={{ transform: "translateY(-10px)" }}
      >
        <h3 className="font-serif text-lg font-semibold text-gray-800">
          {project.title}
        </h3>
      </div>
    </div>
  );
}
