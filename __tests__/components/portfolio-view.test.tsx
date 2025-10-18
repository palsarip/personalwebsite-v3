import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioView from "@/components/views/portfolio-view";
import { gsap } from "gsap";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

// Mock the child components
jest.mock("@/components/project/project-canvas-card", () => {
  return function MockProjectCanvasCard({
    project,
    onSelect,
    onHover,
    isFocused,
    isOtherFocused,
    isOtherHovered,
  }: {
    project: { id: string; title: string };
    onSelect: (project: { id: string; title: string }) => void;
    onHover: (id: string | null) => void;
    isFocused: boolean;
    isOtherFocused: boolean;
    isOtherHovered: boolean;
  }) {
    return (
      <div
        data-testid={`project-card-${project.id}`}
        data-project-card={project.id}
        onClick={() => onSelect(project)}
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={() => onHover(null)}
        className={`canvas-project-card ${isFocused ? "focused" : ""} ${
          isOtherFocused ? "other-focused" : ""
        } ${isOtherHovered ? "other-hovered" : ""}`}
      >
        {project.title}
      </div>
    );
  };
});

jest.mock("@/components/project/project-modal", () => {
  return function MockProjectModal({
    isOpen,
    project,
    onClose,
  }: {
    isOpen: boolean;
    project?: { title: string };
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="project-modal" onClick={onClose}>
        {project?.title}
      </div>
    );
  };
});

jest.mock("@/components/project/project-sheet", () => {
  return function MockProjectSheet({
    isOpen,
    project,
    onClose,
  }: {
    isOpen: boolean;
    project?: { title: string };
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="project-sheet" onClick={onClose}>
        {project?.title}
      </div>
    );
  };
});

describe("PortfolioView - Task 8: Feature Verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("8.1 - Hover effects in grid layout", () => {
    it("should handle hover state changes", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);
      expect(cards.length).toBeGreaterThan(0);

      // Hover over first card
      await userEvent.hover(cards[0]);

      // Check that other cards have other-hovered class
      await waitFor(() => {
        expect(cards[1]).toHaveClass("other-hovered");
      });

      // Unhover
      await userEvent.unhover(cards[0]);

      await waitFor(() => {
        expect(cards[1]).not.toHaveClass("other-hovered");
      });
    });

    it("should show transparency effects when other cards are hovered", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Hover over first card
      fireEvent.mouseEnter(cards[0]);

      // Other cards should have transparency effect
      await waitFor(() => {
        expect(cards[1]).toHaveClass("other-hovered");
      });
    });
  });

  describe("8.2 - Focus states work correctly", () => {
    it("should focus a project when clicked", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Click first card to focus
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(cards[0]).toHaveClass("focused");
      });
    });

    it("should make other cards transparent when one is focused", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Focus first card
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(cards[0]).toHaveClass("focused");
        expect(cards[1]).toHaveClass("other-focused");
      });
    });

    it("should show shake animation when clicking another card while one is focused", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Focus first card
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(cards[0]).toHaveClass("focused");
      });

      // Try to click another card
      fireEvent.click(cards[1]);

      // GSAP animation should be called for shake effect
      expect(gsap.to).toHaveBeenCalled();
    });

    it("should scroll focused card into view", async () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Click to focus
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalled();
      });
    });
  });

  describe("8.3 - Keyboard navigation works", () => {
    it("should unfocus project when ESC is pressed", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Focus a card
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(cards[0]).toHaveClass("focused");
      });

      // Press ESC
      fireEvent.keyDown(window, { key: "Escape" });

      await waitFor(() => {
        expect(cards[0]).not.toHaveClass("focused");
      });
    });

    it("should unfocus when clicking empty area", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Focus a card
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(cards[0]).toHaveClass("focused");
      });

      // Click on empty area (the scrollable container)
      const container = screen.getByText("Portfolio").closest("div")
        ?.parentElement?.parentElement;
      if (container) {
        fireEvent.click(container);
      }

      await waitFor(() => {
        expect(cards[0]).not.toHaveClass("focused");
      });
    });
  });

  describe("8.6 - Entrance animations", () => {
    it("should trigger entrance animations on mount", async () => {
      render(<PortfolioView />);

      // GSAP fromTo should be called for entrance animation
      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          ".canvas-project-card",
          expect.objectContaining({ opacity: 0, scale: 0.8, y: 20 }),
          expect.objectContaining({
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
          })
        );
      });
    });

    it("should only run entrance animation once", async () => {
      const { rerender } = render(<PortfolioView />);

      const initialCallCount = (gsap.fromTo as jest.Mock).mock.calls.length;

      // Rerender component
      rerender(<PortfolioView />);

      // Animation should not be called again
      expect((gsap.fromTo as jest.Mock).mock.calls.length).toBe(
        initialCallCount
      );
    });
  });

  describe("Grid Layout", () => {
    it("should render header section", () => {
      render(<PortfolioView />);

      expect(screen.getByText("Portfolio")).toBeInTheDocument();
      expect(
        screen.getByText(/A curated collection of my work/i)
      ).toBeInTheDocument();
    });

    it("should render navigation hints", () => {
      render(<PortfolioView />);

      expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
    });

    it("should update navigation hint when project is focused", async () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);

      // Focus a card
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(screen.getByText(/Press/i)).toBeInTheDocument();
        expect(screen.getByText(/ESC/i)).toBeInTheDocument();
      });
    });

    it("should render all project cards in grid", () => {
      render(<PortfolioView />);

      const cards = screen.getAllByTestId(/project-card-/);
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
