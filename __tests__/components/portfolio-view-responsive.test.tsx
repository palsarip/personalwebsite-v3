import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PortfolioView from "@/components/views/portfolio-view";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { describe } from "node:test";

// Mock GSAP
jest.mock("gsap", () => ({
  gsap: {
    fromTo: jest.fn(),
    to: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock ProjectCanvasCard component
jest.mock("@/components/project/project-canvas-card", () => {
  return function MockProjectCanvasCard({
    project,
  }: {
    project: { id: string; title: string };
  }) {
    return (
      <div
        data-testid={`project-card-${project.id}`}
        data-project-card={project.id}
        className="canvas-project-card"
      >
        {project.title}
      </div>
    );
  };
});

// Mock ProjectModal component
jest.mock("@/components/project/project-modal", () => {
  return function MockProjectModal({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;
    return <div data-testid="project-modal">Modal</div>;
  };
});

// Mock ProjectSheet component
jest.mock("@/components/project/project-sheet", () => {
  return function MockProjectSheet({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;
    return <div data-testid="project-sheet">Sheet</div>;
  };
});

// Mock portfolio data
jest.mock("@/data/portfolio-data", () => ({
  portfolioProjects: [
    {
      id: "project-1",
      title: "Project 1",
      description: "Description 1",
      imageUrl: "/test1.jpg",
      category: "Web",
      technologies: ["React"],
      status: "completed",
      year: "2024",
      imageGallery: ["/test1.jpg"],
    },
    {
      id: "project-2",
      title: "Project 2",
      description: "Description 2",
      imageUrl: "/test2.jpg",
      category: "Mobile",
      technologies: ["React Native"],
      status: "completed",
      year: "2024",
      imageGallery: ["/test2.jpg"],
    },
    {
      id: "project-3",
      title: "Project 3",
      description: "Description 3",
      imageUrl: "/test3.jpg",
      category: "Design",
      technologies: ["Figma"],
      status: "completed",
      year: "2024",
      imageGallery: ["/test3.jpg"],
    },
  ],
}));

describe("PortfolioView - Responsive Behavior", () => {
  // Helper to set viewport size
  const setViewportSize = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event("resize"));
  };

  describe("9.1 Mobile Layout (< 768px)", () => {
    beforeEach(() => {
      // Set mobile viewport
      setViewportSize(375, 667);
    });

    it("should render with proper container structure", () => {
      render(<PortfolioView />);

      // Verify main container exists
      const mainContainer = screen.getByText("Portfolio").closest("div");
      expect(mainContainer).toBeInTheDocument();
    });

    it("should display 1 column grid on mobile", () => {
      const { container } = render(<PortfolioView />);

      // Find the grid container
      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("grid-cols-1");
    });

    it("should have proper spacing and padding on mobile", () => {
      const { container } = render(<PortfolioView />);

      // Find content container
      const contentContainer = container.querySelector(".max-w-7xl");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass("px-8");
      expect(contentContainer).toHaveClass("py-12");

      // Find grid container
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");
    });

    it("should center cards in mobile layout", () => {
      const { container } = render(<PortfolioView />);

      // Find grid container
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("justify-items-center");

      // Find grid item wrappers
      const gridItems = container.querySelectorAll(".w-full.max-w-sm");
      expect(gridItems.length).toBeGreaterThan(0);
      gridItems.forEach((item) => {
        expect(item).toHaveClass("w-full");
        expect(item).toHaveClass("max-w-sm");
      });
    });

    it("should have scrollable container for touch scrolling", () => {
      const { container } = render(<PortfolioView />);

      // Find scrollable container
      const scrollContainer = container.querySelector(".overflow-y-auto");
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass("w-full");
      expect(scrollContainer).toHaveClass("h-full");
    });

    it("should render all project cards in mobile layout", () => {
      const { container } = render(<PortfolioView />);

      // Find all project cards
      const projectCards = container.querySelectorAll("[data-project-card]");
      expect(projectCards.length).toBe(3);
    });

    it("should maintain proper header styling on mobile", () => {
      render(<PortfolioView />);

      const header = screen.getByText("Portfolio");
      expect(header).toHaveClass("text-6xl");
      expect(header).toHaveClass("font-serif");
      expect(header).toHaveClass("font-light");

      const subtitle = screen.getByText(/A curated collection/);
      expect(subtitle).toHaveClass("text-xl");
      expect(subtitle).toHaveClass("text-gray-600");
    });
  });

  describe("9.2 Tablet Layout (768px - 1024px)", () => {
    beforeEach(() => {
      // Set tablet viewport
      setViewportSize(768, 1024);
    });

    it("should display 2 column grid on tablet", () => {
      const { container } = render(<PortfolioView />);

      // Find the grid container
      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("md:grid-cols-2");
    });

    it("should have proper spacing between columns on tablet", () => {
      const { container } = render(<PortfolioView />);

      // Find grid container
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");
    });

    it("should maintain consistent card sizes on tablet", () => {
      const { container } = render(<PortfolioView />);

      // Find grid item wrappers
      const gridItems = container.querySelectorAll(".w-full.max-w-sm");
      expect(gridItems.length).toBeGreaterThan(0);

      // All items should have same classes
      gridItems.forEach((item) => {
        expect(item).toHaveClass("w-full");
        expect(item).toHaveClass("max-w-sm");
      });
    });

    it("should render all project cards in tablet layout", () => {
      const { container } = render(<PortfolioView />);

      const projectCards = container.querySelectorAll("[data-project-card]");
      expect(projectCards.length).toBe(3);
    });

    it("should maintain proper container padding on tablet", () => {
      const { container } = render(<PortfolioView />);

      const contentContainer = container.querySelector(".max-w-7xl");
      expect(contentContainer).toHaveClass("px-8");
      expect(contentContainer).toHaveClass("py-12");
    });
  });

  describe("9.3 Desktop Layout (> 1024px)", () => {
    beforeEach(() => {
      // Set desktop viewport
      setViewportSize(1440, 900);
    });

    it("should display 3 column grid on desktop", () => {
      const { container } = render(<PortfolioView />);

      // Find the grid container
      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });

    it("should center content with max-width container on desktop", () => {
      const { container } = render(<PortfolioView />);

      // Find content container
      const contentContainer = container.querySelector(".max-w-7xl");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass("max-w-7xl");
      expect(contentContainer).toHaveClass("mx-auto");
    });

    it("should have proper spacing and alignment on desktop", () => {
      const { container } = render(<PortfolioView />);

      // Find grid container
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");
      expect(gridContainer).toHaveClass("justify-items-center");

      // Find content container
      const contentContainer = container.querySelector(".max-w-7xl");
      expect(contentContainer).toHaveClass("px-8");
      expect(contentContainer).toHaveClass("py-12");
    });

    it("should render all project cards in desktop layout", () => {
      const { container } = render(<PortfolioView />);

      const projectCards = container.querySelectorAll("[data-project-card]");
      expect(projectCards.length).toBe(3);
    });

    it("should maintain consistent card dimensions on desktop", () => {
      const { container } = render(<PortfolioView />);

      // Find grid item wrappers
      const gridItems = container.querySelectorAll(".w-full.max-w-sm");
      expect(gridItems.length).toBe(3);

      // All items should have consistent classes
      gridItems.forEach((item) => {
        expect(item).toHaveClass("w-full");
        expect(item).toHaveClass("max-w-sm");
      });
    });

    it("should have proper header spacing on desktop", () => {
      const { container } = render(<PortfolioView />);

      const headerSection = container.querySelector(".text-center.mb-16");
      expect(headerSection).toBeInTheDocument();
      expect(headerSection).toHaveClass("mb-16");
    });
  });

  describe("Cross-breakpoint consistency", () => {
    it("should maintain same gap spacing across all breakpoints", () => {
      // Test mobile
      setViewportSize(375, 667);
      const { container: mobileContainer } = render(<PortfolioView />);
      let gridContainer = mobileContainer.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");

      // Test tablet
      setViewportSize(768, 1024);
      const { container: tabletContainer } = render(<PortfolioView />);
      gridContainer = tabletContainer.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");

      // Test desktop
      setViewportSize(1440, 900);
      const { container: desktopContainer } = render(<PortfolioView />);
      gridContainer = desktopContainer.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-12");
    });

    it("should maintain same card max-width across all breakpoints", () => {
      const breakpoints = [
        { width: 375, height: 667, name: "mobile" },
        { width: 768, height: 1024, name: "tablet" },
        { width: 1440, height: 900, name: "desktop" },
      ];

      breakpoints.forEach(({ width, height }) => {
        setViewportSize(width, height);
        const { container } = render(<PortfolioView />);

        const gridItems = container.querySelectorAll(".w-full.max-w-sm");
        expect(gridItems.length).toBeGreaterThan(0);

        gridItems.forEach((item) => {
          expect(item).toHaveClass("max-w-sm");
        });
      });
    });

    it("should maintain scrollable container across all breakpoints", () => {
      const breakpoints = [375, 768, 1440];

      breakpoints.forEach((width) => {
        setViewportSize(width, 900);
        const { container } = render(<PortfolioView />);

        const scrollContainer = container.querySelector(".overflow-y-auto");
        expect(scrollContainer).toBeInTheDocument();
        expect(scrollContainer).toHaveClass("w-full");
        expect(scrollContainer).toHaveClass("h-full");
      });
    });
  });
});
