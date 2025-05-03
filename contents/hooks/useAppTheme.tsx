import { useEffect, useState } from "react";

import type { Theme } from "~contents/types/theme";

/**
 * Custom hook that detects and monitors the application's current theme.
 * Returns the current theme as either "dark" or "light".
 */
export const useAppTheme = (): Theme => {
  /**
   * Determines the current theme by checking for dark mode indicators
   * in both HTML and BODY elements.
   *
   * @returns {"dark" | "light"} The detected theme
   */
  const getCurrentTheme = (): Theme => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Check if HTML element has dark mode indicators through:
    // 1. A "dark" class
    // 2. A "data-theme" attribute set to "dark"
    // 3. A "data-mode" attribute set to "dark"
    const htmlHasDark = htmlElement.classList.contains("dark") || htmlElement.getAttribute("data-theme") === "dark" || htmlElement.getAttribute("data-mode") === "dark";

    // Similarly check if BODY element has any dark mode indicators
    const bodyHasDark = bodyElement.classList.contains("dark") || bodyElement.getAttribute("data-theme") === "dark" || bodyElement.getAttribute("data-mode") === "dark";

    // Return "dark" if any dark mode indicator is found, otherwise "light"
    return htmlHasDark || bodyHasDark ? "dark" : "light";
  };

  // Initialize theme state using lazy initialization to avoid unnecessary computation
  // during component rendering. This is particularly important for SSR applications.
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);

  // Set up a MutationObserver to watch for changes in the document's class attribute.
  // This allows the component to dynamically update its theme if the user toggles between light and dark modes.
  useEffect(() => {
    // Create a MutationObserver to detect theme changes in real-time
    // This is necessary because theme changes might happen outside React's control
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });

    // Observe the HTML element for changes to class, data-theme, and data-mode attributes
    // These are common attributes that frameworks and libraries use to indicate theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"]
    });

    // Also observe the BODY element for the same theme-related attribute changes
    // Some applications apply theme classes to the body instead of the HTML element
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode"]
    });

    // Clean up function to disconnect the observer when the component unmounts
    // This prevents memory leaks and unnecessary processing
    return () => observer.disconnect();
  }, []);

  // Return the current theme for consumers of this hook
  return theme;
};
