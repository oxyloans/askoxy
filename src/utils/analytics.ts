import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-7F5MXCYZ7W";

let isInitialized = false;

export const initGA = () => {
  if (isInitialized) {
    console.log("GA already initialized, skipping");
    return;
  }

  if (typeof window === "undefined") return;

  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    isInitialized = true;
    console.log("Google Analytics initialized successfully");
  } catch (error) {
    console.error("Google Analytics initialization failed:", error);
  }
};

export const trackPage = (page: string) => {
  if (!isInitialized) {
    console.warn("GA not initialized, cannot track page:", page);
    return;
  }

  try {
    ReactGA.send({
      hitType: "pageview",
      page,
      title: document.title,
    });
  } catch (error) {
    console.error("Failed to track page:", page, error);
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
) => {
  if (!isInitialized) {
    console.warn("GA not initialized, cannot track event:", category, action);
    return;
  }

  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  } catch (error) {
    console.error("Failed to track event:", category, action, error);
  }
};

// ============================================================
// COMPREHENSIVE TRACKING HELPERS
// ============================================================

/**
 * Track a button click with optional metadata
 */
export const trackClick = (
  elementName: string,
  metadata?: Record<string, any>,
) => {
  trackEvent(
    "User Interaction",
    "click",
    elementName,
    metadata ? (JSON.stringify(metadata) as any) : undefined,
  );

  // Also send via gtag directly for richer data
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "click", {
        event_category: "User Interaction",
        event_label: elementName,
        ...(metadata || {}),
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (
  formName: string,
  metadata?: Record<string, any>,
) => {
  trackEvent("Form", "submit", formName);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "form_submit", {
        event_category: "Form",
        event_label: formName,
        ...(metadata || {}),
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track user engagement (time spent, scroll depth, etc.)
 */
export const trackEngagement = (
  action: string,
  label: string,
  value?: number,
) => {
  trackEvent("Engagement", action, label, value);
};

/**
 * Track outbound link clicks
 */
export const trackOutboundLink = (url: string, linkText?: string) => {
  trackEvent("Outbound Link", "click", url);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "outbound_click", {
        event_category: "Outbound Link",
        event_label: url,
        link_text: linkText || "",
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track search queries
 */
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent("Search", "query", searchTerm, resultsCount);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "search", {
        event_category: "Search",
        search_term: searchTerm,
        results_count: resultsCount,
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track user authentication events
 */
export const trackAuth = (
  action: "login" | "register" | "logout",
  method?: string,
) => {
  trackEvent("Authentication", action, method || "unknown");

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", action, {
        event_category: "Authentication",
        method: method || "unknown",
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track ecommerce/product events
 */
export const trackProductEvent = (
  action: "view" | "add_to_cart" | "purchase" | "remove_from_cart",
  productName: string,
  productId?: string,
  price?: number,
  quantity?: number,
) => {
  trackEvent("Ecommerce", action, productName, price);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", action, {
        event_category: "Ecommerce",
        items: [
          {
            item_name: productName,
            item_id: productId || "",
            price: price || 0,
            quantity: quantity || 1,
          },
        ],
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track error events
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  fatal: boolean = false,
) => {
  trackEvent("Error", errorType, errorMessage);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "exception", {
        description: `${errorType}: ${errorMessage}`,
        fatal,
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (
  featureName: string,
  action: string,
  metadata?: Record<string, any>,
) => {
  trackEvent("Feature", action, featureName);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "feature_usage", {
        event_category: "Feature",
        feature_name: featureName,
        action,
        ...(metadata || {}),
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track video interactions
 */
export const trackVideo = (
  action: "play" | "pause" | "complete" | "progress",
  videoTitle: string,
  videoUrl?: string,
  progress?: number,
) => {
  trackEvent("Video", action, videoTitle, progress);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "video_" + action, {
        event_category: "Video",
        video_title: videoTitle,
        video_url: videoUrl || "",
        progress_percent: progress,
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track file downloads
 */
export const trackDownload = (fileName: string, fileType?: string) => {
  trackEvent("Download", "file_download", fileName);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "file_download", {
        event_category: "Download",
        file_name: fileName,
        file_type: fileType || "unknown",
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track navigation/clicks on specific sections
 */
export const trackNavigation = (sectionName: string, destination: string) => {
  trackEvent("Navigation", sectionName, destination);
};

/**
 * Track scroll depth (call when user reaches certain %)
 */
export const trackScrollDepth = (percentage: number, pagePath: string) => {
  trackEvent("Scroll Depth", `${percentage}%`, pagePath, percentage);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "scroll_depth", {
        event_category: "Engagement",
        percent: percentage,
        page_path: pagePath,
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track AI feature usage (specific to this app's AI features)
 */
export const trackAIInteraction = (
  featureName: string,
  action: "prompt" | "response" | "error" | "share",
  metadata?: Record<string, any>,
) => {
  trackFeatureUsage(`AI:${featureName}`, action, metadata);
};

/**
 * Track job-related events
 */
export const trackJobEvent = (
  action: "view" | "apply" | "save" | "share",
  jobId: string,
  jobTitle?: string,
  company?: string,
) => {
  trackEvent("Jobs", action, jobTitle || jobId);

  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "job_" + action, {
        event_category: "Jobs",
        job_id: jobId,
        job_title: jobTitle || "",
        company: company || "",
      });
    } catch (error) {
      // silent fail
    }
  }
};

/**
 * Track study abroad events
 */
export const trackStudyAbroadEvent = (
  eventName: string,
  params?: Record<string, any>,
) => {
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", eventName, params);
    } catch (error) {
      console.error("Failed to track study abroad event:", eventName, error);
      // Fallback to ReactGA
      trackEvent("StudyAbroad", eventName, JSON.stringify(params));
    }
  } else {
    // Fallback to ReactGA
    trackEvent("StudyAbroad", eventName, JSON.stringify(params));
  }
};

// Simple page view tracker for Study Abroad pages
export const trackStudyAbroadPageView = () => {
  const pagePath = window.location.pathname + window.location.search;

  // Track via gtag directly (most reliable)
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("config", GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    } catch (error) {
      console.error("Failed to track study abroad page view:", error);
    }
  }

  // Also track via ReactGA
  trackPage(pagePath);
};

/**
 * Track user timing (how long operations take)
 */
export const trackTiming = (
  category: string,
  variable: string,
  value: number, // time in milliseconds
  label?: string,
) => {
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    try {
      (window as any).gtag("event", "timing_complete", {
        name: variable,
        value,
        event_category: category,
        event_label: label,
      });
    } catch (error) {
      // silent fail
    }
  }
};
