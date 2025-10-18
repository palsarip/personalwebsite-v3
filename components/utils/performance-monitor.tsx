"use client";

import { useEffect } from "react";
import { trackPerformance } from "@/lib/analytics";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor page load performance
    if (typeof window !== "undefined" && "performance" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case "navigation":
              const navEntry = entry as PerformanceNavigationTiming;
              trackPerformance(
                "page_load_time",
                navEntry.loadEventEnd - navEntry.loadEventStart
              );
              trackPerformance(
                "dom_content_loaded",
                navEntry.domContentLoadedEventEnd -
                  navEntry.domContentLoadedEventStart
              );
              break;
            case "paint":
              trackPerformance(entry.name.replace("-", "_"), entry.startTime);
              break;
            case "largest-contentful-paint":
              trackPerformance("lcp", entry.startTime);
              break;
          }
        }
      });

      try {
        observer.observe({
          entryTypes: ["navigation", "paint", "largest-contentful-paint"],
        });
      } catch {
        console.warn("Performance observer not fully supported");
      }

      return () => observer.disconnect();
    }
    return undefined;
  }, []);

  return null; // This component doesn't render anything
}
