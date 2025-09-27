// Performance monitoring and analytics
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled =
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost");
  }

  private log(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    this.events.push(event);
    console.log("Analytics:", event);

    // Here you would send to your analytics service
    // Example: gtag('event', event.action, { ... })
  }

  trackPageView(page: string) {
    this.log({
      action: "page_view",
      category: "navigation",
      label: page,
      timestamp: Date.now(),
    });
  }

  trackInteraction(action: string, element: string, value?: number) {
    this.log({
      action,
      category: "interaction",
      label: element,
      value,
      timestamp: Date.now(),
    });
  }

  trackPerformance(metric: string, value: number) {
    this.log({
      action: "performance",
      category: "web_vitals",
      label: metric,
      value,
      timestamp: Date.now(),
    });
  }

  trackError(error: Error, context?: string) {
    this.log({
      action: "error",
      category: "javascript",
      label: `${error.name}: ${error.message}${context ? ` (${context})` : ""}`,
      timestamp: Date.now(),
    });
  }

  getEvents() {
    return [...this.events];
  }
}

const analytics = new Analytics();

export const trackPageView = analytics.trackPageView.bind(analytics);
export const trackInteraction = analytics.trackInteraction.bind(analytics);
export const trackPerformance = analytics.trackPerformance.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);

// Web Vitals tracking
export const reportWebVitals = (metric: any) => {
  trackPerformance(metric.name, metric.value);
};

// Performance observer for monitoring
if (typeof window !== "undefined") {
  // Monitor Long Tasks
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            trackPerformance("long_task", entry.duration);
          }
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
}
