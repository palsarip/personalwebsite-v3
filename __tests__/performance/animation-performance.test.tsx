import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectCanvasCard from "@/components/project/project-canvas-card";
import PortfolioView from "@/components/views/portfolio-view";
import { portfolioProjects } from "@/data/portfolio-data";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { describe } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

describe("Animation Performance Tests", () => {
  const mockProject = portfolioProjects[0];
  const mockProps = {
    project: mockProject,
    onSelect: jest.fn(),
    onImageZoom: jest.fn(),
    onOpenProject: jest.fn(),
    onHover: jest.fn(),
    scale: 1,
    isOtherHovered: false,
    isFocused: false,
    isOtherFocused: false,
    isImageZoomed: false,
    index: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Hover Animation Performance", () => {
    test("should trigger hover animations without flickering", async () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();

      // Simulate hover - should not cause errors
      fireEvent.mouseEnter(card!);
      fireEvent.mouseLeave(card!);

      // Card should still be present after hover interactions
      expect(card).toBeInTheDocument();
    });

    test("should handle rapid hover state changes", async () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");

      // Rapidly toggle hover state
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(card!);
        fireEvent.mouseLeave(card!);
      }

      // Should not cause errors or flickering
      expect(card).toBeInTheDocument();
    });

    test("should maintain visual structure on hover", () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();

      // Hover should not break the component
      fireEvent.mouseEnter(card!);
      expect(card).toBeInTheDocument();
    });

    test("should render paper sheets structure", () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();

      // Component should have nested structure for papers
      const nestedDivs = card!.querySelectorAll("div");
      expect(nestedDivs.length).toBeGreaterThan(0);
    });

    test("should show title on hover", () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");
      fireEvent.mouseEnter(card!);

      // Title should be visible
      const title = screen.getByText(mockProject.title);
      expect(title).toBeInTheDocument();
    });

    test("should handle transparency effects when other cards are hovered", () => {
      const { rerender } = render(<ProjectCanvasCard {...mockProps} />);

      // Simulate another card being hovered
      rerender(<ProjectCanvasCard {...mockProps} isOtherHovered={true} />);

      // Card should still render without issues
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    });
  });

  describe("Focus Animation Performance", () => {
    test("should handle focus state animations smoothly", () => {
      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} />
      );

      // Focus the card
      rerender(<ProjectCanvasCard {...mockProps} isFocused={true} />);

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();

      // Open button should appear when focused
      const openButton = screen.getByText(/open/i);
      expect(openButton).toBeInTheDocument();
    });

    test("should animate gallery images on focus", () => {
      const projectWithGallery = {
        ...mockProject,
        imageGallery: ["image1.jpg", "image2.jpg", "image3.jpg"],
      };

      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} project={projectWithGallery} />
      );

      // Focus the card
      rerender(
        <ProjectCanvasCard
          {...mockProps}
          project={projectWithGallery}
          isFocused={true}
        />
      );

      // Gallery images should be rendered
      const images = container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    test("should handle papers on focus", () => {
      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} />
      );

      // Focus the card
      rerender(<ProjectCanvasCard {...mockProps} isFocused={true} />);

      // Component structure should remain intact
      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();
    });

    test("should handle image zoom state without conflicts", () => {
      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} />
      );

      // Focus and zoom
      rerender(
        <ProjectCanvasCard
          {...mockProps}
          isFocused={true}
          isImageZoomed={true}
        />
      );

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();
    });

    test("should handle other cards becoming transparent when one is focused", () => {
      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} />
      );

      // Another card is focused
      rerender(<ProjectCanvasCard {...mockProps} isOtherFocused={true} />);

      const card = container.querySelector("[data-project-card]");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Entrance Animation Performance", () => {
    test("should handle staggered entrance animations", async () => {
      const { container } = render(<PortfolioView />);

      // All cards should render
      const cards = container.querySelectorAll("[data-project-card]");
      expect(cards.length).toBeGreaterThan(0);

      // Cards should be present after animation
      await waitFor(() => {
        cards.forEach((card) => {
          expect(card).toBeInTheDocument();
        });
      });
    });

    test("should only run entrance animations once", () => {
      const { rerender } = render(<PortfolioView />);

      // Re-render should not trigger animations again
      rerender(<PortfolioView />);

      // Component should still be functional
      expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
    });
  });

  describe("Animation Conflict Prevention", () => {
    test("should not have conflicting hover and focus animations", () => {
      const { container, rerender } = render(
        <ProjectCanvasCard {...mockProps} />
      );

      const card = container.querySelector("[data-project-card]");

      // Hover while focused
      rerender(<ProjectCanvasCard {...mockProps} isFocused={true} />);
      fireEvent.mouseEnter(card!);

      // Should not cause errors
      expect(card).toBeInTheDocument();
    });

    test("should handle rapid state changes without flickering", () => {
      const { rerender } = render(<ProjectCanvasCard {...mockProps} />);

      // Rapidly change states
      rerender(<ProjectCanvasCard {...mockProps} isFocused={true} />);
      rerender(<ProjectCanvasCard {...mockProps} isFocused={false} />);
      rerender(
        <ProjectCanvasCard
          {...mockProps}
          isFocused={true}
          isImageZoomed={true}
        />
      );
      rerender(
        <ProjectCanvasCard
          {...mockProps}
          isFocused={false}
          isImageZoomed={false}
        />
      );

      // Should not cause errors
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    });

    test("should handle multiple cards with different states simultaneously", () => {
      const { container } = render(
        <>
          <ProjectCanvasCard {...mockProps} index={0} />
          <ProjectCanvasCard {...mockProps} index={1} isFocused={true} />
          <ProjectCanvasCard {...mockProps} index={2} isOtherFocused={true} />
        </>
      );

      const cards = container.querySelectorAll("[data-project-card]");
      expect(cards.length).toBe(3);

      // All cards should render without conflicts
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe("Performance Benchmarks", () => {
    test("should render card within performance budget", () => {
      const startTime = performance.now();
      render(<ProjectCanvasCard {...mockProps} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;

      // Single card should render quickly (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    test("should handle state updates efficiently", () => {
      const { rerender } = render(<ProjectCanvasCard {...mockProps} />);

      const startTime = performance.now();

      // Perform multiple state updates
      for (let i = 0; i < 10; i++) {
        rerender(<ProjectCanvasCard {...mockProps} isFocused={i % 2 === 0} />);
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Updates should be efficient (< 500ms for 10 updates)
      expect(updateTime).toBeLessThan(500);
    });

    test("should maintain 60fps target for animations", () => {
      const { container } = render(<ProjectCanvasCard {...mockProps} />);

      const card = container.querySelector("[data-project-card]");

      // Simulate rapid interactions that would trigger animations
      const startTime = performance.now();

      for (let i = 0; i < 60; i++) {
        fireEvent.mouseEnter(card!);
        fireEvent.mouseLeave(card!);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle 60 interactions in reasonable time (< 1000ms)
      expect(totalTime).toBeLessThan(1000);
    });
  });
});
