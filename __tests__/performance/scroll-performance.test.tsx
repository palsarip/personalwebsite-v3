import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PortfolioView from "@/components/views/portfolio-view";
import { portfolioProjects } from "@/data/portfolio-data";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import test from "node:test";
import { afterEach } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

describe("Scroll Performance Tests", () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render portfolio with standard scrolling container", () => {
    const { container } = render(<PortfolioView />);

    // Find the scrollable container
    const scrollableContainer = container.querySelector(".overflow-y-auto");
    expect(scrollableContainer).toBeInTheDocument();
    expect(scrollableContainer).toHaveClass("overflow-y-auto");
  });

  test("should not have drag-to-pan functionality", () => {
    const { container } = render(<PortfolioView />);

    // Verify no cursor-grab classes
    const mainContainer = container.querySelector(".cursor-grab");
    expect(mainContainer).not.toBeInTheDocument();

    const grabbingContainer = container.querySelector(".cursor-grabbing");
    expect(grabbingContainer).not.toBeInTheDocument();
  });

  test("should render all projects without performance bottlenecks", () => {
    const startTime = performance.now();
    render(<PortfolioView />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Render should complete in reasonable time (< 1000ms)
    expect(renderTime).toBeLessThan(1000);
  });

  test("should handle large number of projects efficiently", () => {
    // Test with existing projects - rendering should be efficient
    const startTime = performance.now();
    const { container } = render(<PortfolioView />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Should render efficiently even with multiple projects
    expect(renderTime).toBeLessThan(2000);

    // Verify grid container exists
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();

    // Verify all projects are rendered
    const projectCards = container.querySelectorAll("[data-project-card]");
    expect(projectCards.length).toBe(portfolioProjects.length);
  });

  test("should use native browser scrolling", () => {
    const { container } = render(<PortfolioView />);

    const scrollableContainer = container.querySelector(".overflow-y-auto");
    expect(scrollableContainer).toBeInTheDocument();

    // Verify it has the overflow-y-auto class for standard scrolling
    expect(scrollableContainer).toHaveClass("overflow-y-auto");
  });

  test("should have smooth scroll behavior for focus interactions", () => {
    const { container } = render(<PortfolioView />);

    // Find a project card by data attribute
    const projectCard = container.querySelector("[data-project-card]");
    expect(projectCard).toBeInTheDocument();

    // Click to focus
    fireEvent.click(projectCard!);

    // Verify scrollIntoView was called with smooth behavior
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    );
  });

  test("should not have zoom functionality", () => {
    const { container } = render(<PortfolioView />);

    // Verify no zoom-related elements
    const zoomControls = container.querySelector("[data-zoom-control]");
    expect(zoomControls).not.toBeInTheDocument();
  });

  test("should not have minimap component", () => {
    const { container } = render(<PortfolioView />);

    // Verify minimap is not rendered
    const minimap = container.querySelector("[data-minimap]");
    expect(minimap).not.toBeInTheDocument();
  });

  test("should maintain responsive grid layout for performance", () => {
    const { container } = render(<PortfolioView />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass("grid");

    // Verify responsive classes
    expect(gridContainer?.className).toMatch(/grid-cols-1/);
    expect(gridContainer?.className).toMatch(/md:grid-cols-2/);
    expect(gridContainer?.className).toMatch(/lg:grid-cols-3/);
  });

  test("should have consistent gap spacing for smooth scrolling", () => {
    const { container } = render(<PortfolioView />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("gap-12");
  });
});
