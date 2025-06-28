import { useEffect } from "react";

/**
 * Hook to add animation effects when elements scroll into view
 */
const useScrollAnimation = () => {
  useEffect(() => {
    // Observer callback function
    const observerCallback = (entries:any) => {
      entries.forEach((entry:any) => {
        // Add 'visible' class when element enters the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };

    // Create observer instance
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // use viewport as root
      rootMargin: "0px",
      threshold: 0.15, // trigger when at least 15% of the element is visible
    });

    // Select all elements to observe
    const elements = document.querySelectorAll(".fade-in-view");
    elements.forEach((el) => observer.observe(el));

    // Clean up observer on component unmount
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default useScrollAnimation;
