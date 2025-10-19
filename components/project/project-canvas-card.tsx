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
  onSelect: (project: Project, cardElement?: HTMLElement) => void;
  onImageZoom?: (project: Project) => void;
  onOpenProject?: (project: Project) => void;
  onHover?: (projectId: string | null) => void;
  scale: number;
  isOtherHovered?: boolean;
  isFocused?: boolean;
  isOtherFocused?: boolean;
  isImageZoomed?: boolean;
  galleryDirection?: "left" | "right" | "bottom";
  galleryVerticalPosition?: "above" | "below" | "centered";
  index: number;
}

export default function ProjectCanvasCard({
  project,
  onSelect,
  onImageZoom,
  onOpenProject,
  onHover,
  scale,
  isOtherHovered = false,
  isFocused = false,
  isOtherFocused = false,
  isImageZoomed = false,
  galleryDirection = "bottom",
  galleryVerticalPosition = "centered",
  index,
}: ProjectCanvasCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const galleryImageRefs = useRef<HTMLDivElement[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isTransitioningRef = useRef(false);

  const categoryColorClass = getCategoryStyle(project.category);
  // ✅ Pilih layout secara dinamis berdasarkan index proyek dengan safety check
  const selectedLayout =
    galleryLayouts[index % galleryLayouts.length] || galleryLayouts[0];

  // ✅ Hitung jumlah gambar yang akan ditampilkan (maksimal 3 untuk gallery, minimal 1)
  const imageCount = Math.min(
    3,
    Math.max(1, project.imageGallery?.length || 1)
  );

  const handleMouseEnter = () => {
    // Don't trigger hover animations if project is focused
    if (isFocused || isTransitioningRef.current) return;

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

    // Don't animate back if focused or transitioning (focused state should maintain its position)
    if (isFocused || isTransitioningRef.current) return;

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
  };

  // Handle focus and blur effects - ONLY for focus states, not hover
  useEffect(() => {
    if (isFocused) {
      // Set transition flag to prevent hover animations
      isTransitioningRef.current = true;

      // Kill animations for card, folder, title
      // BUT NOT gallery images - let them smoothly transition from hover position
      gsap.killTweensOf([cardRef.current, folderRef.current, titleRef.current]);
      if (paperRef.current?.children) {
        gsap.killTweensOf(Array.from(paperRef.current.children));
      }
      // DON'T kill gallery image animations - they will smoothly transition from current position

      // Animate gallery container position FIRST (synchronized with images)
      if (galleryContainerRef.current) {
        const containerTargetY =
          galleryVerticalPosition === "below"
            ? "-50%"
            : galleryVerticalPosition === "above"
            ? "-150%"
            : "-50%";

        gsap.to(galleryContainerRef.current, {
          x: "-50%",
          y: containerTargetY,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }

      // Project is focused - enlarge and highlight
      gsap.to(cardRef.current, {
        scale: scale * 1.2,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 100,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          // Clear transition flag after focus animation completes
          isTransitioningRef.current = false;
        },
      });

      // Transform gallery images from hover position to focus position
      if (galleryImageRefs.current.length > 0) {
        galleryImageRefs.current.slice(0, imageCount).forEach((img, idx) => {
          if (img) {
            // Clear any existing event handlers to prevent conflicts
            img.onmouseenter = null;
            img.onmouseleave = null;

            // Varied scales for creative look (different sizes)
            const scaleVariations = [1.6, 1.3, 1.5, 1.4];
            const baseScale =
              scaleVariations[idx % scaleVariations.length] || 1.4;

            // Subtle rotation for organic feel
            const rotationVariations = [-3, 2, -1, 4];
            const rotation =
              rotationVariations[idx % rotationVariations.length] || 0;

            // Calculate target position based on gallery direction
            let targetX = 0;
            let targetY = 0;
            const radius = 200;
            const angleSpread = 90;

            if (galleryDirection === "right") {
              const startAngle = -45;
              const angleStep = angleSpread / Math.max(1, imageCount - 1);
              const angle = startAngle + idx * angleStep;
              const radians = (angle * Math.PI) / 180;
              targetX = radius * Math.cos(radians) + 100;
              targetY = radius * Math.sin(radians) - 50;
            } else if (galleryDirection === "left") {
              const startAngle = 135;
              const angleStep = angleSpread / Math.max(1, imageCount - 1);
              const angle = startAngle + idx * angleStep;
              const radians = (angle * Math.PI) / 180;
              targetX = radius * Math.cos(radians) - 100;
              targetY = radius * Math.sin(radians) - 50;
            } else {
              const startAngle = 45;
              const angleStep = angleSpread / Math.max(1, imageCount - 1);
              const angle = startAngle + idx * angleStep;
              const radians = (angle * Math.PI) / 180;
              targetX = radius * Math.cos(radians);
              targetY = radius * Math.sin(radians) + 100;
            }

            // Smooth morph from current position (hover) to focus position
            // overwrite: true ensures smooth transition without reset
            gsap.to(img, {
              x: targetX,
              y: targetY,
              rotate: rotation,
              scale: baseScale,
              opacity: 1,
              duration: 0.6,
              ease: "power2.inOut",
              delay: idx * 0.04,
              overwrite: true, // Smoothly override hover animation
            });

            // Add smooth hover effects to gallery images when focused
            img.style.cursor = "pointer";
            img.onmouseenter = () => {
              gsap.to(img, {
                scale: baseScale * 1.15,
                rotate: rotation + (Math.random() - 0.5) * 6,
                y: targetY - 15, // Lift up on hover
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              });
              // Add glow effect on hover
              img.style.filter =
                "drop-shadow(0 15px 35px rgba(0,0,0,0.25)) drop-shadow(0 0 20px rgba(255,255,255,0.3))";
            };
            img.onmouseleave = () => {
              gsap.to(img, {
                scale: baseScale,
                rotate: rotation,
                y: targetY,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              });
              // Remove glow effect
              img.style.filter = "drop-shadow(0 10px 25px rgba(0,0,0,0.15))";
            };
          }
        });
      }

      // Transform papers inside folder to elegant scattered arrangement when focused
      if (paperRef.current?.children) {
        const papers = Array.from(paperRef.current.children).slice(
          0,
          imageCount
        );
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

      // Animate Open button entrance
      if (openButtonRef.current) {
        gsap.fromTo(
          openButtonRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)",
            delay: 0.3, // Appear after other animations
          }
        );
      }
    } else if (isOtherFocused) {
      // Another project is focused - make this one transparent and reset papers
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
        // Kill any existing animations first for immediate response
        gsap.killTweensOf(galleryImageRefs.current);

        // Use immediate set for instant reset, no animation conflicts
        gsap.set(galleryImageRefs.current, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotate: 0,
        });
      }

      // Reset papers to original positions when other project is focused
      if (paperRef.current?.children) {
        const papers = Array.from(paperRef.current.children).slice(
          0,
          imageCount
        );
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

      // Reset folder position when other project is focused
      gsap.to(folderRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });

      // Reset title when other project is focused
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true,
      });
    } else {
      // Set transition flag during unfocus
      isTransitioningRef.current = true;

      // Normal state - reset focus-related animations only
      gsap.to(cardRef.current, {
        scale: scale,
        zIndex: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          // Clear transition flag after unfocus animation completes
          isTransitioningRef.current = false;
        },
      });

      // Reset folder position when unfocusing
      gsap.to(folderRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });

      // Reset title when unfocusing
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true,
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

        // Kill any existing animations first for immediate response
        gsap.killTweensOf(galleryImageRefs.current);

        // Smooth exit animation - images move back into folder like reverse focus
        galleryImageRefs.current.slice(0, imageCount).forEach((img, idx) => {
          if (img) {
            // Calculate target position inside folder (like paper sheets)
            const targetX = 0; // Center of folder
            const targetY = 120; // Move down into folder area
            const targetRotation = -0.5 + idx * 0.4; // Same rotation as paper sheets

            // Single smooth animation: Move into folder and fade simultaneously
            gsap.to(img, {
              x: targetX,
              y: targetY,
              rotate: targetRotation,
              scale: 0, // Scale to 0 directly (no intermediate scale)
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              // No delay - all start immediately
              onComplete: () => {
                // Reset position after animation completes
                gsap.set(img, {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                });
              },
            });
          }
        });
      }

      // Return papers to original positions when not focused
      if (paperRef.current?.children) {
        const papers = Array.from(paperRef.current.children).slice(
          0,
          imageCount
        );
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
  }, [
    isFocused,
    isOtherFocused,
    scale,
    imageCount,
    selectedLayout,
    galleryDirection,
  ]);

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

  // Animate gallery container position with GSAP (smooth, no bounce)
  // This is now handled inside the main focus useEffect for better synchronization
  useEffect(() => {
    if (!galleryContainerRef.current) return;

    // Only handle unfocus state here
    if (!isFocused) {
      gsap.killTweensOf(galleryContainerRef.current);
      gsap.to(galleryContainerRef.current, {
        x: "-50%",
        y: "0%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isFocused, galleryVerticalPosition]);

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
    width: "280px",
    height: "200px",
    transform: `scale(${scale})`,
    transformOrigin: "center",
  };

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      className={`relative ${
        isOtherFocused ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      data-project-card={project.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project, cardRef.current || undefined)}
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

          {/* Open Button - Pojok kiri atas folder */}
          {isFocused && (
            <div className="absolute top-2 left-2" style={{ zIndex: 15 }}>
              <button
                ref={openButtonRef}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenProject) {
                    onOpenProject(project);
                  }
                }}
              >
                Open
              </button>
            </div>
          )}
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
                className="absolute bg-white border border-gray-300"
                style={{
                  top: "8px", // Small margin from folder top
                  left: "12px",
                  right: "12px",
                  bottom: "8px", // Small margin from folder bottom
                  borderRadius: "4px",
                  transform: `rotate(${-0.5 + index * 0.4}deg) translateY(${
                    index * -3
                  }px)`,
                  boxShadow: `
                    0 ${2 + index}px ${8 + index * 2}px rgba(0,0,0,0.06),
                    0 1px 3px rgba(0,0,0,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.8)
                  `,
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: "4px", // Full rounded corners
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFocused && isMainImage && onImageZoom) {
                      onImageZoom(project);
                    }
                  }}
                >
                  {imageUrl && (
                    <>
                      <Image
                        src={imageUrl}
                        alt={`${project.title} ${
                          index === 0 ? "main" : `gallery ${index}`
                        }`}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        } ${
                          isFocused
                            ? "hover:scale-105 transition-transform"
                            : ""
                        }`}
                        onLoad={() => index === 0 && setImageLoaded(true)}
                        onError={() => {
                          console.warn(`Failed to load image: ${imageUrl}`);
                          if (index === 0) setImageLoaded(true);
                        }}
                        sizes="300px"
                      />

                      {/* Subtle overlay for depth */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
                        }}
                      />

                      {/* Corner fold effect for top sheet */}
                      {index === 0 && (
                        <div
                          className="absolute top-0 right-0 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            background:
                              "linear-gradient(-45deg, transparent 46%, #e5e5e5 50%, #f5f5f5 54%)",
                            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Fallback for missing images */}
                  {!imageUrl && (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded opacity-50" />
                    </div>
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

      {/* Galeri Gambar Spasial - Pure GSAP animation (no CSS transition) */}
      <div
        ref={galleryContainerRef}
        className={`absolute left-1/2 w-[800px] flex justify-center items-center pointer-events-none ${
          isFocused ? "top-1/2 h-[600px]" : "-top-60 h-80"
        }`}
      >
        {Array.from({ length: imageCount }, (_, index) => {
          // Gunakan gambar dari imageGallery, fallback ke imageUrl untuk gambar utama
          const imgUrl =
            project.imageGallery?.[index] ||
            (index === 0 ? project.imageUrl : null);

          if (!imgUrl) return null;

          // Varied sizes for creative layout
          const sizeVariations = [
            { w: "w-36", h: "h-24" }, // Landscape
            { w: "w-28", h: "h-32" }, // Portrait
            { w: "w-32", h: "h-28" }, // Square-ish
            { w: "w-40", h: "h-28" }, // Wide
          ];
          const size = sizeVariations[index % sizeVariations.length] || {
            w: "w-32",
            h: "h-28",
          };

          return (
            <div
              key={index}
              ref={(el) => {
                if (el) galleryImageRefs.current[index] = el;
              }}
              className={`absolute ${size.w} ${size.h} bg-white rounded-2xl border-4 border-white shadow-2xl opacity-0`}
              style={{
                transform: "scale(0)",
                filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))",
                backdropFilter: "blur(10px)",
              }}
            >
              <Image
                src={imgUrl}
                alt={`${project.title} gallery image ${index + 1}`}
                fill
                className="object-cover rounded-xl"
                onError={() => {
                  console.warn(`Failed to load gallery image: ${imgUrl}`);
                }}
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
              onError={() => {
                console.warn(`Failed to load zoom image: ${project.imageUrl}`);
              }}
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
