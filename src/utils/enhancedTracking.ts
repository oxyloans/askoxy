/**
 * Enhanced Automatic Tracking Utilities
 * 
 * These utilities add automatic, global tracking to the entire application
 * without needing to modify each component individually.
 * 
 * Features:
 * - Automatic click tracking on interactive elements
 * - Scroll depth tracking
 * - Time-on-page / engagement tracking
 * - Outbound link detection
 * - Form submission tracking
 * - Global error tracking
 * - Page visibility (tab focus/blur) tracking
 */

import { trackEvent, trackEngagement, trackError, trackOutboundLink, trackFormSubmit, trackScrollDepth } from "./analytics";

// ─── Scroll Depth Tracking ────────────────────────────────────────────────
let scrollDepthTracked = new Set<number>();

export const initScrollDepthTracking = (): (() => void) => {
  scrollDepthTracked = new Set<number>();
  const depths = [25, 50, 75, 90, 100];

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);

    depths.forEach((depth) => {
      if (percent >= depth && !scrollDepthTracked.has(depth)) {
        scrollDepthTracked.add(depth);
        trackScrollDepth(depth, window.location.pathname);
      }
    });
  };

  // Debounced scroll handler
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
};

// ─── Time-on-Page / Engagement Tracking ──────────────────────────────────
let engagementInterval: ReturnType<typeof setInterval> | null = null;
let timeOnPageSeconds = 0;

export const startEngagementTracking = (): (() => void) => {
  timeOnPageSeconds = 0;
  
  engagementInterval = setInterval(() => {
    timeOnPageSeconds++;
    // Track milestones: 30s, 60s, 120s, 180s, 300s, 600s
    const milestones = [30, 60, 120, 180, 300, 600];
    if (milestones.includes(timeOnPageSeconds)) {
      trackEngagement(
        "time_on_page",
        `${timeOnPageSeconds}s`,
        timeOnPageSeconds
      );
    }
  }, 1000);

  return () => {
    if (engagementInterval) {
      clearInterval(engagementInterval);
      engagementInterval = null;
    }
  };
};

// ─── Page Visibility Tracking ─────────────────────────────────────────────
export const initVisibilityTracking = (): (() => void) => {
  const handleVisibility = () => {
    if (document.hidden) {
      trackEvent("Engagement", "tab_hidden", window.location.pathname);
    } else {
      trackEvent("Engagement", "tab_visible", window.location.pathname);
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);
  return () => document.removeEventListener("visibilitychange", handleVisibility);
};

// ─── Automatic Click Tracking via Event Delegation ───────────────────────
const CLICK_TRACK_SELECTORS = [
  "button",
  "a[href]",
  "[role='button']",
  "[data-track]",
  ".btn",
  "[onclick]",
];

export const initAutoClickTracking = (): (() => void) => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // Find the closest interactive element
    const el = target.closest<HTMLElement>(
      CLICK_TRACK_SELECTORS.join(",")
    );
    if (!el) return;

    // Skip if it has a no-track attribute
    if (el.hasAttribute("data-no-track")) return;

    // Check for custom data attributes first
    if (el.hasAttribute("data-track")) {
      const eventName = el.getAttribute("data-track") || "";
      const category = el.getAttribute("data-category") || "Custom Event";
      const label = el.getAttribute("data-label") || "";
      trackEvent(category, eventName, label);
      return;
    }

    // Determine element identity
    const tagName = el.tagName.toLowerCase();
    const text = (el.textContent || "").trim().substring(0, 100);
    const href = el.getAttribute("href") || "";
    const id = el.id || "";

    // Build a descriptive label
    const label = `[${tagName}]${id ? `#${id}` : ""}${text ? ` "${text}"` : ""}`;

    // Track outbound links separately
    if (tagName === "a" && href) {
      const isExternal = href.startsWith("http") && !href.includes(window.location.hostname);
      if (isExternal) {
        trackOutboundLink(href, text);
        return;
      }
      // Internal link click
      trackEvent("Navigation", "click", label);
      return;
    }

    // Button clicks
    if (tagName === "button" || el.getAttribute("role") === "button") {
      trackEvent("User Interaction", "click", label);
      return;
    }

    // Fallback: generic click tracking
    trackEvent("User Interaction", "click", label);
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
};

// ─── Automatic Form Submission Tracking ──────────────────────────────────
export const initAutoFormTracking = (): (() => void) => {
  const handleSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form || !form.tagName || form.tagName.toLowerCase() !== "form") return;
    if (form.hasAttribute("data-no-track")) return;

    const formName =
      form.getAttribute("name") ||
      form.getAttribute("data-form-name") ||
      form.id ||
      `form_${(form.getAttribute("action") || "").substring(0, 60)}`;

    // Collect some basic metadata
    const formData = new FormData(form);
    const hasFile = Array.from(formData.values()).some((v) => v instanceof File);
    
    trackFormSubmit(formName, {
      hasFile,
      formAction: form.action || "",
      formMethod: form.method || "get",
    });
  };

  document.addEventListener("submit", handleSubmit, true);
  return () => document.removeEventListener("submit", handleSubmit, true);
};

// ─── Global Error Tracking ────────────────────────────────────────────────
export const initErrorTracking = (): (() => void) => {
  const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
    if (event instanceof PromiseRejectionEvent) {
      trackError(
        "unhandled_promise_rejection",
        (event.reason?.message || event.reason || "Unknown promise rejection").substring(0, 200),
        false
      );
    } else {
      trackError(
        "uncaught_exception",
        (event.message || "Unknown error").substring(0, 200),
        !event.error?.stack?.includes("node_modules")
      );
    }
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleError);
  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleError);
  };
};

// ─── Performance / Web Vitals Tracking ────────────────────────────────────
export const initPerformanceTracking = (): (() => void) => {
  const isSupported = typeof window !== "undefined" &&
    window.performance &&
    typeof window.performance.getEntriesByType === "function";

  if (!isSupported) return () => {};

  // Track page load performance after the page has fully loaded
  const handleLoad = () => {
    setTimeout(() => {
      try {
        const perfEntries = performance.getEntriesByType("navigation");
        if (perfEntries.length > 0) {
          const navEntry = perfEntries[0] as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          const windowLoad = navEntry.loadEventEnd - navEntry.loadEventStart;

          if (ttfb > 0) {
            trackEvent("Performance", "TTFB", window.location.pathname, ttfb);
          }
          if (windowLoad > 0) {
            trackEvent("Performance", "page_load", window.location.pathname, windowLoad);
          }
        }

        // Track Largest Contentful Paint
        if (typeof PerformanceObserver !== "undefined") {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              if (entries.length > 0) {
                const lcpEntry = entries[entries.length - 1] as any;
                trackEvent("Performance", "LCP", window.location.pathname, Math.round(lcpEntry.startTime));
              }
            });
            lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
          } catch (e) {
            // silent fail - browser may not support LCP
          }
        }
      } catch (e) {
        // silent fail
      }
    }, 3000);
  };

  window.addEventListener("load", handleLoad);
  return () => window.removeEventListener("load", handleLoad);
};

// ─── Initialize All Automatic Tracking ────────────────────────────────────
export interface TrackingOptions {
  scrollDepth?: boolean;
  engagement?: boolean;
  visibility?: boolean;
  autoClick?: boolean;
  autoForm?: boolean;
  errors?: boolean;
  performance?: boolean;
}

const defaultOptions: TrackingOptions = {
  scrollDepth: true,
  engagement: true,
  visibility: true,
  autoClick: true,
  autoForm: true,
  errors: true,
  performance: true,
};

export const initEnhancedTracking = (options?: TrackingOptions): (() => void) => {
  const opts = { ...defaultOptions, ...options };
  const cleanups: (() => void)[] = [];

  if (opts.scrollDepth) cleanups.push(initScrollDepthTracking());
  if (opts.engagement) cleanups.push(startEngagementTracking());
  if (opts.visibility) cleanups.push(initVisibilityTracking());
  if (opts.autoClick) cleanups.push(initAutoClickTracking());
  if (opts.autoForm) cleanups.push(initAutoFormTracking());
  if (opts.errors) cleanups.push(initErrorTracking());
  if (opts.performance) cleanups.push(initPerformanceTracking());

  // Return a cleanup function
  return () => {
    cleanups.forEach((fn) => fn());
  };
};