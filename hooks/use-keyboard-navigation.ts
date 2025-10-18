import { useEffect, useCallback } from "react";

interface UseKeyboardNavigationProps {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowKeys?: (direction: "up" | "down" | "left" | "right") => void;
  onTab?: (shiftKey: boolean) => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onEscape,
  onEnter,
  onArrowKeys,
  onTab,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onEscape?.();
          break;
        case "Enter":
          if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
            event.preventDefault();
            onEnter?.();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          onArrowKeys?.("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          onArrowKeys?.("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          onArrowKeys?.("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          onArrowKeys?.("right");
          break;
        case "Tab":
          onTab?.(event.shiftKey);
          break;
      }
    },
    [enabled, onEscape, onEnter, onArrowKeys, onTab]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [enabled, handleKeyDown]);
}
