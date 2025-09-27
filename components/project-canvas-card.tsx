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
  onImageZoom?: (project: Project) => void;
  onHover?: (projectId: string | null) => void;
  scale: number;
  isOtherHovered?: boolean;
  isFocused?: boolean;
  isOtherFocused?: boolean;
  isImageZoomed?: boolean;
  index: number;
}

export default function ProjectCanvasCard({
  project,
  onSelect,
  onImageZoom,
  onHover,
  scale,
  isOtherHovered = false,
  isFocused = false,
  isOtherFocused = false,
  isImageZoomed = false,
  index,
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

  // ✅ Hitung jumlah gambar yang akan ditampilkan (maksimal 4, minimal 1)
  const imageCount = Math.min(
    4,
    Math.max(1, project.imageGallery?.length || 1)
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(project.id);

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf([folderRef.current, titleRef.current]);
    if (paperRef.current?.children) {
      gsap.killTweensOf(Array.from(paperRef.current.children));
    }
    gsap.killTweensOf(galleryImageRefs.current);

    // Folder animation - always animate on hover
    gsap.to(folderRef.current, {
      y: -8,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });

    // Papers animation - animate unless focused (focused has different animation)
    if (paperRef.current?.children && !isFocused) {
      gsap.to(Array.from(paperRef.current.children), {
        y: -20,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.04,
        overwrite: true,
      });
    }

    // Title animation - always show on hover
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
      overwrite: true,
    });

    // Gallery images animation - show unless focused (focused has different layout)
    if (galleryImageRefs.current.length > 0 && selectedLayout && !isFocused) {
      galleryImageRefs.current.slice(0, imageCount).forEach((img, idx) => {
        if (img && selectedLayout[idx]) {
          const position = selectedLayout[idx];
          gsap.to(img, {
            x: position.x,
            y: position.y,
            rotate: position.rotate,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.06 * idx,
            overwrite: true,
          });
        }
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf([folderRef.current, titleRef.current]);
    if (paperRef.current?.children) {
      gsap.killTweensOf(Array.from(paperRef.current.children));
    }
    gsap.killTweensOf(galleryImageRefs.current);

    // Only animate back if not focused (focused state should maintain its position)
    if (!isFocused) {
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
          duration: 0.4,
          ease: "power2.out",
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
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    }
  };

  // Handle focus and blur effects - ONLY for focus states, not hover
  useEffect(() => {
    if (isFocused) {
      // Kill all existing animations first to prevent conflicts
      gsap.killTweensOf([cardRef.current, folderRef.current, titleRef.current]);
      if (paperRef.current?.children) {
        gsap.killTweensOf(Array.from(paperRef.current.children));
      }
      gsap.killTweensOf(galleryImageRefs.current);

      // Project is focused - enlarge and highlight
      gsap.to(cardRef.current, {
        scale: scale * 1.2,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 100,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });

      // Transform gallery images to spatial horizontal layout when focused
      if (galleryImageRefs.current.length > 0) {
        galleryImageRefs.current.forEach((img, idx) => {
          if (img) {
            // Clear any existing event handlers to prevent conflicts
            img.onmouseenter = null;
            img.onmouseleave = null;

            // Horizontal layout: spread images with more spacing
            const spacing = 160;
            const totalWidth = (galleryImageRefs.current.length - 1) * spacing;
            const startX = -totalWidth / 2;

            gsap.to(img, {
              x: startX + idx * spacing,
              y: -100,
              rotate: 0,
              scale: 1.4,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              delay: idx * 0.08,
              overwrite: true,
            });

            // Add smooth hover effects to gallery images when focused
            img.style.cursor = "pointer";
            img.onmouseenter = () => {
              gsap.to(img, {
                scale: 1.55,
                rotate: (Math.random() - 0.5) * 8, // Smoother random rotation
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
              });
            };
            img.onmouseleave = () => {
              gsap.to(img, {
                scale: 1.4,
                rotate: 0,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
              });
            };
          }
        });
      }

      // Transform papers inside folder to elegant scattered arrangement when focused
      if (paperRef.current?.children) {
        const papers = Array.from(paperRef.current.children);
        papers.forEach((paper, idx) => {
          // Elegant scattered positions - structured but organic
          const positions = [
            { x: -15, y: -40, rotate: -8 },
            { x: 25, y: -35, rotate: 12 },
            { x: -35, y: -25, rotate: -15 },
            { x: 45, y: -20, rotate: 18 },
          ];

          const position = positions[idx] || { x: 0, y: -30, rotate: 0 };

          gsap.to(paper, {
            x: position.x,
            y: position.y,
            rotate: position.rotate,
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out",
            delay: idx * 0.08,
            overwrite: true,
          });
        });
      }
    } else if (isOtherFocused) {
      // Another project is focused - make this one transparent
      gsap.to(cardRef.current, {
        scale: scale,
        opacity: 0.2,
        filter: "blur(2px)",
        zIndex: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Hide gallery images when other project is focused
      if (galleryImageRefs.current.length > 0) {
        gsap.to(galleryImageRefs.current, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotate: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    } else {
      // Normal state - reset focus-related animations only
      gsap.to(cardRef.current, {
        scale: scale,
        zIndex: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Return gallery images to hidden state when not focused
      if (galleryImageRefs.current.length > 0) {
        // Clear hover event handlers
        galleryImageRefs.current.forEach((img) => {
          if (img) {
            img.onmouseenter = null;
            img.onmouseleave = null;
            img.style.cursor = "default";
          }
        });

        gsap.to(galleryImageRefs.current, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotate: 0,
          duration: 0.25,
          ease: "power2.in",
          overwrite: true,
        });
      }

      // Return papers to original positions when not focused
      if (paperRef.current?.children) {
        const papers = Array.from(paperRef.current.children);
        papers.forEach((paper, idx) => {
          gsap.to(paper, {
            x: 0,
            y: 0,
            rotate: -0.5 + idx * 0.4, // Original rotation
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            delay: idx * 0.03,
            overwrite: true,
          });
        });
      }
    }
  }, [isFocused, isOtherFocused, scale]);

  // Handle hover transparency effects separately
  useEffect(() => {
    if (!isFocused && !isOtherFocused) {
      if (isOtherHovered && !isHovered) {
        // Other project is hovered - make this one transparent
        gsap.to(cardRef.current, {
          opacity: 0.3,
          filter: "blur(1px)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Normal state - full opacity
        gsap.to(cardRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [isOtherHovered, isHovered, isFocused, isOtherFocused]);

  // Handle image zoom state
  useEffect(() => {
    if (isImageZoomed && isFocused) {
      // Show enlarged image overlay
      const imageContainer = document.querySelector(
        `#image-zoom-${project.id}`
      );
      if (imageContainer) {
        gsap.fromTo(
          imageContainer,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }, [isImageZoomed, isFocused, project.id]);

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
          {Array.from({ length: imageCount }, (_, index) => {
            const isMainImage = index === 0;
            // Gunakan gambar dari imageGallery, fallback ke imageUrl untuk gambar utama
            const imageUrl =
              project.imageGallery?.[index] ||
              (isMainImage ? project.imageUrl : null);

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
                <div
                  className="relative w-full h-full overflow-hidden rounded-[2px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFocused && isMainImage) {
                      onImageZoom && onImageZoom(project);
                    }
                  }}
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={`${project.title} ${
                        index === 0 ? "main" : `gallery ${index}`
                      }`}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      } ${
                        isFocused ? "hover:scale-105 transition-transform" : ""
                      }`}
                      onLoad={() => index === 0 && setImageLoaded(true)}
                      sizes="300px"
                    />
                  )}
                </div>
              </div>
            );
          })}
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
        {Array.from({ length: imageCount }, (_, index) => {
          // Gunakan gambar dari imageGallery, fallback ke imageUrl untuk gambar utama
          const imgUrl =
            project.imageGallery?.[index] ||
            (index === 0 ? project.imageUrl : null);

          if (!imgUrl) return null;

          return (
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
                alt={`${project.title} gallery image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          );
        })}
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

      {/* Image Zoom Overlay */}
      {isImageZoomed && isFocused && (
        <div
          id={`image-zoom-${project.id}`}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => onImageZoom && onImageZoom(project)}
        >
          <div className="relative max-w-4xl max-h-4xl w-full h-full p-8">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Handle close zoom
              }}
            >
              ✕
            </button>

            {/* Project Info */}
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-2xl font-serif font-bold mb-2">
                {project.title}
              </h2>
              <p className="text-gray-300 max-w-md">{project.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
